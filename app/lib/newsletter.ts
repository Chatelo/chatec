import nodemailer from "nodemailer";
import { prisma } from "@/app/lib/prisma";
import { render } from "@react-email/render";
import EmailTemplate from "@/app/components/EmailTemplate";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const ADMIN_EMAIL = process.env.SMTP_FROM_EMAIL;

export async function addSubscriber(email: string): Promise<string> {
  if (!email || !isValidEmail(email)) {
    throw new Error("Invalid email address");
  }

  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      throw new Error("Missing required environment variables");
    }

    const subscriber = await prisma.subscriber.create({
      data: { email },
    });

    await sendNewSubscriberNotification(email);
    await sendWelcomeEmail(email);

    return "Subscription successful! You've been added to the newsletter.";
  } catch (error) {
    console.error("Error in addSubscriber:", error);

    if ((error as any).code === "P2002") {
      return "This email is already subscribed to the newsletter.";
    }

    if ((error as Error).message === "Failed to send notification email") {
      throw new Error(
        "Subscription added but failed to notify admin. Please try again."
      );
    } else if (
      (error as Error).message === "Missing required environment variables"
    ) {
      throw new Error("Server configuration error. Please contact support.");
    } else {
      throw new Error(
        "Failed to process subscription: " + (error as Error).message
      );
    }
  }
}

async function sendNewSubscriberNotification(
  subscriberEmail: string
): Promise<void> {
  const subscriberCount = await prisma.subscriber.count();

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: ADMIN_EMAIL,
    subject: "New Newsletter Subscriber",
    text: `A new user has subscribed to your newsletter: ${subscriberEmail}`,
    html: `
      <h1>New Subscriber!</h1>
      <p>A new user has subscribed to your newsletter:</p>
      <p><strong>${subscriberEmail}</strong></p>
      <p>Current subscriber count: ${subscriberCount}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending notification email:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw new Error("Failed to send notification email");
  }
}

async function sendWelcomeEmail(subscriberEmail: string): Promise<void> {
  const emailHtml = await render(EmailTemplate());

  const mailOptions = {
    from: process.env.SMTP_USER,
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

export async function testEmailSending(): Promise<void> {
  const testMailOptions = {
    from: process.env.SMTP_USER,
    to: ADMIN_EMAIL,
    subject: "Test Email",
    text: "This is a test email to verify the email sending functionality.",
  };

  try {
    await transporter.sendMail(testMailOptions);
    console.log("Test email sent successfully");
  } catch (error) {
    console.error("Error sending test email:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw new Error("Failed to send test email");
  }
}
