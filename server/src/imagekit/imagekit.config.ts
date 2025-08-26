import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.IK_PUBLIC_KEY!,
  privateKey: process.env.IK_PRIVATE_KEY!,
  urlEndpoint: process.env.IK_URL_ENDPOINT!,
});
