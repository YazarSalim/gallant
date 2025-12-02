import { Prisma } from "@prisma/client";
import prisma from "../../../models/index.js";

const getKpiValuesService = async ({ clientId, siteId, jobId, entryDate }) => {
  try {
    const values = await prisma.kpiValue.findMany({
      where: {
        clientId,
        siteId,
        jobId,
        entryDate: new Date(entryDate),
      },
      include: {
        kpi: true,
        category: true,
      },
    });

    return values;
  } catch (error) {
    throw new Error(error.message);
  }
};

 const saveKpiValuesService = async ({
  clientId,
  siteId,
  jobId,
  userId,
  entryDate,
  values,
}) => {
  try {
    const date = new Date(entryDate);

    // Prepare all create operations for KPI values
    const kpiValueOperations = values.map((item) =>
      prisma.kpiValue.create({
        data: {
          entryDate: date,
          value: item.value,
          client: { connect: { id: clientId } },
          site: { connect: { id: siteId } },
          job: { connect: { id: jobId } },
          kpi: { connect: { id: item.kpiId } },
          category: { connect: { id: item.categoryId } },
        },
      })
    );

    // Create the KPI entry log
    const kpiEntryLogOperation = prisma.kpiEntryLog.create({
      data: {
        entryDate: date,
        client: { connect: { id: clientId } },
        site: { connect: { id: siteId } },
        job: { connect: { id: jobId } },
        user: { connect: { id: userId } },
      },
    });

    // Execute all operations in a transaction
    await prisma.$transaction([...kpiValueOperations, kpiEntryLogOperation]);

    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(
        "KPI values for this client, site, job, and date already exist"
      );
    }
    throw new Error(error.message);
  }
};


const summaryKpiValuesService = async ({ clientId, siteId, jobId, from, to }) => {
  try {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const grouped = await prisma.kpiValue.groupBy({
      by: ["kpiId", "categoryId"],
      where: {
        clientId,
        siteId,
        jobId,
        entryDate: {
          gte: fromDate,
          lte: toDate,
        },
      },
      _sum: { value: true },
    });

    const kpis = await prisma.kpi.findMany();
    const categories = await prisma.category.findMany();

    const kpiMap = Object.fromEntries(kpis.map((k) => [k.id, k.name]));
    const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

    return grouped.map((g) => ({
      kpiId: g.kpiId,
      categoryId: g.categoryId,
      total: g._sum.value,
      kpiName: kpiMap[g.kpiId],
      categoryName: categoryMap[g.categoryId],
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

// const getKpiEntryLogsService = async ({ page = 1, limit = 10, search = "", date }) => {
//   try {
//     const skip = (page - 1) * limit;

//     let dateFilter = {};
//     if (date) {
//       const selectedDate = new Date(date);
//       const nextDay = new Date(selectedDate);
//       nextDay.setDate(nextDay.getDate() + 1);

//       dateFilter = {
//         entryDate: {
//           gte: selectedDate,
//           lt: nextDay,
//         },
//       };
//     }

//     const searchFilter = search
//       ? {
//           OR: [
//             { client: { clientName: { contains: search, mode: "insensitive" } } },
//             { site: { siteName: { contains: search, mode: "insensitive" } } },
//             { job: { jobName: { contains: search, mode: "insensitive" } } },
//           ],
//         }
//       : {};

//     const whereCondition = {
//       isDeleted: false,
//       ...dateFilter,
//       ...searchFilter,
//     };

//     const totalCount = await prisma.kpiEntryLog.count({ where: whereCondition });

//     const logs = await prisma.kpiEntryLog.findMany({
//       skip,
//       take: Number(limit),
//       orderBy: { entryDate: "desc" },
//       where: whereCondition,
//       include: {
//         client: true,
//         site: true,
//         job: true,
//       },
//     });

//     return {
//       data: logs,
//       pagination: {
//         total: totalCount,
//         page: Number(page),
//         limit: Number(limit),
//         totalPages: Math.ceil(totalCount / limit),
//       },
//     };
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

const getKpiEntryLogsService = async ({
  page = 1,
  limit = 10,
  search = "",
  date,
  clientId,
  siteId,
  jobId,
  sortField = "id",       // default sort column
  sortOrder = "desc",     // ASC or DESC
}) => {
  try {
    const skip = (page - 1) * limit;
    const take = Number(limit);

    // --- Build WHERE conditions dynamically ---
    const where = {
      isDeleted: false,
      AND: [
        // Text search
        search
          ? {
              OR: [
                {
                  client: {
                    clientName: { contains: search, mode: "insensitive" },
                  },
                },
                {
                  site: {
                    siteName: { contains: search, mode: "insensitive" },
                  },
                },
                {
                  job: {
                    jobName: { contains: search, mode: "insensitive" },
                  },
                },
              ],
            }
          : {},

        // Date filter
        date
          ? {
              entryDate: {
                gte: new Date(date + "T00:00:00.000Z"),
                lte: new Date(date + "T23:59:59.999Z"),
              },
            }
          : {},

        // Client filter
        clientId ? { clientId: Number(clientId) } : {},

        // Site filter
        siteId ? { siteId: Number(siteId) } : {},

        // Job filter
        jobId ? { jobId: Number(jobId) } : {},
      ],
    };

    // --- Build sorting dynamically ---
    const orderBy = {};
    orderBy[sortField] =
      sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

    // --- Fetch logs ---
    const logs = await prisma.kpiEntryLog.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        client: true,
        site: true,
        job: true,
      },
    });

    // --- Total count ---
    const total = await prisma.kpiEntryLog.count({ where });

    return {
      data: logs,
      pagination: {
        total: total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(error.message || "Failed to fetch KPI Entry Logs");
  }
};

const updateKpiValuesService = async (payload) => {
  try {
    const { clientId, siteId, jobId, entryDate, values } = payload;

    if (!clientId || !siteId || !jobId || !entryDate || !Array.isArray(values)) {
      throw new Error("Invalid payload");
    }

    const entryDateObj = new Date(entryDate);
    if (isNaN(entryDateObj.getTime())) throw new Error("Invalid entryDate format");

    await prisma.kpiValue.deleteMany({
      where: {
        clientId: Number(clientId),
        siteId: Number(siteId),
        jobId: Number(jobId),
        entryDate: entryDateObj,
      },
    });

    const newValues = values.map((v) => ({
      ...v,
      clientId: Number(clientId),
      siteId: Number(siteId),
      jobId: Number(jobId),
      entryDate: entryDateObj,
    }));

    return prisma.kpiValue.createMany({ data: newValues });
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteKpiEntryService = async (id) => {
  try {
    return prisma.kpiEntryLog.update({
      where: { id: Number(id) },
      data: { isDeleted: true },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};


const getFixedSummaryByDateRangeService = async ({
  clientId,
  siteId,
  jobId,
  startDate,
  endDate,
}) => {
  return await prisma.kpiEntryLog.findMany({
    where: {
      entryDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      isDeleted: false,
      clientId: clientId ? Number(clientId) : undefined,
      siteId: siteId ? Number(siteId) : undefined,
      jobId: jobId ? Number(jobId) : undefined,
    },
    include: {
      client: { select: { clientName: true } },
      site: { select: { siteName: true } },
      job: { select: { jobName: true } },
    },
    orderBy: { entryDate: "desc" },
  });
};

export default {
  saveKpiValuesService,
  getKpiValuesService,
  summaryKpiValuesService,
  getKpiEntryLogsService,
  updateKpiValuesService,
  deleteKpiEntryService,
  getFixedSummaryByDateRangeService
};
