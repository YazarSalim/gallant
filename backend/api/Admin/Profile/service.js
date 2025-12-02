import prisma from "../../../models/index.js";

 const getUserProfileService = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        profilePhoto:true
      },
    });

    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    throw error;
  }
};


const updateProfileService = async (id, data) => {
  try {
    const updateData = { ...data };

    // Hash password if present
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        profilePhoto: true, // return updated photo
      },
    });

    return updatedUser;
  } catch (error) {
    throw new Error("Failed to update profile: " + error.message);
  }
};

export default{getUserProfileService,updateProfileService}