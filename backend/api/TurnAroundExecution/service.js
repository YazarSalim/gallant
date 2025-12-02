import prisma from "../../models/index.js";

const createTurnAroundExecutionService = async (id,data) => {
  try {
    const {
      clientId,
      siteId,
      jobId,
      entryDate,
      directEarned,
      percentComplete,
    } = data;
    const result = await prisma.turnAroundExecutionEntry.create({
      data: {
        userId:id,  
        clientId: Number(clientId),
        siteId: Number(siteId),
        jobId: Number(jobId),
        entryDate: new Date(entryDate),
        directEarned: {
          create: directEarned.map((d) => ({
            label: d.label,
            value: d.value,
          })),
        },
        percentComplete: {
          create: percentComplete.map((p) => ({
            label: p.label,
            value: p.value,
          })),
        },
      },
      include: {
        directEarned: true,
        percentComplete: true,
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};



const getAllTurnAroundExecutionEntriesService = async ({
  page = 1,
  limit = 10,
  search = "",
  date,
  clientId,
  siteId,
  jobId,
  sortField = "id",        // default sort column
  sortOrder = "desc",      // ASC or DESC
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
                { client: { clientName: { contains: search, mode: "insensitive" } } },
                { site: { siteName: { contains: search, mode: "insensitive" } } },
                { job: { jobName: { contains: search, mode: "insensitive" } } },
              ]
            }
          : {},

        // Date filter
        date
          ? {
              entryDate: {
                gte: new Date(date + "T00:00:00.000Z"),
                lte: new Date(date + "T23:59:59.999Z"),
              }
            }
          : {},

        // Client filter
        clientId ? { clientId: Number(clientId) } : {},

        // Site filter
        siteId ? { siteId: Number(siteId) } : {},

        // Job filter
        jobId ? { jobId: Number(jobId) } : {},
      ]
    };

    // --- Build sorting ---
    const orderBy = {};
    orderBy[sortField] = sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

    // --- Fetch entries ---
    const entries = await prisma.turnAroundExecutionEntry.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        client: true,
        site: true,
        job: true,
        // Uncomment if needed
        // directEarned: true,
        // percentComplete: true,
      },
    });

    // --- Count total ---
    const total = await prisma.turnAroundExecutionEntry.count({ where });

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      entries,
    };
  } catch (error) {
    throw new Error(error.message || "Failed to fetch Turn Around Execution entries");
  }
};


// ------------------ GET SINGLE ENTRY (EDIT) ------------------
const getTurnAroundExecutionByIdService = async (id) => {
  const entry = await prisma.turnAroundExecutionEntry.findFirst({
    where: { id: Number(id), isDeleted: false },
    include: {
      directEarned: true,
      percentComplete: true,
    },
  });

  if (!entry) throw new Error("Entry not found");

  return entry;
};

 const updateTurnAroundExecutionService = async (id, data) => {
  const {
    clientId,
    siteId,
    jobId,
    entryDate,
    directEarned,
    percentComplete,
  } = data;

  // Check entry exists
  const existing = await prisma.turnAroundExecutionEntry.findFirst({
    where: { id: Number(id), isDeleted: false },
  });

  if (!existing) throw new Error("Entry not found");

  // Update main entry + delete children + recreate children
  const updated = await prisma.turnAroundExecutionEntry.update({
    where: { id: Number(id) },
    data: {
      clientId,
      siteId,
      jobId,
      entryDate: new Date(entryDate),

      // Replace Direct Earned rows
      directEarned: {
        deleteMany: {}, // delete all existing child rows
        create: directEarned.map((d) => ({
          label: d.label,
          value: d.value,
        })),
      },

      // Replace Percent Complete rows
      percentComplete: {
        deleteMany: {},
        create: percentComplete.map((p) => ({
          label: p.label,
          value: p.value,
        })),
      },
    },

    include: {
      directEarned: true,
      percentComplete: true,
    },
  });

  return updated;
};

 const deleteTurnAroundExecutionService = async (id) => {
  return await prisma.turnAroundExecutionEntry.update({
    where: { id: Number(id) },
    data: { isDeleted: true },
  });
};

const getTurnAroundExecutionSummaryService = async ({
  clientId,
  siteId,
  jobId,
  startDate,
  endDate,
}) => {
  // ---- FETCH ENTRIES ----
  const entries = await prisma.turnAroundExecutionEntry.findMany({
    where: {
      clientId: Number(clientId),
      siteId: Number(siteId),
      jobId: Number(jobId),
      entryDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      isDeleted: false,
    },
    include: {
      directEarned: true,
      percentComplete: true,
      client:true,
      site:true,
      job:true
    },
    orderBy: { entryDate: "asc" },
  });

  // ---- SUMMARY OBJECTS ----
  const directEarnedSummary = {};
  const percentCompleteSummary = {};

  // ---- LOOP AND AGGREGATE ----
  entries.forEach((entry) => {
    entry.directEarned.forEach((row) => {
      directEarnedSummary[row.label] =
        (directEarnedSummary[row.label] || 0) + (row.value || 0);
    });

    entry.percentComplete.forEach((row) => {
      percentCompleteSummary[row.label] =
        (percentCompleteSummary[row.label] || 0) + (row.value || 0);
    });
  });

  return {
    entries,
    summary: {
      directEarnedSummary,
      percentCompleteSummary,
    },
  };
};

const getTurnAroundExecutionByDateRangeService = async ({
  clientId,
  siteId,
  jobId,
  startDate,
  endDate,
}) => {
  return await prisma.turnAroundExecutionEntry.findMany({
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
  createTurnAroundExecutionService,
  getAllTurnAroundExecutionEntriesService,
  getTurnAroundExecutionByIdService,
  updateTurnAroundExecutionService,
  deleteTurnAroundExecutionService,
  getTurnAroundExecutionSummaryService,
  getTurnAroundExecutionByDateRangeService
};
