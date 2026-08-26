import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

console.log("EMAIL_USER =>", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASS =>",
  process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌",
);

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// SMTP Verify
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR ❌");
    console.log(error);
  } else {
    console.log("SMTP CONNECTED ✅");
  }
});

export const sendMail = async (to, subject, html) => {
  try {
    console.log("==================================");
    console.log("SENDING EMAIL...");
    console.log("TO :", to);
    console.log("SUBJECT :", subject);
    console.log("FROM :", process.env.EMAIL_USER);
    console.log("==================================");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT SUCCESSFULLY ✅");
    console.log("Message ID :", info.messageId);
    console.log("Response :", info.response);

    return info;
  } catch (error) {
    console.log("EMAIL SEND FAILED ❌");
    console.log(error);

    throw error;
  }
};
