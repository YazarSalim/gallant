import prisma from "../../../models/index.js";

const getKpiValuesService = async ({ clientId, siteId, jobId, entryDate }) => {
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
};

const saveKpiValuesService = async ({
  clientId,
  siteId,
  jobId,
  entryDate,
  values,
}) => {
  const date = new Date(entryDate);

  const operations = values.map((item) =>
    prisma.kpiValue.create({
      data: {
        clientId,
        siteId,
        jobId,
        kpiId: item.kpiId,
        categoryId: item.categoryId,
        entryDate: date,
        value: item.value,
      },
    })
  );

  operations.push(
    prisma.kpiEntryLog.create({
      data: {
        clientId,
        siteId,
        jobId,
        entryDate: date,
      },
    })
  );

  await prisma.$transaction(operations);

  return { success: true };
};

const summaryKpiValuesService = async ({
  clientId,
  siteId,
  jobId,
  from,
  to,
}) => {
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
};

 const getKpiEntryLogsService = async ({
  page = 1,
  limit = 10,
  search = "",
  date
}) => {
  const skip = (page - 1) * limit;

  // Build date filter ONLY if a date is provided
  let dateFilter = {};
  if (date) {
    const selectedDate = new Date(date);

    // Filter only by that calendar day
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    dateFilter = {
      entryDate: {
        gte: selectedDate,
        lt: nextDay, // covers full day
      },
    };
  }

  // Search filter by related table names
  const searchFilter = search
    ? {
        OR: [
          { client: { clientName: { contains: search, mode: "insensitive" } } },
          { site: { siteName: { contains: search, mode: "insensitive" } } },
          { job: { jobName: { contains: search, mode: "insensitive" } } },
        ],
      }
    : {};

  // Final condition
  const whereCondition = {
    isDeleted: false,
    ...dateFilter,
    ...searchFilter,
  };

  // Count total matching results
  const totalCount = await prisma.kpiEntryLog.count({
    where: whereCondition,
  });

  // Fetch paginated results
  const logs = await prisma.kpiEntryLog.findMany({
    skip,
    take: Number(limit),
    orderBy: { entryDate: "desc" },
    where: whereCondition,
    include: {
      client: true,
      site: true,
      job: true,
    },
  });

  return {
    data: logs,
    pagination: {
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};


 const updateKpiValuesService = async (payload) => {
  const { clientId, siteId, jobId, entryDate, values } = payload;

  if (!clientId || !siteId || !jobId || !entryDate || !Array.isArray(values)) {
    throw new Error("Invalid payload");
  }

  // Convert plain date string → proper Date object
  const entryDateObj = new Date(entryDate);

  if (isNaN(entryDateObj.getTime())) {
    throw new Error("Invalid entryDate format");
  }

  // Delete existing KPI values for this exact date
  await prisma.kpiValue.deleteMany({
    where: {
      clientId: Number(clientId),
      siteId: Number(siteId),
      jobId: Number(jobId),
      entryDate: entryDateObj,  // VERY IMPORTANT
    },
  });

  // Prepare new KPI values
  const newValues = values.map((v) => ({
    ...v,
    clientId: Number(clientId),
    siteId: Number(siteId),
    jobId: Number(jobId),
    entryDate: entryDateObj, 
  }));

  // Insert
  return prisma.kpiValue.createMany({
    data: newValues,
  });
};


 const deleteKpiEntryService = async (id) => {
  return prisma.kpiEntryLog.update({
    where: { id:Number(id) },
    data: { isDeleted: true },
  });
};
export default {
  saveKpiValuesService,
  getKpiValuesService,
  summaryKpiValuesService,
  getKpiEntryLogsService,
  updateKpiValuesService,
  deleteKpiEntryService
};
