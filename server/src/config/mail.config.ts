export const mailConfig = {
  clientId: process.env.OAUTH_CLIENT_ID || "",
  clientSecret: process.env.OAUTH_CLIENT_SECRET || "",
  redirectUri:
    process.env.OAUTH_REDIRECT_URI ||
    "https://developers.google.com/oauthplayground",
  refreshToken: process.env.OAUTH_REFRESH_TOKEN || "",
  fromName: process.env.MAIL_FROM_NAME || "EstateIca App Support",
  fromEmail: process.env.MAIL_FROM_EMAIL || "noreply@example.com",
};
