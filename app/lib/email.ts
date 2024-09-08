import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  //TODO  Configure your email service here
  //TODO  For example, using Gmail:
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendAdminNotification(subject: string, text: string) {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmails.join(","),
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent successfully");
  } catch (error) {
    console.error("Error sending admin notification email:", error);
  }
}
