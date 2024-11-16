import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const mailerApiKey = process.env.MAILERSEND_API_KEY || "";

async function sendNewLockboxCreatedNotificationEmail(
  newLockboxEmail: string,
  lockedBy: string
) {
  try {
    const response = await axios.post(
      "https://api.mailersend.com/v1/email",
      {
        from: {
          email: "test@trial-z86org8vz6zlew13.mlsender.net",
        },
        to: [
          {
            email: newLockboxEmail,
          },
        ],
        subject: "You have incoming blockchain transfer",
        text: `You can unlock vault and receive locked tokens. Locked by: ${lockedBy} `,
        html: `You can unlock vault and receive locked tokens. Locked by: ${lockedBy} `,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${mailerApiKey}`,
        },
      }
    );

    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.log(error);
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const webhookContent = req.body;

    if (
      webhookContent[0].data.event.name == "NewLockBox" &&
      webhookContent[0].data.event.inputs[0].name == "email"
    ) {
      const newLockboxEmail = webhookContent[0].data.event.inputs[0].value;
      const lockedBy = webhookContent[0].data.transaction.from;
      sendNewLockboxCreatedNotificationEmail(newLockboxEmail, lockedBy);
    }

    res.json({ success: true });
  } else res.json({ success: true });
}
