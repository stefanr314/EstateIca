import { Router } from "express";
import multer from "multer";
import { addEstateImages, deleteEstateImage } from "./estateImage.controller";
import { validateObjectId } from "../../shared/middlewares/validateObjectId";
import { isAuth } from "../../shared/middlewares/auth.middleware";
import { hasRole } from "../../shared/middlewares/hasRole";
import { Role } from "../../shared/types/role.enum";
import { isActiveUser } from "../../shared/middlewares/isActiveUser";
import { isVerifiedUser } from "../../shared/middlewares/isVerifiedUser";

const upload = multer(); // memory storage
const router = Router();

router.post(
  "/:estateId/images",
  upload.array("images"),
  validateObjectId("estateId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  addEstateImages
);

router.delete(
  "/:estateId/images/:fileId",
  validateObjectId("estateId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  deleteEstateImage
);

export default router;
