import { Router } from "express";
import { getContract } from "./contract.controller";
import { isAuth } from "../../shared/middlewares/auth.middleware";
import { validateObjectId } from "../../shared/middlewares/validateObjectId";
import { isActiveUser } from "../../shared/middlewares/isActiveUser";
import { isVerifiedUser } from "../../shared/middlewares/isVerifiedUser";

const router = Router();

router.get(
  "/:contractId",
  validateObjectId("contractId"),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  getContract
);

export default router;
