import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../shared/errors";
import { CreateReviewDto } from "./dtos/createReview.dto";
import { reviewService } from "./review.service";
import { UpdateReviewDto } from "./dtos/updateReview.dto";
import { GetReviewsDto } from "./dtos/getReviewsQuery.dto";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError(
        "Morate biti ulogovani da biste mogli izvrsiti navedenu akciju"
      );

    const userId = req.user.id;
    const reservationId = req.params.reservationId;
    const dto = req.body as CreateReviewDto;

    const result = await reviewService.createReview(userId, reservationId, dto);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError(
        "Morate biti ulogovani da biste mogli izvrsiti navedenu akciju"
      );

    const userId = req.user.id;
    const reviewId = req.params.reviewId;
    const dto = req.body as UpdateReviewDto;

    const result = await reviewService.updateReview(reviewId, userId, dto);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// export const deleteReview = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     if (!req.user)
//       throw new UnauthorizedError(
//         "Morate biti ulogovani da biste mogli izvrsiti navedenu akciju"
//       );

//     const userId = req.user.id;
//   } catch (error) {
//     next(error);
//   }
// };

export const getReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewId = req.params.reviewId;

    const result = await reviewService.getReviewById(reviewId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getReviewsByEstate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const estateId = req.params.estateId;
    const dto = req.query as unknown as GetReviewsDto;

    const result = await reviewService.getReviewsByEstate(estateId, dto);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
