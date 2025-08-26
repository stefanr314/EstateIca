import { imagekit } from "./imagekit.config";

export class ImageKitService {
  static async uploadFile(
    file: Buffer | string,
    fileName: string,
    folder = "/estates"
  ) {
    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file,
          fileName,
          folder,
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result); // vraća URL i meta info
        }
      );
    });
  }

  static async deleteFile(fileId: string) {
    return new Promise((resolve, reject) => {
      imagekit.deleteFile(fileId, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}
