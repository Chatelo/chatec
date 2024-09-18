import nodemailer from "nodemailer";

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
  text: string
) {
  try {
    await transporter.sendMail({
      from: process.env.ZOHO_SMTP_USER,
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    if ((error as any).response) {
      if (error instanceof Error && (error as any).response) {
        console.error((error as any).response.body);
      }
    }
  }
}

export async function sendAgreementNotification(
  to: string,
  agreementLink: string
) {
  const subject = "New Agreement Available";
  const text = `
    Hello,

    A new agreement is available for your review and acceptance.
    Please click the following link to view and accept the agreement:

    ${process.env.NEXT_PUBLIC_BASE_URL}/agreement/${agreementLink}

    This link will expire in 7 days.

    Best regards,
    Your Company Name
  `;

  await sendNotification(to, subject, text);
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
