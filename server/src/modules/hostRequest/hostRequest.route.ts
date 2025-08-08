import { Router } from "express";
import { isVerifiedUser } from "../../shared/middlewares/isVerifiedUser";
import { isAuth } from "../../shared/middlewares/auth.middleware";
import { isActiveUser } from "../../shared/middlewares/isActiveUser";
import {
  createHostRequest,
  deleteHostRequest,
  getAllHostRequests,
  getHostRequestById,
  updateHostRequestStatus,
} from "./hostRequest.controller";
import { validate } from "../../shared/middlewares/validator";
import { createHostRequestDto } from "./dtos/createHostRequest.dto";
import { hostRequestIdParamsSchema } from "./dtos/hostRequestIdParams.dto";
import { hasRole } from "../../shared/middlewares/hasRole";
import { Role } from "../../shared/types/role.enum";
import { updateHostRequestStatusDto } from "./dtos/updateHostRequestStatus.dto";
import { getAllHostRequestsDto } from "./dtos/getAllHostRequests.dto";

const router = Router();

router.use(isAuth, isActiveUser, isVerifiedUser); // Ensure user/guest is authenticated, active, and verified - the only way to get host role

router.get(
  "/all-requests",
  validate(getAllHostRequestsDto, "query"),
  hasRole([Role.ADMIN]),
  getAllHostRequests
);

router.post("/", validate(createHostRequestDto), createHostRequest);

router.put(
  "/:requestId/status",
  validate(hostRequestIdParamsSchema, "params"),
  validate(updateHostRequestStatusDto),
  hasRole([Role.ADMIN]),
  updateHostRequestStatus
);

// router.patch(
//   "/:requestId/archive",
//   validate(hostRequestIdParamsSchema, "params"),
//   isAuth,
//   hasRole([Role.ADMIN]),
//   isActiveUser,
//   deleteHostRequest
// );

router.get(
  "/:requestId",
  validate(hostRequestIdParamsSchema, "params"),
  getHostRequestById
);

export default router;
