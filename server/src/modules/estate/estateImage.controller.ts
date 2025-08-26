import { Request, Response, NextFunction } from "express";
import { EstateImageService } from "./estateImage.service";
import { UnauthorizedError } from "../../shared/errors";

export const addEstateImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError(
        "Ne mozete izvesti navedenu akciju ako niste ulogovaniu."
      );
    const estateId = req.params.estateId;
    const files = req.files as Express.Multer.File[];
    const hostId = req.user.id;
    const uploaded = await EstateImageService.addImages(
      estateId,
      hostId,
      files
    );
    res.status(201).json(uploaded);
  } catch (err) {
    next(err);
  }
};

export const deleteEstateImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError(
        "Ne mozete izvesti navedenu akciju ako niste ulogovaniu."
      );
    const { estateId, fileId } = req.params;
    const hostId = req.user.id;
    const result = await EstateImageService.deleteImage(
      estateId,
      hostId,
      fileId
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
