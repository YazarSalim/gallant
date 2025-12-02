import service from "./service.js";

const createSite = async (req, res) => {
  try {
    const site = await service.createSiteService(req.body);

    return res.status(201).json({
      success: true,
      message: "New Site created successfully",
      data: site,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const updateSite = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedSite = await service.updateSiteService(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Site updated successfully",
      data: updatedSite,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const deleteSite = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSite = await service.deleteSiteService(id);
    return res.status(200).json({
      success: true,
      message: "Site deleted successfully",
      data: deletedSite,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
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

    const sites = await service.getSitesByClientService(clientId);

    return res.status(200).json({
      success: true,
      message: "Sites fetched successfully",
      data: sites || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};



const getSitesById = async (req, res) => {
  try {
    const { id } = req.params;
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
