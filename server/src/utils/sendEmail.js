import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

/**
 * Verify email using ZeroBounce
 */
export async function verifyEmail(email) {
  const url = `https://api.zerobounce.net/v2/validate?api_key=${process.env.ZEROBOUNCE_API_KEY}&email=${encodeURIComponent(
    email
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (
      data.status === "invalid" &&
      data.sub_status === "mailbox_not_found"
    ) {
      console.log(`The email ${email} is invalid: mailbox not found.`);
      return false;
    }

    if (data.status === "valid") {
      console.log(`The email ${email} is valid.`);
      return true;
    }

    console.log(`The email ${email} is invalid.`);
    return false;
  } catch (error) {
    console.error("Error verifying email:", error);
    return false;
  }
}

/**
 * Send email using Brevo API
 */
export async function sendEmail(to, subject, html) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_USER;

  if (!brevoApiKey || !senderEmail) {
    throw new Error(
      "Missing BREVO_API_KEY or EMAIL_USER in environment variables."
    );
  }

  const payload = {
    sender: {
      name: "InterVueX Team",
      email: senderEmail,
    },
    to: [
      {
        email: to,
      },
    ],
    subject,
    htmlContent: html,
  };

  try {
    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(result));
    }

    console.log(`Email successfully sent to ${to}`);
    return result;
  } catch (error) {
    console.error("Brevo Email Error:", error.message);
    throw new Error("Email not sent");
  }
}