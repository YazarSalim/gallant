import service from "./service.js";

const createJob = async (req, res) => {
  try {
    const newJob = await service.createJobService(req.body);

    return res.status(201).json({
      success: true,
      message: "New job created successfully",
      data: newJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await service.updateJobService(id, req.body);


    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};



const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await service.deleteJobService(id);


    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      data: deletedJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


const getAllJobs = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const result = await service.getAllJobsService({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: search || "",
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: "Jobs fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getJobsBySite = async (req, res) => {
  try {
    const { siteId } = req.params;
    const jobs = await service.getJobsBySiteService(siteId);

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs?jobs: [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await service.getJobByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};



export default {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobsBySite,
  getJobById,
};
