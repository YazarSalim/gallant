import service from "./service.js";

const getUserProfile = async (req,res) => {
  try {
    const data = await service.getUserProfileService(req.query.email);   
    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateProfile=async(req,res)=>{
    try {
        const userId = req.user.id;
        const data = await service.updateProfileService(userId,req.body);
        res.json({success:true,data})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

export default { getUserProfile,updateProfile };
