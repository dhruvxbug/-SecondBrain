import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Shortcut for Gmail's SMTP settings - see Well-Known Services
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Send an email using async/await
export const sendEmail = async(to: string, subject: string,text: string, html: string) => {
  try{
        const info = await transporter.sendMail({
        from: '"Second Brain"',
        to: to,
        subject: subject,
        text: text, // Plain-text version of the message
        html: html, // HTML version of the message
      });

      console.log("Message sent:", info.messageId);
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

  } catch (error){
    console.log(error);
  }
}