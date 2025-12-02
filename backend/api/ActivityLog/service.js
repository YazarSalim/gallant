import prisma from "../../models/index.js";

export const getAllActivityLogsService = async ({
  page = 1,
  limit = 10,
  search = "",
  userId,
  role,
}) => {
  try {
    const skip = (page - 1) * limit;

    const searchFilter = search
      ? {
          OR: [
            { action: { contains: search, mode: "insensitive" } },
            { details: { contains: search, mode: "insensitive" } },
            {user:{username:{contains:search,mode:"insensitive"}}}
          ],
        }
      : {};

    const userFilter = role === "admin" ? {} : { userId: Number(userId) };

    const where = {
      AND: [searchFilter, userFilter],
    };

    const logs = await prisma.activityLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    const logsWithIST = logs.map((log) => ({
      ...log,
      createdAtIST: new Date(log.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
    }));

    const totalCount = await prisma.activityLog.count({ where });

    return {
      data: logsWithIST,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export default { getAllActivityLogsService };
