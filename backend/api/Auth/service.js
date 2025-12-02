import prisma from "../../models/index.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../config/nodemailer-config.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const findUserById = async (id) => {
  try {
    return await prisma.user.findUnique({
      where: { id: Number(id) },
    });
  } catch (error) {
    throw new Error("Failed to fetch user");
  }
};

const loginService = async ({ email, password }) => {
  try {
    if (!email || !password) throw new Error("Email and password are required");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d", audience: "loginAccess" }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role:user.role
      },
    };
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};

const forgotPasswordService = async (email) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error("Email not found");

    const resetToken = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { email },
      data: { resetToken },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    await sendEmail(
      email,
      "Password Reset",
      `
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link is valid for one reset attempt.</p>
      `
    );

    return "Password reset link sent to your email";
  } catch (error) {
    throw new Error(error.message || "Failed to send reset link");
  }
};

const resetPasswordService = async (token, newPassword) => {
  try {
    const user = await prisma.user.findFirst({
      where: { resetToken: token },
    });

    if (!user) throw new Error("Invalid or expired token");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
      },
    });

    return "Password reset successfully";
  } catch (error) {
    throw new Error(error.message || "Failed to reset password");
  }
};


 const setPasswordService = async (email, password) => {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return { message: "Password updated successfully" };
  } catch (error) {
    throw error;
  }
};



export default {
  loginService,
  findUserById,
  forgotPasswordService,
  resetPasswordService,
  setPasswordService
};
