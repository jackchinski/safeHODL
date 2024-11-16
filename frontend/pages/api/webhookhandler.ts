import type { NextApiRequest, NextApiResponse } from "next";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const axios = require('axios');

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "",
});

var mailerApiKey = process.env.MAILERSEND_API_KEY || "";



// - mailersendapikey
async function sendNewLockboxCreatedNotificationEmail(
  newLockboxEmail: string,
  lockedBy: string
) {
  // const sentFrom = new Sender(
  //   "trial-z86org8vz6zlew13.mlsender.net"
  //  //  "SafeHODL notification service"
  // );

  // const recipients = [new Recipient(newLockboxEmail)];

  // const emailParams = new EmailParams()
  //   .setFrom("trial-z86org8vz6zlew13.mlsender.net")
  //   .setTo(recipients)
  //   .setSubject("You have incoming blockchain transfer")
  //   .setHtml(
  //     `You can unlock vault and receive locked tokens. Locked by: ${lockedBy} `
  //   )
  //   .setText(`This is the text content`);

  // mailerSend.email
  //   .send(emailParams)
  //   .then((response: unknown) => console.log(response))
  //   .catch((error: unknown) => console.log(error));


// const sentFrom = new Sender("you@yourdomain.com", "Your name");

// const recipients = [
//   new Recipient("your@client.com", "Your Client")
// ];

// const emailParams = new EmailParams()
//   .setFrom(sentFrom)
//   .setTo(recipients)
//   .setReplyTo(sentFrom)
//   .setSubject("This is a Subject")
//   .setHtml("<strong>This is the HTML content</strong>")
//   .setText("This is the text content");

//  mailerSend.email.send(emailParams)

  try {
    const response = await axios.post(
      'https://api.mailersend.com/v1/email',
      {
        from: {
          email: 'test@trial-z86org8vz6zlew13.mlsender.net',
        },
        to: [
          {
            email: newLockboxEmail,
          },
        ],
        subject: 'You have incoming blockchain transfer',
        text: `You can unlock vault and receive locked tokens. Locked by: ${lockedBy} `,
        html: `You can unlock vault and receive locked tokens. Locked by: ${lockedBy} `,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${mailerApiKey}`,
        },
      }
    );

    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.log(error);
   // console.error('Error sending email:', error.response?.data || error.message);
  }



}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Process a POST request

    const webhookContent = req.body;
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
