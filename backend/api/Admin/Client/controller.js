import service from "./service.js";

const createClient = async (req, res) => {
  try {    
    const data = await service.createClientService(req.body);
    res.json({ success: true, data, message: "Client created Successfully " });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const editClient = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await service.updateClientService(id, req.body);
    res.json({ success: true, data, message: "Client edit Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await service.deleteClientService(id);
    res.json({ success: true,data,message: "Client Deleted Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getAllClients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await service.getAllClientsService({page,limit});
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getClientById=async(req,res)=>{
  try {
    const {id} =req.params
    const data = await service.getClientByIdService(id);
    res.json({success:true,data})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}
export default { createClient, editClient, deleteClient, getAllClients,getClientById };
