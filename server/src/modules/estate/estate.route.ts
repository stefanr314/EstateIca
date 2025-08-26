import { NextFunction, Request, Response, Router } from "express";
import { validate } from "../../shared/middlewares/validator";
import {
  createBusinessEstateDto,
  createResidentialEstateDto,
} from "./dtos/createEstate.dto";
import { isAuth, optionalAuth } from "../../shared/middlewares/auth.middleware";
import { isActiveUser } from "../../shared/middlewares/isActiveUser";
import { isVerifiedUser } from "../../shared/middlewares/isVerifiedUser";
import { hasRole } from "../../shared/middlewares/hasRole";
import { Role } from "../../shared/types/role.enum";
import {
  createEstate,
  getAllBusinessEstates,
  getAllPersonalEstates,
  getAllResidentialEstates,
  getEstateById,
  hardDeleteEstateById,
  toggleEstateVisibility,
  updateBusinessAmenities,
  updateEstate,
  updateResidentialAmenities,
} from "./estate.controller";

import {
  getBusinessEstatesQueryDto,
  getResidentialEstatesQueryDto,
} from "./dtos/getEstatesQuery.dto";
import { personalEstateFilterDto } from "./dtos/showHiddenFilter.dto";
import { hardDeleteEstateDto } from "./dtos/hardDeleteEstate.dto";
import { validateObjectId } from "../../shared/middlewares/validateObjectId";

import multer from "multer";
import { updateEstateAmenitiesDto } from "./dtos/updateEstate.dto";

// Extend Express Request interface to include estateTypeCreated
declare global {
  namespace Express {
    interface Request {
      estateTypeCreated?: string;
    }
  }
}

const router = Router();
const upload = multer();

router.get(
  "/residential/all",
  validate(getResidentialEstatesQueryDto, "query"),
  getAllResidentialEstates
);

router.get(
  "/business/all",
  validate(getBusinessEstatesQueryDto, "query"),
  getAllBusinessEstates
);

router.get(
  "/me",
  validate(personalEstateFilterDto, "query"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  getAllPersonalEstates
);

router.post(
  "/residential",
  upload.array("images"),
  (req: Request, res: Response, next: NextFunction) => {
    req.estateTypeCreated = "residential";
    next();
  },
  validate(createResidentialEstateDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  createEstate
);

router.post(
  "/business",
  upload.array("images"),
  (req: Request, res: Response, next: NextFunction) => {
    req.estateTypeCreated = "business";
    next();
  },
  validate(createBusinessEstateDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  createEstate
);

router.get(
  "/:estateId",
  validateObjectId("estateId"),
  optionalAuth,
  getEstateById
);

//update body validated on service level
router.patch(
  "/:estateId",
  validateObjectId("estateId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  updateEstate
);

router.patch(
  "/:estateId/update-amenities",
  validateObjectId("estateId"),
  validate(updateEstateAmenitiesDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  updateResidentialAmenities
);
router.patch(
  "/:estateId/update-business-amenities",
  validateObjectId("estateId"),
  validate(updateEstateAmenitiesDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  updateBusinessAmenities
);
router.patch(
  "/visibility/:estateId",
  validateObjectId("estateId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST, Role.ADMIN]),
  toggleEstateVisibility
);

router.delete(
  "/hardDelete/:estateId",
  validateObjectId("estateId"),
  validate(hardDeleteEstateDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  hardDeleteEstateById
);

export default router;
