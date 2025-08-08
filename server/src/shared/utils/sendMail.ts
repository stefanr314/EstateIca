import nodemailer from "nodemailer";
import { google } from "googleapis";
import { getEmailTemplate } from "./emailTemplate";

import { mailConfig } from "../../config/mail.config";

export interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  placeholders: Record<string, string>;
}

const createTransporter = async () => {
  if (process.env.NODE_ENV === "development") {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return transporter;
  }

  const oAuth2Client = new google.auth.OAuth2(
    mailConfig.clientId,
    mailConfig.clientSecret,
    mailConfig.redirectUri
  );

  oAuth2Client.setCredentials({ refresh_token: mailConfig.refreshToken });

  const accessToken = await oAuth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER,
      clientId: mailConfig.clientId,
      clientSecret: mailConfig.clientSecret,
      refreshToken: mailConfig.refreshToken,
      accessToken: accessToken?.token || "",
    },
  });
};

export const sendEmail = async (options: SendEmailOptions) => {
  const transporter = await createTransporter();

  const { to, subject, templateName, placeholders } = options;

  const html = getEmailTemplate(templateName, {
    ...placeholders,
    appName: "EstateIca",
  });

  const mailOptions = {
    from: `"${mailConfig.fromName}" <${mailConfig.fromEmail}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  if (process.env.NODE_ENV === "development") {
    logging.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }

  return info;
};
