import service from "./service.js";
import ExcelJS from "exceljs";

const getKpiValuesController = async (req, res) => {
  try {
    const { clientId, siteId, jobId, entryDate } = req.query;

    if (!clientId || !siteId || !jobId || !entryDate) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required query parameters: clientId, siteId, jobId, entryDate",
      });
    }

    const kpiValues = await service.getKpiValuesService({
      clientId: Number(clientId),
      siteId: Number(siteId),
      jobId: Number(jobId),
      entryDate,
    });

    return res.status(200).json({
      success: true,
      message: "KPI values fetched successfully",
      data: kpiValues ? kpiValues : [],
    });
  } catch (err) {
    console.error("Error fetching KPI values:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const saveKpiValuesController = async (req, res) => {
  try {
    const userId = req.user.id;
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
      userId,
    });

    res.json({ message: "Saved Successfully" });
  } catch (err) {
    console.error("Error saving KPI values:", err);
    res.status(500).json({ error: err.message });
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
    const { page, limit, search, date, clientId, siteId, jobId } = req.query;
    const result = await service.getKpiEntryLogsService({
      page,
      limit,
      search,
      date,
      clientId,
      siteId,
      jobId,
    });

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
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const result = await service.updateKpiValuesService({
      clientId,
      siteId,
      jobId,
      entryDate,
      values,
    });

    return res.json({
      success: true,
      message: "KPI values updated successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteKpiEntry = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const result = await service.deleteKpiEntryService(id);
    res.json({ success: true, message: "Successfully Deleted", result });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const exportFixedSummary = async (req, res) => {
  try {
    const { clientId, siteId, jobId, startDate, endDate } = req.query;

    // ✅ Validate required params
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate, endDate are required",
      });
    }

    // ✅ Prevent huge exports → Limit 1 year
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInDays = (end - start) / (1000 * 60 * 60 * 24);
    if (diffInDays > 365) {
      return res.status(400).json({
        success: false,
        message: "Maximum allowed date range is 1 year",
      });
    }

    // ✅ Fetch DB data with relations for readable names
    const results = await service.getFixedSummaryByDateRangeService({
      clientId,
      siteId,
      jobId,
      startDate,
      endDate,
    });

    // ✅ Set streaming headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=TurnAround_Report.xlsx"
    );

    // ✅ Stream workbook for large datasets
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
    const sheet = workbook.addWorksheet("FixedSummary Report");

    // Header row
    sheet
      .addRow([
        "ID",
        "Client Name",
        "Site Name",
        "Job Name",
        "Entry Date",
        // "Status",
        // "Value",
      ])
      .commit();

    // Stream rows
    results.forEach((row) => {
      sheet
        .addRow([
          row.id,
          row.client?.clientName || "",
          row.site?.siteName || "",
          row.job?.jobName || "",
          row.entryDate ? row.entryDate.toISOString().split("T")[0] : "",
          // row.status || "",
          // row.value || "",
        ])
        .commit();
    });

    // Finalize workbook
    sheet.commit();
    await workbook.commit();
  } catch (err) {
    console.error("Excel Export Error:", err);
    // ⚠ Do NOT send JSON if headers already sent
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.end();
    }
  }
};
export default {
  saveKpiValuesController,
  getKpiValuesController,
  summaryKpiValuesController,
  getKpiEntryLogs,
  updateKpiValuesController,
  deleteKpiEntry,
  exportFixedSummary,
};
