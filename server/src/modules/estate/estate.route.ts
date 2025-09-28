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
import {
  updateBusinessEstateDto,
  updateEstateAmenitiesDto,
  updateResidentialEstateDto,
} from "./dtos/updateEstate.dto";

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

router.patch(
  "/update-amenities/:estateId",
  validateObjectId("estateId"),
  validate(updateEstateAmenitiesDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  updateResidentialAmenities
);
router.patch(
  "/update-business-amenities/:estateId",
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

//update body validation će zavisiti od tipa nekretnine
router.patch(
  "/update/:estateId",
  validateObjectId("estateId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  updateEstate
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
