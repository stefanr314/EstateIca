import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  toogleActivity,
  updateUser,
} from "./user.controller";
import { validate } from "../../shared/middlewares/validator";
import { userIdParamsDto } from "./dtos/userIdParams.dto";
import { updateUserDto } from "./dtos/updateUser.dto";
import { isAuth } from "../../shared/middlewares/auth.middleware";
import { getAllUsersQueryDto } from "./dtos/getAllUsers.dto";
import { isActiveUser } from "../../shared/middlewares/isActiveUser";
import { Role } from "../../shared/types/role.enum";
import { hasRole } from "../../shared/middlewares/hasRole";
import { isVerifiedUser } from "../../shared/middlewares/isVerifiedUser";

const router = Router();

router.get(
  "/getAll",
  validate(getAllUsersQueryDto, "query"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.ADMIN]),
  getAllUsers
);
router.patch(
  "/toggle-activity/:userId",
  validate(userIdParamsDto, "params"),
  isAuth,
  hasRole([Role.ADMIN, Role.GUEST, Role.HOST]),
  toogleActivity
);
router.patch(
  "/deactivate/:userId",
  validate(userIdParamsDto, "params"),
  isAuth,
  hasRole([Role.ADMIN, Role.GUEST, Role.HOST]),
  deleteUser
);
router.get("/:userId", validate(userIdParamsDto, "params"), getUserById);
router.put(
  "/:userId",
  validate(userIdParamsDto, "params"),
  validate(updateUserDto, "body"),
  isAuth,
  isActiveUser,
  hasRole([Role.ADMIN, Role.GUEST, Role.HOST]),
  updateUser
);
export default router;
