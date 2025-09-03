import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../shared/errors";
import { GetWishlistQueryDto } from "./dtos/getWishlistQuert.dto";
import { Wishlist } from "./wishlist.model";

export class WishlistService {
  async getWishlist(userId: string, queryDto: GetWishlistQueryDto) {
    const { page, limit, sortBy } = queryDto;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    logging.log(skip);
    // Agregacija
    const wishlistAggregation = await Wishlist.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $unwind: { path: "$estates", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "baseestates", // ime kolekcije
          localField: "estates",
          foreignField: "_id",
          as: "estateDetails",
        },
      },
      { $unwind: { path: "$estateDetails", preserveNullAndEmptyArrays: true } },
      { $sort: { [`estateDetails.${sortBy}`]: -1 } }, // sortiranje po sortBy polju
      { $skip: skip },
      { $limit: limitNumber },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          estates: { $push: "$estateDetails" },
        },
      },
    ]);

    if (!wishlistAggregation || wishlistAggregation.length === 0) {
      // Kreiraj wishlist ako ne postoji
      const wishlist = await Wishlist.create({ user: userId, estates: [] });
      return wishlist;
    }

    return wishlistAggregation[0];
  }

  async addEstate(userId: string, estateId: string) {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $addToSet: { estates: estateId } }, // $addToSet sprječava duplikate
      { new: true, upsert: true }
    );

    return wishlist;
  }

  async removeEstate(userId: string, estateId: string) {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) throw new NotFoundError("Ne postoji lista zelja");

    wishlist.estates = wishlist.estates.filter(
      (id) => id.toString() !== estateId
    );
    await wishlist.save();
    return wishlist;
  }

  async clearWishlist(userId: string) {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) throw new NotFoundError("Ne postoji lista zelja");

    wishlist.estates = [];
    await wishlist.save();
    return wishlist;
  }
}

export const wishlistService = new WishlistService();
