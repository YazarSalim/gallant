import service from "./service.js";

const createJob = async (req, res) => {
  try {
    const data = await service.createJobService(req.body);
    res.json({ success: true, data, message: "New Job Created Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
const updateJob = async (req, res) => {
  try {
    console.log(req.body);
    
    const id = req.params.id;
    const data = await service.updatejobService(id, req.body);
    res.json({ success: true, data, message: " Job Updated Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
const deleteJob = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await service.deleteJobService(id);
    res.json({ success: true, data, message: "Job Deleted Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


const getAllJobs = async (req, res) => {
  try {
    const { page, limit,search } = req.query;
    const result = await service.getAllJobsService({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search:search || ""
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
    const data = await service.getJobsBySiteService(siteId);
    res.json({success:true,data});
  } catch (error) {
    res.json({ message: error.message });
  }
}


export default {createJob,updateJob,deleteJob,getAllJobs,getJobsBySite}