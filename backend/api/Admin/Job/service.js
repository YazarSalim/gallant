import prisma from "../../../models/index.js";

const createJobService = async (data) => {
  try {
    const { jobName, jobCode, clientId, siteId } = data;

    if (!jobName) throw new Error("Job name is required");
    if (!jobCode) throw new Error("Job code is required");
    if (!clientId) throw new Error("Client is required");
    if (!siteId) throw new Error("Site is required");

    // Check if a job with the same code exists
    const existingJobCode = await prisma.job.findUnique({
      where: { jobCode },
    });
    if (existingJobCode) throw new Error("Job code already exists");

    // Check if a job with the same name exists under the same client and site
    const existingJobName = await prisma.job.findFirst({
      where: {
        jobName,
        clientId,
        siteId,
        isDeleted: false,
      },
    });
    if (existingJobName) throw new Error("Job with this name already exists for this client and site");

    const newJob = await prisma.job.create({
      data: {
        jobName,
        jobCode,
        clientId,
        siteId,
      },
    });

    return newJob;
  } catch (error) {
    throw error;
  }
};


const updateJobService = async (id, data) => {
  try {
    const jobIdNum = Number(id);

    const existingJob = await prisma.job.findUnique({
      where: { id: jobIdNum },
    });
    if (!existingJob) throw new Error("Job not found");

    const { jobName, jobCode, clientId, siteId } = data;

    const duplicateJobCode = await prisma.job.findFirst({
      where: {
        jobCode,
        NOT: { id: jobIdNum },
      },
    });
    if (duplicateJobCode) throw new Error("Job code already exists");

    const duplicateJobName = await prisma.job.findFirst({
      where: {
        jobName,
        clientId: Number(clientId),
        siteId: Number(siteId),
        NOT: { id: jobIdNum },
        isDeleted: false,
      },
    });
    if (duplicateJobName) throw new Error(
      "Job with this name already exists for this client and site"
    );

    const updatedJob = await prisma.job.update({
      where: { id: jobIdNum },
      data: {
        jobName,
        jobCode,
        clientId: Number(clientId),
        siteId: Number(siteId),
      },
      include: {
        client: { select: { clientName: true, id: true } },
        site: { select: { siteName: true, id: true } },
      },
    });

    return updatedJob;
  } catch (error) {
    throw error;
  }
};


const deleteJobService = async (id, data) => {
  try {
    const existingJob = await prisma.job.findUnique({
      where: { id: Number(id) },
    });
    if (!existingJob) throw new Error("Job Not Found");
    const deletedJob = await prisma.job.update({
      where: { id: Number(id) },
      data: { isDeleted: true },
    });
    return existingJob;
  } catch (error) {
    throw error;
  }
};



 const getAllJobsService = async ({ page, limit, search }) => {
  try {
    const skip = (page - 1) * limit;

    const jobs = await prisma.job.findMany({
      where: {
        isDeleted: false,
        OR: [
          { jobName: { contains: search, mode: "insensitive" } },
          { jobCode: { contains: search, mode: "insensitive" } },
          {
            client: {
              clientName: { contains: search, mode: "insensitive" },
            }
          },
          {
            site: {
              siteName: { contains: search, mode: "insensitive" },
            }
          }
        ]
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        jobName: true,
        jobCode: true,
        clientId: true,
        siteId: true,
        client: { select: { clientName: true } },
        site: { select: { siteName: true } },
      },
    });

    const totalCount = await prisma.job.count({
      where: {
        isDeleted: false,
        OR: [
          { jobName: { contains: search, mode: "insensitive" } }
        ]
      }
    });

    return {
      data: jobs.map((job) => ({
        id: job.id,
        jobCode: job.jobCode,
        jobName: job.jobName,
        clientName: job.client.clientName,
        siteName: job.site.siteName,
        clientId: job.clientId,
        siteId: job.siteId,
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

const getJobsBySiteService = async (siteId) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        siteId: Number(siteId),
        isDeleted: false,
      },
      select: {
        id: true,
        jobName: true,
      },
    });

    return jobs;
  } catch (error) {
    throw error;
  }
};

const getJobByIdService = async (id) => {
  try {
    console.log(id);
    
    const existingJob = await prisma.job.findUnique({
      where: { id:Number(id) },
    });

    if (!existingJob) {
      throw new Error("Job not found");
    }

    return existingJob;
  } catch (error) {
    throw error;
  }
};


export default {
  createJobService,
  updateJobService,
  deleteJobService,
  getAllJobsService,
  getJobsBySiteService,
  getJobByIdService
};
