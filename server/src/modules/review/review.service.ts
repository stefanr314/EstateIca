import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors";
import { Status } from "../../shared/types/status.enum";
import {
  generateMongoAverageRatingUpdate,
  generateMongoAverageRatingUpdateForUpdate,
} from "../../shared/utils/updateAverageRating";
import { ResidentialEstate } from "../estate/estate.model";
import { Reservation } from "../reservation/reservation.model";
import { CreateReviewDto } from "./dtos/createReview.dto";
import { GetReviewsDto } from "./dtos/getReviewsQuery.dto";
import { UpdateReviewDto } from "./dtos/updateReview.dto";
import { Review, IReview } from "./review.model";
import mongoose, { Types } from "mongoose";

export class ReviewService {
  // Kreiranje nove recenzije
  async createReview(
    userId: string,
    reservationId: string,
    dto: CreateReviewDto
  ) {
    const session = await mongoose.startSession();

    try {
      const result = await session.withTransaction(async () => {
        const reservationToGetReviewed = await Reservation.findById(
          reservationId
        )
          .populate("userOfReservation", "profilePictureUrl")
          .session(session);

        if (!reservationToGetReviewed)
          throw new NotFoundError("Ne postoji trazena rezervacija");
        if (
          userId !== reservationToGetReviewed.userOfReservation._id.toString()
        )
          throw new ForbiddenError(
            "Nemate pravo ostaviti recenziju za trazenu rezervaciju"
          );
        if (reservationToGetReviewed.status !== Status.COMPLETED)
          throw new BadRequestError(
            "Ne mozete ostaviti recenziju na rezervaciju koja nije zavrsena."
          );

        // Preventivna provjera (iako unique index već postoji)
        const existingReview = await Review.findOne({
          user: userId,
          reservation: reservationId,
          estate: reservationToGetReviewed.estateReserved,
        }).session(session);

        if (existingReview) {
          throw new BadRequestError(
            "Već ste ostavili recenziju za ovu rezervaciju."
          );
        }

        const { rating, comment } = dto;
        const { profilePictureUrl: userAvatar } =
          reservationToGetReviewed.userOfReservation as {
            profilePictureUrl: string;
          };

        //mora da se kreira kao string radi session dijela
        const newReview = await Review.create(
          [
            {
              user: reservationToGetReviewed.userOfReservation,
              userFullName: reservationToGetReviewed.guestName,
              reservation: reservationId,
              estate: reservationToGetReviewed.estateReserved,
              rating,
              comment,
              editDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 sata
            },
          ],
          { session }
        );

        // Ažuriranje prosječne ocjene nekretnine
        const estateId = reservationToGetReviewed.estateReserved;

        const updateQuery = generateMongoAverageRatingUpdate(
          "averageRating",
          "reviewsCount",
          newReview[0].rating
        );

        await ResidentialEstate.findByIdAndUpdate(estateId, [updateQuery], {
          new: true,
          session,
        });

        return { review: newReview[0], userAvatar };
      });

      return result;
    } finally {
      session.endSession();
    }
  }

  // Dohvaćanje recenzija za određeni smještaj
  async getReviewsByEstate(
    estateId: string,
    dto: GetReviewsDto
  ): Promise<IReview[]> {
    const { page, limit, sortBy } = dto;
    const skip = (page - 1) * limit;

    let sortObject: Record<string, 1 | -1> = { createdAt: -1 };
    if (sortBy) {
      const sortFields = sortBy.split(",");

      for (const field of sortFields) {
        const [key, order] = field.split(":");
        sortObject[key] = order === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
      }
    }
    return await Review.find({ estate: estateId })
      .sort(sortObject)
      .skip(skip)
      .limit(limit);
  }

  // Dohvaćanje recenzije po ID-u
  async getReviewById(reviewId: string): Promise<IReview | null> {
    const review = await Review.findById(reviewId);

    if (!review) throw new NotFoundError("Recenzija nije pronađena");

    return review;
  }

  // Ažuriranje recenzije
  async updateReview(
    reviewId: string,
    userId: string,
    dto: UpdateReviewDto
  ): Promise<IReview | null> {
    const session = await mongoose.startSession();

    try {
      const updatedResult = await session.withTransaction(async () => {
        const review = await Review.findById(reviewId).session(session);

        if (!review) throw new NotFoundError("Recenzija nije pronadjena.");
        if (review.user.toString() !== userId) {
          throw new ForbiddenError(
            "Nemate dozvolu za ažuriranje ove recenzije."
          );
        }
        if (review.editCount >= 1)
          throw new BadRequestError(
            "Recenziju je moguće ažurirati samo jednom."
          );
        if (review.editDeadline && new Date() > review.editDeadline)
          throw new BadRequestError("Rok za uređivanje recenzije je istekao.");

        const oldRating = { ...review.rating };
        const newRating = dto.rating;
        review.rating = newRating;
        review.comment = dto.comment;
        review.editCount += 1;
        await review.save({ session });

        logging.log(oldRating);
        logging.log(newRating);

        // Ažuriranje prosječne ocjene nekretnine
        const estateId = review.estate;
        const updateQuery = generateMongoAverageRatingUpdateForUpdate(
          "averageRating",
          "reviewsCount",
          oldRating,
          newRating
        );

        await ResidentialEstate.findByIdAndUpdate(estateId, [updateQuery], {
          new: true,
          session,
        });

        return review;
      });

      return updatedResult;
    } finally {
      session.endSession();
    }
  }

  // // Brisanje recenzije nije moguce
  // async deleteReview(
  //   reviewId: string,
  //   userId: string
  // ): Promise<IReview | null> {
  //   const review = await Review.findById(reviewId);

  //   if (!review) throw new NotFoundError("Recenzija nije pronađena");

  //   if (review.user.toString() !== userId) {
  //     throw new ForbiddenError("Nemate dozvolu za brisanje ove recenzije.");
  //   }

  //   //Dio za azuriranje prosjecne ocjene?
  //   return await Review.findByIdAndDelete(reviewId);
  // }
}

export const reviewService = new ReviewService();
