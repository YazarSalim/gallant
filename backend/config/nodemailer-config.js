import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILER_AUTH_USER,
      pass: process.env.MAILER_AUTH_PASS,
    },
  });

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};
