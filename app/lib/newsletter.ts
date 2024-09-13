import nodemailer from "nodemailer";

// In-memory storage for subscribers (replace with database in production)
let subscribers: string[] = [];

// Create a transporter using Gmail's SMTP server
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function addSubscriber(email: string): Promise<void> {
  if (!email || !isValidEmail(email)) {
    throw new Error("Invalid email address");
  }

  if (subscribers.includes(email)) {
    throw new Error("Email already subscribed");
  }

  try {
    // Add to subscribers list
    subscribers.push(email);
    console.log(`New subscriber added: ${email}`);

    // Send notification to admin
    await sendNewSubscriberNotification(email);
    console.log(
      `Notification email sent to admin about new subscriber: ${email}`
    );
  } catch (error) {
    console.error("Error in addSubscriber:", error);
    throw new Error("Failed to process subscription");
  }
}

async function sendNewSubscriberNotification(
  subscriberEmail: string
): Promise<void> {
  const mailOptions = {
    from: process.env.GMAIL_USER,
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
