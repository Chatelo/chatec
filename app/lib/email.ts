import nodemailer from "nodemailer";
import EmailLink from "@/app/components/EmailLink";
import { renderToString } from "react-dom/server";

const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_SMTP_HOST,
  port: parseInt(process.env.ZOHO_SMTP_PORT || "465"),
  secure: true, // use SSL
  auth: {
    user: process.env.ZOHO_SMTP_USER,
    pass: process.env.ZOHO_SMTP_PASSWORD,
  },
});

export async function sendNotification(
  to: string,
  subject: string,
  html: string
) {
  try {
    await transporter.sendMail({
      from: process.env.ZOHO_SMTP_USER,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    if ((error as any).response) {
      console.error((error as any).response.body);
    }
  }
}

export async function sendAgreementNotification(
  to: string,
  agreementLink: string
) {
  const subject = "New Agreement Available";
  const html = renderToString(EmailLink({ agreementLink }));

  await sendNotification(to, subject, html);
}

export async function sendAdminNotification(subject: string, text: string) {
  const adminEmails = process.env.CONTACT_EMAIL?.split(",") || [];

  const mailOptions = {
    from: process.env.ZOHO_SMTP_USER,
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
