import service from "./service.js";

const createUser = async (req, res) => {
  try {
    const user = await service.createUserService(req.body);
    
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const data = await service.getAllUsersService({
      page: Number(page),
      limit: Number(limit),
      search,
    });

    return res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


 const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await service.getUserByIdService(id);

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 const updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedUser = await service.updateUserService(id, req.body);

    return res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

 const softDeleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedUser = await service.softDeleteUserService(id);

    return res.json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default { createUser ,getAllUsers,getUserById,updateUser,softDeleteUser};
