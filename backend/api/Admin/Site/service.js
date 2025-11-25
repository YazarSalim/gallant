import prisma from "../../../models/index.js";

const createSiteService = async (data) => {
  try {
    const { siteCode, siteName, clientId } = data;

    if (!siteCode) throw new Error("SiteCode is required");
    if (!siteName) throw new Error("SiteName is required");
    if (!clientId) throw new Error("Client is required");

    const existsSite = await prisma.site.findUnique({
      where: { siteCode },
    });

    if (existsSite) throw new Error("Site with this code already exists");
    const newSite = await prisma.site.create({
      data: { siteCode, siteName, clientId: Number(clientId) },
    });
    return newSite;
  } catch (error) {
    throw error;
  }
};

const updateSiteService = async (id, data) => {
  
  try {
    const existingSite = await prisma.site.findUnique({
      where: { id: Number(id) },
    });

    if (!existingSite) throw new Error("Site Not Found");
    const updatedSite = await prisma.site.update({
      where: { id: Number(id) },
      data:{...data,clientId:Number(data.clientId)},
    });
    return updatedSite;
  } catch (error) {
    throw error;
  }
};

const deleteSiteService = async (id) => {
  try {
    const existingSite = await prisma.site.findUnique({
      where: { id: Number(id) },
    });

    if (!existingSite) throw new Error("Site Not Found");
    const deletedSite = await prisma.site.update({
      where: { id: Number(id) },
      data: { isDeleted: true },
    });
    return deletedSite;
  } catch (error) {
    throw error;
  }
};

// const getAllSitesService = async ({ page=1, limit=10 ,search}) => {
//   try {
//     const skip = (page - 1) * limit;
//     const take = limit;

// const sites = await prisma.site.findMany({
//   where: { isDeleted: false },
//   skip,
//   take,
//   orderBy: { createdAt: "desc" },
//   select: {
//     id: true,
//     siteCode: true,
//     siteName: true,

//     // foreign key from site table
//     clientId: true,

//     // relation field for name
//     client: {
//       select: {
//         clientName: true,
//       },
//     },
//   },
// });

//     const totalCount = await prisma.site.count({
//       where: { isDeleted: false },
//     });

    

//     return {
//       data: sites.map((site) => ({
//         id: site.id,
//         siteCode: site.siteCode,
//         siteName: site.siteName,
//         clientId: site.clientId,
//         clientName: site.client.clientName,
//       })),
//       pagination: {
//         total: totalCount,
//         page,
//         limit,
//         totalPages: Math.ceil(totalCount / limit),
//       },
//     };
//   } catch (error) {
//     throw error;
//   }
// };


const getAllSitesService = async ({ page = 1, limit = 10, search ="" }) => {
  try {
    const skip = (page - 1) * limit;
    const take = limit;

    const whereClause = {
      isDeleted: false,
      OR: search
        ? [
            { siteName: { contains: search, mode: "insensitive" } },
            { siteCode: { contains: search, mode: "insensitive" } },
            {
              client: {
                is: {
                  clientName: { contains: search, mode: "insensitive" },
                },
              },
            },
          ]
        : undefined,
    };

    const sites = await prisma.site.findMany({
      where: whereClause,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        siteCode: true,
        siteName: true,
        clientId: true,
        client: {
          select: {
            clientName: true,
          },
        },
      },
    });

    const totalCount = await prisma.site.count({
      where: whereClause,
    });

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
    console.log(" Prisma error:", error);
    throw error;
  }
};


const getSitesByClientService = async (clientId) => {
  try {
    const sites = await prisma.site.findMany({
      where: {
        clientId: Number(clientId),
        isDeleted: false,
      },
      select: {
        id: true,
        siteName: true,
      },
    });
    if(!sites.length) throw new Error("No sites found")
    return sites;
  } catch (error) {
    throw error
  }
};

 const getSiteByIdService = async (id) => {
  try {
    const site = await prisma.site.findUnique({
      where: { id :Number(id)},
      include: {
        client: {
          select: { clientName: true, id: true },
        },
      },
    });

    if (!site) {
      return null;
    }

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
  getSiteByIdService
};
