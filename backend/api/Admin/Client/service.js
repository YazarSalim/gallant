import prisma from "../../../models/index.js";

const createClientService = async (data) => {
  try {
    const { clientCode, clientName, contact } = data;
    const codeExists = await prisma.client.findUnique({
      where: { clientCode },
    });

    if (codeExists) {
      throw new Error("Client Code already exists");
    }
    const nameExists = await prisma.client.findFirst({
      where: { clientName },
    });

    if (nameExists) {
      throw new Error("Client Name already exists");
    }

    const newClient = await prisma.client.create({
      data: {
        clientCode,
        clientName,
        contact,
      },
    });

    return newClient;
  } catch (error) {
    throw error;
  }
};

const updateClientService = async (id, data) => {
  try {
    const existing = await prisma.client.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) throw new Error("Client not found");

    const updated = await prisma.client.update({
      where: { id: Number(id) },
      data,
    });

    return updated;
  } catch (error) {
    throw error;
  }
};

const deleteClientService = async (id) => {
  try {
    const existing = await prisma.client.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) throw new Error("Client not found");

    const deleted = await prisma.client.update({
      where: { id: Number(id) },
      data: { isDeleted: true },
    });
    const clientIdNum = Number(id);
    await prisma.site.updateMany({
      where: { clientId: clientIdNum, isDeleted: false },
      data: { isDeleted: true },
    });

    await prisma.job.updateMany({
      where: { clientId: clientIdNum, isDeleted: false },
      data: { isDeleted: true },
    });

    return deleted;
  } catch (error) {
    throw error;
  }
};

const getAllClientsService = async ({
  page = 1,
  limit = 10,
  search = "",
  date,
}) => {
  try {
    const skip = (page - 1) * limit;
    const take = limit;

    const where = {
      isDeleted: false,
      AND: [
        // Search filter
        search
          ? {
              OR: [
                { clientName: { contains: search, mode: "insensitive" } },
                { clientCode: { contains: search, mode: "insensitive" } },
                { contact: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        // Single date filter
        date
          ? {
              createdAt: {
                gte: new Date(date + "T00:00:00.000Z"),
                lte: new Date(date + "T23:59:59.999Z"),
              },
            }
          : {},
      ],
    };

    const clients = await prisma.client.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });

    const totalCount = await prisma.client.count({ where });

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
    const existing = await prisma.client.findUnique({
      where: { id: Number(id) },
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
