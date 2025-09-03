import { Router } from "express";
import {
  clearWishlist,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "./wishlist.controller";
import { validateObjectId } from "../../shared/middlewares/validateObjectId";
import { isAuth } from "../../shared/middlewares/auth.middleware";
import { validate } from "../../shared/middlewares/validator";
import { getWishlistQuerySchema } from "./dtos/getWishlistQuert.dto";

const router = Router();

router.get(
  "/preview",
  validate(getWishlistQuerySchema, "query"),
  isAuth,
  getWishlist
);

router.patch(
  "/add-estate/:estateId",
  validateObjectId("estateId"),
  isAuth,
  addToWishlist
);

router.delete(
  "/remove-estate/:estateId",
  validateObjectId("estateId"),
  isAuth,
  removeFromWishlist
);

router.delete("/clear", isAuth, clearWishlist);

export default router;
