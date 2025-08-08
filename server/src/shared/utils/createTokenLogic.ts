import crypto from "crypto";

export const createToken = () => {
  const rawToken = crypto.randomBytes(64).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 1); // Token valid for 1 hours

  return { rawToken, hashedToken, expirationDate };
};
