import service from "./service.js";

const getKpiValuesController = async (req, res) => {
  try {
    const { clientId, siteId, jobId, entryDate } = req.query;

    if (!clientId || !siteId || !jobId || !entryDate) {
      return res.status(400).json({ error: "Missing required query params" });
    }

    const data = await service.getKpiValuesService({
      clientId: Number(clientId),
      siteId: Number(siteId),
      jobId: Number(jobId),
      entryDate,
    });

    res.json({ data });
  } catch (err) {
    console.error("Error fetching KPI values:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const saveKpiValuesController = async (req, res) => {
  try {
    const { clientId, siteId, jobId, entryDate, values } = req.body;

    if (
      !clientId ||
      !siteId ||
      !jobId ||
      !entryDate ||
      !Array.isArray(values)
    ) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    await service.saveKpiValuesService({
      clientId: Number(clientId),
      siteId: Number(siteId),
      jobId: Number(jobId),
      entryDate,
      values,
    });

    res.json({ message: "Saved Successfully" });
  } catch (err) {
    console.error("Error saving KPI values:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const summaryKpiValuesController = async (req, res) => {
  try {
    const { clientId, siteId, jobId, from, to } = req.query;

    if (!clientId || !siteId || !jobId || !from || !to) {
      return res.status(400).json({ error: "Missing required query params" });
    }

    const data = await service.summaryKpiValuesService({
      clientId: Number(clientId),
      siteId: Number(siteId),
      jobId: Number(jobId),
      from,
      to,
    });

    res.json({ data });
  } catch (err) {
    console.error("Error fetching summary:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

 const getKpiEntryLogs = async (req, res) => {
  try {
    const { page, limit ,search,date} = req.query;
    const result = await service.getKpiEntryLogsService({ page, limit ,search,date});

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


 const updateKpiValuesController = async (req, res) => {
  const { clientId, siteId, jobId, entryDate, values } = req.body;

  if (!clientId || !siteId || !jobId || !entryDate || !values) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const result = await service.updateKpiValuesService( {
      clientId,
      siteId,
      jobId,
      entryDate,
      values,
    });

    return res.json({ success: true, message: "KPI values updated successfully", data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteKpiEntry=async(req,res)=>{
  try {
    const {id}=req.params;
    console.log(id);
    
    const result = await service.deleteKpiEntryService(id);
    res.json({success:true,message:"Successfully Deleted",result})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}
export default {
  saveKpiValuesController,
  getKpiValuesController,
  summaryKpiValuesController,
  getKpiEntryLogs,updateKpiValuesController,deleteKpiEntry
};
