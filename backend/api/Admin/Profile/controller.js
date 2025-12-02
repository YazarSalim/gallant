import service from "./service.js";

const getUserProfile = async (req, res) => {
  try {
    const { email } = req.query;


    const user = await service.getUserProfileService(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const updatedUser = await service.updateProfileService(userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};


export default { getUserProfile,updateProfile };
