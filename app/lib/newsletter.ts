import nodemailer from "nodemailer";
import prisma from "@/app/lib/prisma";
import { render } from "@react-email/render";
import EmailTemplate from "@/app/components/EmailTemplate";

const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_SMTP_HOST,
  port: parseInt(process.env.ZOHO_SMTP_PORT || "465"),
  secure: true, // Use SSL
  auth: {
    user: process.env.ZOHO_SMTP_USER,
    pass: process.env.ZOHO_SMTP_PASSWORD,
  },
});

export async function addSubscriber(
  email: string
): Promise<{ message: string; status: number }> {
  if (!email || !isValidEmail(email)) {
    return { message: "Invalid email address", status: 400 };
  }

  try {
    if (!process.env.ZOHO_SMTP_USER || !process.env.ZOHO_SMTP_PASSWORD) {
      throw new Error("Missing required environment variables");
    }

    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return {
        message: "This email is already subscribed to the newsletter.",
        status: 200,
      };
    }

    const subscriber = await prisma.subscriber.create({
      data: { email },
    });

    await sendNewSubscriberNotification(email);
    await sendWelcomeEmail(email);

    return {
      message: `Subscription successful! You've been added to the newsletter. Please check ${email} for a welcome message.`,
      status: 201,
    };
  } catch (error) {
    console.error("Error in addSubscriber:", error);

    if ((error as Error).message === "Failed to send notification email") {
      return {
        message:
          "Subscription added but failed to notify admin. Please try again.",
        status: 500,
      };
    } else if (
      (error as Error).message === "Missing required environment variables"
    ) {
      return {
        message: "Server configuration error. Please contact support.",
        status: 500,
      };
    } else {
      return {
        message: "Failed to process subscription: " + (error as Error).message,
        status: 500,
      };
    }
  }
}

async function sendNewSubscriberNotification(
  subscriberEmail: string
): Promise<void> {
  const subscriberCount = await prisma.subscriber.count();

  const mailOptions = {
    from: process.env.ZOHO_SMTP_USER,
    to: process.env.ADMIN_EMAIL,
    subject: "New Newsletter Subscriber",
    text: `A new user has subscribed to your newsletter: ${subscriberEmail}`,
    html: `
         <h1>New Subscriber!</h1>
         <p>A new user has subscribed to your newsletter:</p>
         <p><strong>${subscriberEmail}</strong></p>
         <p>Subscribers: ${subscriberCount}</p>
       `,
  };

  try {
    console.log("Attempting to send notification email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Notification email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending notification email:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    console.error("Mail options:", JSON.stringify(mailOptions, null, 2));
    throw new Error("Failed to send notification email");
  }
}

async function sendWelcomeEmail(subscriberEmail: string): Promise<void> {
  const emailHtml = await render(EmailTemplate());

  const mailOptions = {
    from: process.env.ZOHO_SMTP_USER,
    to: subscriberEmail,
    subject: "Welcome to Our Newsletter!",
    text: "Thank you for subscribing to our newsletter. We're excited to have you on board!",
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw new Error("Failed to send welcome email");
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function getAllSubscribers(): Promise<string[]> {
  const subscribers = await prisma.subscriber.findMany({
    select: { email: true },
  });
  return subscribers.map((sub) => sub.email);
}

export async function removeSubscriber(email: string): Promise<boolean> {
  try {
    await prisma.subscriber.delete({
      where: { email },
    });
    return true;
  } catch (error) {
    console.error("Error removing subscriber:", error);
    return false;
  }
}
