import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getMe,
  getUserById,
  toogleActivity,
  updateUser,
  updateUserProfilePicture,
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
import { validateObjectId } from "../../shared/middlewares/validateObjectId";
import multer from "multer";

const router = Router();
const upload = multer();

router.get(
  "/getAll",
  validate(getAllUsersQueryDto, "query"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.ADMIN]),
  getAllUsers
);

router.get("/me", isAuth, getMe);

router.get("/:userId", validateObjectId("userId"), getUserById);

router.patch(
  "/toggle-activity/:userId",
  validate(userIdParamsDto, "params"),
  isAuth,
  hasRole([Role.ADMIN, Role.GUEST, Role.HOST]),
  toogleActivity
);
router.patch(
  "/deactivate/:userId",
  validateObjectId("userId"),
  isAuth,
  hasRole([Role.ADMIN, Role.GUEST, Role.HOST]),
  deleteUser
);
router.patch(
  "/update-profile/:userId",
  validateObjectId("userId"),
  validate(updateUserDto, "body"),
  isAuth,
  isActiveUser,
  hasRole([Role.ADMIN, Role.GUEST, Role.HOST]),
  updateUser
);
router.patch(
  "/update-profile-picture/:userId",
  isAuth,
  validateObjectId("userId"),
  upload.single("profilePicture"),
  updateUserProfilePicture
);
export default router;
