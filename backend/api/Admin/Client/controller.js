import service from "./service.js";

const createClient = async (req, res) => {
  try {
    const client = await service.createClientService(req.body);

    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,   
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


const editClient = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedClient = await service.updateClientService(id, req.body);

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: updatedClient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


const deleteClient = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedClient = await service.deleteClientService(id);
    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
      data: deletedClient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


const getAllClients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const result = await service.getAllClientsService({ page, limit, search });
    return res.status(200).json({
      success: true,
      message: "Clients fetched successfully",
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


const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await service.getClientByIdService(id);
    return res.status(200).json({
      success: true,
      message: "Client fetched successfully",
      data: client,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export default { createClient, editClient, deleteClient, getAllClients,getClientById };
