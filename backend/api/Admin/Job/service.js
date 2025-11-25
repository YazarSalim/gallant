import prisma from "../../../models/index.js";

const createJobService = async (data) => {
  try {
    const { jobName, jobCode, clientId, siteId } = data;
    const existingJob = await prisma.job.findUnique({
      where: { jobCode },
    });
    if (existingJob) throw new Error("Job already exists");

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

const updatejobService = async (id, data) => {
  try {
    const existingJob = await prisma.job.findUnique({
      where: { id: Number(id) },
    });

    if (!existingJob) throw new Error("Job Not Found");

    const updatedJob = await prisma.job.update({
      where: { id: Number(id) },
      data: {
        jobName: data.jobName,
        jobCode: data.jobCode,
        clientId: Number(data.clientId), 
        siteId: Number(data.siteId),     
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

// const getAllJobsService = async ({ page, limit }) => {
//   try {
//     const skip = (page - 1) * limit;
//     const take = limit;

//     const jobs = await prisma.job.findMany({
//       where: { isDeleted: false },
//       skip,
//       take,
//       orderBy: { createdAt: "desc" },
//       select: {
//         id: true,
//         jobName: true,
//         jobCode: true,

//         clientId: true,
//         siteId: true,

//         client: {
//           select: {
//             clientName: true,
//           },
//         },
//         site: {
//           select: {
//             siteName: true,
//           },
//         },
//       },
//     });

//     const totalCount = await prisma.job.count({
//       where: { isDeleted: false },
//     });

//     return {
//       data: jobs.map((job) => ({
//         id: job.id,
//         jobCode: job.jobCode,
//         jobName: job.jobName,
//         clientName: job.client.clientName,
//         siteName: job.site.siteName,
//         clientId: job.clientId,
//         siteId: job.siteId,
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


export const getAllJobsService = async ({ page, limit, search }) => {
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

export default {
  createJobService,
  updatejobService,
  deleteJobService,
  getAllJobsService,
  getJobsBySiteService,
};
