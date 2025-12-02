import prisma from "../../../models/index.js";

// -------------------- CREATE CLIENT --------------------
const createClientService = async (data) => {
  try {
    const { clientCode, clientName, contact } = data;

    // Check uniqueness manually
    const [codeExists, nameExists] = await Promise.all([
      prisma.client.findUnique({ where: { clientCode } }),
      prisma.client.findFirst({ where: { clientName } }),
    ]);

    if (codeExists) throw new Error("Client Code already exists");
    if (nameExists) throw new Error("Client Name already exists");

    const newClient = await prisma.client.create({
      data: { clientCode, clientName, contact },
    });

    return newClient;
  } catch (error) {
    throw error;
  }
};

const updateClientService = async (id, data) => {
  try {
    const clientIdNum = Number(id);

    const existing = await prisma.client.findUnique({
      where: { id: clientIdNum },
    });
    if (!existing) throw new Error("Client not found");

    if (data.clientCode) {
      const codeExists = await prisma.client.findFirst({
        where: { clientCode: data.clientCode, NOT: { id: clientIdNum } },
      });
      if (codeExists) throw new Error("Client Code already exists");
    }

    if (data.clientName) {
      const nameExists = await prisma.client.findFirst({
        where: { clientName: data.clientName, NOT: { id: clientIdNum } },
      });
      if (nameExists) throw new Error("Client Name already exists");
    }

    const updated = await prisma.client.update({
      where: { id: clientIdNum },
      data,
    });

    return updated;
  } catch (error) {
    throw error;
  }
};

const deleteClientService = async (id) => {
  try {
    const clientIdNum = Number(id);

    const existing = await prisma.client.findUnique({
      where: { id: clientIdNum },
    });
    if (!existing) throw new Error("Client not found");

    const [deletedClient] = await prisma.$transaction([
      prisma.client.update({
        where: { id: clientIdNum },
        data: { isDeleted: true },
      }),
      prisma.site.updateMany({
        where: { clientId: clientIdNum, isDeleted: false },
        data: { isDeleted: true },
      }),
      prisma.job.updateMany({
        where: { clientId: clientIdNum, isDeleted: false },
        data: { isDeleted: true },
      }),
    ]);

    return deletedClient;
  } catch (error) {
    throw error;
  }
};

const getAllClientsService = async ({ page = 1, limit = 10, search = "", date }) => {
  try {
    const skip = (page - 1) * limit;
    const filters = [{ isDeleted: false }];
    if (search) {
      filters.push({
        OR: [
          { clientName: { contains: search, mode: "insensitive" } },
          { clientCode: { contains: search, mode: "insensitive" } },
          { contact: { contains: search, mode: "insensitive" } },
        ],
      });
    }
    if (date) {
      filters.push({
        createdAt: {
          gte: new Date(date + "T00:00:00.000Z"),
          lte: new Date(date + "T23:59:59.999Z"),
        },
      });
    }

    const clients = await prisma.client.findMany({
      where: { AND: filters },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const totalCount = await prisma.client.count({ where: { AND: filters } });

    return {
      data: clients,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

const getClientByIdService = async (id) => {
  try {
    const clientIdNum = Number(id);

    const existing = await prisma.client.findUnique({
      where: { id: clientIdNum },
    });
    if (!existing) throw new Error("Client not found");

    return existing;
  } catch (error) {
    throw error;
  }
};

export default {
  createClientService,
  updateClientService,
  deleteClientService,
  getAllClientsService,
  getClientByIdService,
};
