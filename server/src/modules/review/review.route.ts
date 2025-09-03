import { Router } from "express";
import * as reviewController from "./review.controller";
import { validateObjectId } from "../../shared/middlewares/validateObjectId";
import { createReviewDto } from "./dtos/createReview.dto";
import { isAuth } from "../../shared/middlewares/auth.middleware";
import { isActiveUser } from "../../shared/middlewares/isActiveUser";
import { isVerifiedUser } from "../../shared/middlewares/isVerifiedUser";
import { hasRole } from "../../shared/middlewares/hasRole";
import { Role } from "../../shared/types/role.enum";
import { validate } from "../../shared/middlewares/validator";
import { getReviewsQueryDto } from "./dtos/getReviewsQuery.dto";
import { updateReviewDto } from "./dtos/updateReview.dto";

const router = Router();

// Get all reviews
router.get(
  "/for-estate/:estateId",
  validateObjectId("estateId"),
  validate(getReviewsQueryDto, "query"),
  reviewController.getReviewsByEstate
);

// Get a single review by ID
router.get(
  "/:reviewId/preview",
  validateObjectId("reviewId"),
  reviewController.getReviewById
);

// Create a new review
router.post(
  "/create-from-reservation/:reservationId",
  validateObjectId("reservationId"),
  validate(createReviewDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST, Role.GUEST]),
  reviewController.createReview
);

// Update a review by ID
router.put(
  "/:reviewId/update",
  validateObjectId("reviewId"),
  validate(updateReviewDto),
  isAuth,
  isActiveUser,
  isVerifiedUser,
  hasRole([Role.HOST, Role.GUEST]),
  reviewController.updateReview
);

// // Delete a review by ID
// router.delete("/:reviewId/delete", reviewController.deleteReview);

export default router;
