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
  toggleEstateVisibility,
  updateEstate,
} from "./estate.controller";
import { estateIdParams } from "./dtos/estateIdParams";
import {
  getBusinessEstatesQueryDto,
  getResidentialEstatesQueryDto,
} from "./dtos/getEstatesQuery.dto";
import { personalEstateFilterDto } from "./dtos/showHiddenFilter.dto";

// Extend Express Request interface to include estateTypeCreated
declare global {
  namespace Express {
    interface Request {
      estateTypeCreated?: string;
    }
  }
}

const router = Router();

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
  validate(estateIdParams, "params"),
  optionalAuth,
  getEstateById
);

//update body validated on service level
router.patch(
  "/:estateId",
  validate(estateIdParams, "params"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  updateEstate
);

router.patch(
  "/visibility/:estateId",
  validate(estateIdParams, "params"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST, Role.ADMIN]),
  toggleEstateVisibility
);

export default router;
