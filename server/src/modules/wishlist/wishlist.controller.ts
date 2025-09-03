import { Request, Response, NextFunction } from "express";
import { wishlistService } from "./wishlist.service";
import { UnauthorizedError } from "../../shared/errors";
import { GetWishlistQueryDto } from "./dtos/getWishlistQuert.dto";

export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError(
        "Morate biti ulogovani kako biste pristupili svojoj listi zelja."
      );
    const queryDto = req.query as unknown as GetWishlistQueryDto;
    const wishlist = await wishlistService.getWishlist(req.user.id, queryDto);

    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError(
        "Morate biti ulogovani kako biste pristupili svojoj listi zelja."
      );

    const { estateId } = req.params;
    const wishlist = await wishlistService.addEstate(req.user.id, estateId);

    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError(
        "Morate biti ulogovani kako biste pristupili svojoj listi zelja."
      );
    const { estateId } = req.params;
    const wishlist = await wishlistService.removeEstate(req.user.id, estateId);

    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};

export const clearWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user)
      throw new UnauthorizedError(
        "Morate biti ulogovani kako biste pristupili svojoj listi zelja."
      );
    const wishlist = await wishlistService.clearWishlist(req.user.id);

    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};
