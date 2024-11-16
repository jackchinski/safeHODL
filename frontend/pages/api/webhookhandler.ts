import type { NextApiRequest, NextApiResponse } from "next";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "",
});

// - mailersendapikey
function sendNewLockboxCreatedNotificationEmail(
  newLockboxEmail: string,
  lockedBy: string
) {
  const sentFrom = new Sender(
    "trial-z86org8vz6zlew13.mlsender.net",
    "SafeHODL notification service"
  );

  const recipients = [new Recipient(newLockboxEmail, "Your Client")];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject("You have incoming blockchain transfer")
    .setHtml(
      `You can unlock vault and receive locked tokens. Locked by: ${lockedBy} `
    )
    .setText(`This is the text content`);

  mailerSend.email
    .send(emailParams)
    .then((response: unknown) => console.log(response))
    .catch((error: unknown) => console.log(error));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Process a POST request

    const webhookContent = JSON.parse(req.body);
    console.log(webhookContent);

    if (webhookContent[0].data.event.name == "NewLockBox") {
      if (webhookContent[0].data.event.inputs[0].name == "email") {
        const newLockboxEmail = webhookContent[0].data.event.inputs[0].value;
        console.log(newLockboxEmail);
        //var lockedAmount =
        const lockedBy = webhookContent[0].data.transaction.from;
        sendNewLockboxCreatedNotificationEmail(newLockboxEmail, lockedBy);
      }
    }

    res.json({ success: true });
  } else {
    // Handle any other HTTP method

    res.json({ success: true });
  }
}
