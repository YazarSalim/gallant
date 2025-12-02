import prisma from "../../../models/index.js";

// -------------------- CREATE SITE --------------------
const createSiteService = async (data) => {
  try {
    const { siteCode, siteName, clientId } = data;

    if (!siteCode) throw new Error("SiteCode is required");
    if (!siteName) throw new Error("SiteName is required");
    if (!clientId) throw new Error("Client is required");

    const existingSite = await prisma.site.findFirst({
      where: {
        siteName,
        clientId: Number(clientId),
        isDeleted: false,
      },
    });

    if (existingSite) {
      throw new Error("A site with this name already exists for this client");
    }

    const existingCode = await prisma.site.findFirst({
      where: {
        siteCode,
        clientId: Number(clientId),
        isDeleted: false,
      },
    });

    if (existingCode) {
      throw new Error("A site with this code already exists for this client");
    }

    // Create new site
    const newSite = await prisma.site.create({
      data: {
        siteCode,
        siteName,
        clientId: Number(clientId),
      },
    });

    return newSite;
  } catch (error) {
    throw error;
  }
};


// -------------------- UPDATE SITE --------------------
const updateSiteService = async (id, data) => {
  try {
    const siteIdNum = Number(id);
    const { siteName, clientId } = data;

    const existingSite = await prisma.site.findUnique({ where: { id: siteIdNum } });
    if (!existingSite) throw new Error("Site Not Found");

    // Check if another site with the same name exists under the same client
    if (siteName && clientId) {
      const duplicateSite = await prisma.site.findFirst({
        where: {
          siteName,
          clientId: Number(clientId),
          isDeleted: false,
          NOT: { id: siteIdNum }, // Exclude current site
        },
      });

      if (duplicateSite) {
        throw new Error("Another site with this name already exists for this client");
      }
    }

    const updatedSite = await prisma.site.update({
      where: { id: siteIdNum },
      data: { ...data, clientId: Number(clientId) },
    });

    return updatedSite;
  } catch (error) {
    throw error;
  }
};


// -------------------- DELETE SITE --------------------
const deleteSiteService = async (id) => {
  try {
    const siteIdNum = Number(id);

    const existingSite = await prisma.site.findUnique({ where: { id: siteIdNum } });
    if (!existingSite) throw new Error("Site Not Found");

    const deletedSite = await prisma.site.update({
      where: { id: siteIdNum },
      data: { isDeleted: true },
    });

    return deletedSite;
  } catch (error) {
    throw error;
  }
};

// -------------------- GET ALL SITES --------------------
const getAllSitesService = async ({ page = 1, limit = 10, search = "" }) => {
  try {
    const skip = (page - 1) * limit;

    // Build where filters dynamically
    const filters = [{ isDeleted: false }];
    if (search) {
      filters.push({
        OR: [
          { siteName: { contains: search, mode: "insensitive" } },
          { siteCode: { contains: search, mode: "insensitive" } },
          { client: { is: { clientName: { contains: search, mode: "insensitive" } } } },
        ],
      });
    }

    const sites = await prisma.site.findMany({
      where: { AND: filters },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        siteCode: true,
        siteName: true,
        clientId: true,
        client: { select: { clientName: true } },
      },
    });

    const totalCount = await prisma.site.count({ where: { AND: filters } });

    return {
      data: sites.map((site) => ({
        id: site.id,
        siteCode: site.siteCode,
        siteName: site.siteName,
        clientId: site.clientId,
        clientName: site.client.clientName,
      })),
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

// -------------------- GET SITES BY CLIENT --------------------
const getSitesByClientService = async (clientId) => {
  try {
    const sites = await prisma.site.findMany({
      where: { clientId: Number(clientId), isDeleted: false },
      select: { id: true, siteName: true },
    });
    return sites;
  } catch (error) {
    throw error;
  }
};

// -------------------- GET SITE BY ID --------------------
const getSiteByIdService = async (id) => {
  try {
    const siteIdNum = Number(id);

    const site = await prisma.site.findUnique({
      where: { id: siteIdNum },
      include: { client: { select: { clientName: true, id: true } } },
    });

    if (!site) throw new Error("No site found");

    return {
      id: site.id,
      siteName: site.siteName,
      siteCode: site.siteCode,
      clientId: site.clientId,
      clientName: site.client?.clientName ?? "",
    };
  } catch (error) {
    throw error;
  }
};

export default {
  createSiteService,
  updateSiteService,
  deleteSiteService,
  getAllSitesService,
  getSitesByClientService,
  getSiteByIdService,
};
