import nodemailer from "nodemailer";

// In-memory storage for subscribers (replace with database in production)
let subscribers: string[] = [];

// Create a transporter using Gmail's SMTP server
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

  if (subscribers.includes(email)) {
    return "This email is already subscribed to the newsletter.";
  }

  try {
    // Verify environment variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      throw new Error("Missing required environment variables");
    }

    // Add to subscribers list
    subscribers.push(email);

    // Send notification to admin
    await sendNewSubscriberNotification(email);

    return "Subscription successful! You've been added to the newsletter.";
  } catch (error) {
    console.error("Error in addSubscriber:", error);

    // Remove the email from subscribers if notification fails
    const index = subscribers.indexOf(email);
    if (index > -1) {
      subscribers.splice(index, 1);
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
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: ADMIN_EMAIL,
    subject: "New Newsletter Subscriber",
    text: `A new user has subscribed to your newsletter: ${subscriberEmail}`,
    html: `
      <h1>New Subscriber!</h1>
      <p>A new user has subscribed to your newsletter:</p>
      <p><strong>${subscriberEmail}</strong></p>
      <p>Current subscriber count: ${subscribers.length}</p>
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

function isValidEmail(email: string): boolean {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility function to get all subscribers (for admin purposes)
export function getAllSubscribers(): string[] {
  return [...subscribers];
}

// Utility function to remove a subscriber (for unsubscribe functionality)
export function removeSubscriber(email: string): boolean {
  const index = subscribers.indexOf(email);
  if (index > -1) {
    subscribers.splice(index, 1);
    return true;
  }
  return false;
}

// Test function to verify email sending
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
