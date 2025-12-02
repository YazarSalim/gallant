import service from "./service.js";

const getAllActivityLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const result = await service.getAllActivityLogsService({
      page,
      limit,
      search,
      userId,
    });
    return res.status(200).json({
      success: true,
      message: "Logs fetched successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export default { getAllActivityLogs };
