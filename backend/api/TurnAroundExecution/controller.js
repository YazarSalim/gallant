import service from "./service.js";
import ExcelJS from "exceljs";


const createTurnAroundExecution = async (req, res) => {
  try {
    const id =req.user.id;
    const result = await service.createTurnAroundExecutionService(id,req.body);
    res.json({ success: true, data: result, message: "Successfully Created" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getAllTurnAroundExecutionEntries = async (req, res) => {
  try {
    // console.log(req.query);
    
    const { page = 1, limit = 10, search = "", date,clientId,siteId,jobId } = req.query; // <-- Use query params

    const result = await service.getAllTurnAroundExecutionEntriesService({
      page: Number(page),
      limit: Number(limit),
      search,
      date,
      clientId,siteId,jobId
    });

    res.json({ success: true, result });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ------------------ GET BY ID (EDIT) ------------------
const getTurnAroundExecutionById = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await service.getTurnAroundExecutionByIdService(id);

    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

 const updateTurnAroundExecution = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await service.updateTurnAroundExecutionService(id, req.body);

    res.json({
      success: true,
      message: "Turnaround execution updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

 const deleteTurnAroundExecution = async (req, res) => {
  try {
    const { id } = req.params;

    await service.deleteTurnAroundExecutionService(id);

    res.json({ success: true, message: "Entry deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getTurnAroundExecutionSummary = async (req, res) => {
  try {
    const { clientId, siteId, jobId, startDate, endDate } = req.query;

    if (!clientId || !siteId || !jobId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "clientId, siteId, jobId, startDate, endDate are required",
      });
    }

    const data = await service.getTurnAroundExecutionSummaryService({
      clientId,
      siteId,
      jobId,
      startDate,
      endDate,
    });

    return res.json({
      success: true,
      message: "Turnaround execution records fetched successfully",
      data,
    });

  } catch (error) {
    console.error("Error in getTurnAroundExecutionByDateRange:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};



const exportTurnAroundExecution = async (req, res) => {
  try {
    const { clientId, siteId, jobId, startDate, endDate } = req.query;

    // Validate required date range
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required",
      });
    }

    // Limit max 1 year
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInDays = (end - start) / (1000 * 60 * 60 * 24);
    if (diffInDays > 365) {
      return res.status(400).json({
        success: false,
        message: "Maximum allowed date range is 1 year",
      });
    }

    // Fetch data
    const results = await service.getTurnAroundExecutionByDateRangeService({
      clientId,
      siteId,
      jobId,
      startDate,
      endDate,
    });

    // Excel streaming
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=TurnAround_Report.xlsx"
    );

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
    const sheet = workbook.addWorksheet("TurnAround Report");

    sheet.addRow([
      "ID",
      "Client Name",
      "Site Name",
      "Job Name",
      "Entry Date",
    ]).commit();

    results.forEach((row) => {
      sheet.addRow([
        row.id,
        row.client?.clientName || "",
        row.site?.siteName || "",
        row.job?.jobName || "",
        row.entryDate?.toISOString().split("T")[0] || "",
      ]).commit();
    });

    sheet.commit();
    await workbook.commit();
  } catch (err) {
    console.error("Excel Export Error:", err);
    if (!res.headersSent) res.status(500).json({ success: false, message: err.message });
    else res.end();
  }
};



export default {
  createTurnAroundExecution,
  getAllTurnAroundExecutionEntries,
  getTurnAroundExecutionById,
  updateTurnAroundExecution,
  deleteTurnAroundExecution,
  getTurnAroundExecutionSummary,
  exportTurnAroundExecution
};
