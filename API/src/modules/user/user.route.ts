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

const router = Router();

router.get("/users", validate(getAllUsersQueryDto, "query"), getAllUsers);
router.patch(
  "/toggle-activity/:userId",
  validate(userIdParamsDto, "params"),
  toogleActivity
);
router.patch(
  "/deactivate/:userId",
  validate(userIdParamsDto, "params"),
  deleteUser
);
router.get("/:userId", validate(userIdParamsDto, "params"), getUserById);
router.put(
  "/:userId",
  validate(userIdParamsDto, "params"),
  validate(updateUserDto, "body"),
  isAuth,
  updateUser
);
export default router;
