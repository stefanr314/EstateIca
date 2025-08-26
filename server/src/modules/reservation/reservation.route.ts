import { Router } from "express";
import {
  createResidentialReservation,
  updateReservationStatus,
  getEstateReservations,
  getUserReservations,
  createBusinessReservation,
  getHostReservations,
  getUnavailableDatesForEstate,
  completeReservation,
  confirmBusinessReservation,
  confirmLongTermResidentialReservation,
  denyBusinessUnitCountUpdate,
  approveBusinessUnitCountUpdate,
  cancelReservation,
  lockDates,
  unlockDates,
  updateReservationDate,
  updateResidentialGuestCount,
  extendReservation,
  approvePendingReservation,
  denyPendingReservation,
  updateBusinessReservationUnitCount,
  getPendingReservationsForHost,
  getReservationById,
  denyReservationByHost,
} from "./reservation.controller";
import { isAuth } from "../../shared/middlewares/auth.middleware";
import { validateObjectId } from "../../shared/middlewares/validateObjectId";
import { validate } from "../../shared/middlewares/validator";
import {
  createBusinessReservationDto,
  createReservationDto,
} from "./dtos/createReservation.dto";
import { isActiveUser } from "../../shared/middlewares/isActiveUser";
import { isVerifiedUser } from "../../shared/middlewares/isVerifiedUser";
import {
  getPendingReservationQueryDto,
  getReservationQueryDto,
} from "./dtos/getReservationQuery.dto";
import { hasRole } from "../../shared/middlewares/hasRole";
import { Role } from "../../shared/types/role.enum";
import { lockDatesDto, unlockDatesDto } from "./dtos/lockDates.dto";
import {
  extendReservationDto,
  updateBusinessReservationUnitCountDto,
  updateReservationDateDto,
  updateResidentialReservationGuestCountDto,
} from "./dtos/updateReservation.dto";
import { updateReservationStatusDto } from "./dtos/updateReservationStatusDto";

const router = Router();

router.get(
  "/estate/:estateId",
  validateObjectId("estateId"),
  validate(getReservationQueryDto, "query"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  getEstateReservations
);
router.get(
  "/my",
  validate(getReservationQueryDto, "query"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  getUserReservations
);
router.get(
  "/:reservationId/preview",
  validateObjectId("reservationId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.GUEST, Role.HOST]),
  getReservationById
);
router.get(
  "/complete-host-reservations",
  validate(getReservationQueryDto, "query"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  getHostReservations
);
router.get(
  "/pending-host-reservations",
  validate(getPendingReservationQueryDto, "query"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  getPendingReservationsForHost
);

router.get(
  "/estate/:estateId/unavailable-dates",
  validateObjectId("estateId"),
  getUnavailableDatesForEstate
);
router.post(
  "/estate/:estateId/lock-dates",
  validateObjectId("estateId"),
  validate(lockDatesDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  lockDates
);

router.delete(
  "/estate/:estateId/unlock-dates",
  validateObjectId("estateId"),
  validate(unlockDatesDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  unlockDates
);

router.post(
  "/create-reservation/:estateId",
  validateObjectId("estateId"),
  validate(createReservationDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.GUEST, Role.HOST]),
  createResidentialReservation
);
router.post(
  "/create-business-reservation/:estateId",
  validateObjectId("estateId"),
  validate(createBusinessReservationDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.GUEST, Role.HOST]),
  createBusinessReservation
);
router.patch(
  "/:reservationId/status",
  validateObjectId("reservationId"),
  validate(updateReservationStatusDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST, Role.GUEST]),
  updateReservationStatus
);
router.patch(
  "/:reservationId/update-dates",
  validateObjectId("reservationId"),
  validate(updateReservationDateDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST, Role.GUEST]),
  updateReservationDate
);
router.patch(
  "/:reservationId/update-guest-count",
  validateObjectId("reservationId"),
  validate(updateResidentialReservationGuestCountDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST, Role.GUEST]),
  updateResidentialGuestCount
);
router.patch(
  "/:reservationId/update-business-unitCount",
  validateObjectId("reservationId"),
  validate(updateBusinessReservationUnitCountDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST, Role.GUEST]),
  updateBusinessReservationUnitCount
);
router.patch(
  "/:reservationId/extend-reservation",
  validateObjectId("reservationId"),
  validate(extendReservationDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST, Role.GUEST]),
  extendReservation
);
router.patch(
  "/:reservationId/approve-pending-reservation",
  validateObjectId("reservationId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  approvePendingReservation
);
router.patch(
  "/:reservationId/approve-business-unitCount",
  validateObjectId("reservationId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  approveBusinessUnitCountUpdate
);
router.patch(
  "/:reservationId/deny-pending-reservation",
  validateObjectId("reservationId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  denyPendingReservation
);
router.patch(
  "/:reservationId/deny-business-unitCount",
  validateObjectId("reservationId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  denyBusinessUnitCountUpdate
);

router.patch(
  "/:reservationId/confirm-longterm-residential",
  validateObjectId("reservationId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  confirmLongTermResidentialReservation
);
router.patch(
  "/:reservationId/confirm-business",
  validateObjectId("reservationId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  confirmBusinessReservation
);
router.patch(
  "/:reservationId/cancel",
  validateObjectId("reservationId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST, Role.GUEST]),
  cancelReservation
);
router.patch(
  "/:reservationId/deny",
  validateObjectId("reservationId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST]),
  denyReservationByHost
);
router.patch(
  "/:reservationId/complete",
  validateObjectId("reservationId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST, Role.GUEST]),
  completeReservation
);

export default router;
