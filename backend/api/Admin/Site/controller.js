import service from "./service.js";

const createSite = async (req, res) => {
  try {
    const data = await service.createSiteService(req.body);
    res.json({ success: true, data, message: "New Site Created Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateSite = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await service.updateSiteService(id, req.body);
    res.json({ success: true, data, message: "Site Updated Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deleteSite = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const data = await service.deleteSiteService(id);
    res.json({ success: true, data, message: "Site Deleted Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
const getAllSites = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || ""; 

    const result = await service.getAllSitesService({
      page,
      limit,
      search
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: "Sites fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


const getSitesByClient = async (req, res) => {

  try {
    const clientId = Number(req.params.clientId);

    const data = await service.getSitesByClientService(clientId);
    

    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getSitesById = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);

    const site = await service.getSiteByIdService(id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    res.status(200).json({
      success: true,
      data: site,
      message: "Site fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export default {
  createSite,
  updateSite,
  deleteSite,
  getAllSites,
  getSitesByClient,
  getSitesById,
};
