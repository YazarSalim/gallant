import prisma from "../../../models/index.js";

 const getUserProfileService = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
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

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updateData.password, salt);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return updatedUser;
  } catch (error) {
    throw new Error("Failed to update profile: " + error.message);
  }
};
export default{getUserProfileService,updateProfileService}