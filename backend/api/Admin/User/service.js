import prisma from "../../../models/index.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../../config/nodemailer-config.js";

const createUserService = async (userData) => {
  try {
    const { username, email, phone } = userData;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
    if (existingUser) throw new Error("User already exists");

    // Temp password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const payload = { username, email, phone, role: "user", password: hashedPassword };

    const response = await prisma.user.create({ data: payload });
    const { password, ...user } = response;

    // Send email
    const html = `
      <p>Hello ${username},</p>
      <p>Your account has been created.</p>
      <p>Temporary password: <b>${tempPassword}</b></p>
      <p>Please <a href="http://localhost:3000/set-password?email=${email}">click here</a> to set your own password.</p>
    `;

    await sendEmail(email, "Your Account Created", html);

    return { user };
  } catch (error) {
    throw error;
  }
};


const getAllUsersService = async ({
  page = 1,
  limit = 10,
  search = "",
}) => {
  try {
    const skip = (page - 1) * limit;

    const where = {
      role: { not: "admin" },
      isDeleted:false,
      AND: search
        ? [
            {
              OR: [
                { username: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
              ],
            },
          ]
        : [],
    };

    const totalUsers = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      users,
      totalUsers,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalUsers / limit),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};


 const getUserByIdService = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

 const updateUserService = async (id, data) => {
  try {
    const userId = Number(id);

    // 1️⃣ Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // 2️⃣ Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: data.username,
        email: data.email,
        phone: data.phone,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

 const softDeleteUserService = async (id) => {
  try {
    const userId = Number(id);

    // 1️⃣ Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) throw new Error("User not found");

    if (existingUser.isDeleted) {
      throw new Error("User is already deleted");
    }

    const deletedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        isDeleted: true,
      },
    });

    return deletedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default { createUserService,getAllUsersService ,getUserByIdService,updateUserService,softDeleteUserService};
