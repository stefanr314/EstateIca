import { ImageKitService } from "../../imagekit/imagekit.service";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors";
import { BaseEstate, BaseEstateDocument } from "./estate.model"; // ili ResidentialEstate, zavisi koji koristiš

export class EstateImageService {
  static async addImages(
    estateId: string,
    hostId: string,
    files: Express.Multer.File[]
  ) {
    const estate = await BaseEstate.findById(estateId);

    if (!estate) throw new NotFoundError("Estate nije pronađen");

    if (estate.host.toString() !== hostId)
      throw new ForbiddenError("Nemate pravo pristupa ovoj akciji");

    const uploadedImages = [];
    const imagesToBase: { url: string; fileId: string }[] = [];
    for (const file of files) {
      const result: any = await ImageKitService.uploadFile(
        file.buffer,
        file.originalname,
        "/estates"
      );

      // spremi URL i imageId u bazu
      imagesToBase.push({
        url: result.url,
        fileId: result.fileId,
      });

      uploadedImages.push(result);
    }

    estate.images = imagesToBase;
    await estate.save();
    return uploadedImages;
  }

  // Brisanje jedne slike
  static async deleteImage(estateId: string, hostId: string, fileId: string) {
    const estate = await BaseEstate.findById(estateId);
    if (!estate) throw new NotFoundError("Estate nije pronađen");
    if (estate.host.toString() !== hostId)
      throw new ForbiddenError("Nemate pravo pristupa ovoj akciji");

    // izbaci iz baze
    const imageIndex = estate.images?.findIndex((img) => img.fileId === fileId);
    if (imageIndex === -1) throw new BadRequestError("Slika nije pronađena");

    imageIndex && estate.images?.splice(imageIndex, 1);
    await estate.save();

    // obriši sa ImageKit-a
    await ImageKitService.deleteFile(fileId);

    return { success: true };
  }

  static async deleteAllEstateImages(estate: BaseEstateDocument) {
    if (!estate.images || estate.images.length === 0) return;

    await Promise.all(
      estate.images.map(({ fileId }) =>
        ImageKitService.deleteFile(fileId).catch((err) => {
          console.error(`Failed to delete ${fileId}:`, err);
        })
      )
    );
  }
}
