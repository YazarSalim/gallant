import prisma from "../models/index.js";

export const activityLogger = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;

    const method = req.method;
    const path = req.originalUrl.split("?")[0];
    const query = req.query;
    const body = req.body;

    // ===== Convert API path into readable text =====
    const readableRoute = getReadableRoute(path);

    // Set action + description
    let action = "";
    let description = "";

    if (method === "GET") {
      action = "VIEW";
      description = `Viewed ${readableRoute}`;
    } else if (method === "POST") {
      action = "CREATE";
      description = `Created ${readableRoute}`;
    } else if (method === "PUT" || method === "PATCH") {
      action = "UPDATE";
      description = `Updated ${readableRoute}`;
    } else if (method === "DELETE") {
      action = "DELETE";
      description = `Deleted ${readableRoute}`;
    } else {
      action = method;
      description = `Performed ${method} on ${readableRoute}`;
    }

    await prisma.activityLog.create({
      data: {
        userId,
        action,
        details: description,
      },
    });

    // console.log("Created log:", description);
  } catch (err) {
    console.log("Activity Logger Error:", err.message);
  }

  next();
};


function getReadableRoute(path) {
  const parts = path.split("/").filter(Boolean);

  const last = parts[parts.length - 1];

  switch (last) {
    case "getAllUsers":
      return "all users";
    case "createUser":
      return "a new user";
    case "updateUser":
      return "user details";
    case "deleteUser":
      return "a user";
    case "getUserById":
      return "user details (by ID)";

    case "createclient":
      return "a new client";
    case "getAllClients":
      return "all clients";

    case "createjob":
      return "a new job";
    case "getAllJobs":
      return "all jobs";

    case "createkpi":
      return "a new KPI";
    case "getAllKpi":
      return "all KPIs";

    default:
      return last.replace(/([A-Z])/g, " $1").toLowerCase();
  }
}


