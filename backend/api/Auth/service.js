import prisma from "../../models/index.js";
import crypto from 'crypto'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../config/nodemailer-config.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // store in .env


const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id: Number(id) },
  });
};

const loginService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1d",audience: "loginAccess" },
 // token expires in 1 day
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
};


 const forgotPasswordService = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Email not found");
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Save token to DB
  await prisma.user.update({
    where: { email },
    data: { resetToken },
  });

  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  // Send email
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
};


 const resetPasswordService = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: { resetToken: token },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null, // clear token
    },
  });

  return "Password reset successfully";
};

export default { loginService,findUserById ,forgotPasswordService,resetPasswordService};
