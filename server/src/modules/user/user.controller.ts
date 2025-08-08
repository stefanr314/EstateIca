import { ForbiddenError, UnauthorizedError } from "../../shared/errors";
import { Role } from "../../shared/types/role.enum";
import { GetAllUsersQueryDto } from "./dtos/getAllUsers.dto";
import { UpdateUserDto } from "./dtos/updateUser.dto";
import { UserIdParamsDto } from "./dtos/userIdParams.dto";
import { UserService } from "./user.service";
import { Request, Response, NextFunction } from "express";

const userService = new UserService();
/**
 * Controller for handling user-related requests.
 * This controller interacts with the UserService to perform operations like getting user details.
 */
/**
 * Gets user details by user ID.
 * @async
 * @param {Request} req - The request object containing user ID in params.
 * @param {Response} res - The response object to send the user details.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<void>} - Returns a promise that resolves when the user details are sent.
 * @throws {UnauthorizedError} - If the user is not found or is not active.
 * @throws {ForbiddenError} - If the user is not active.
 * @throws {Error} - If any other error occurs during the process.
 * */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const dto = req.params as UserIdParamsDto;
  try {
    const user = await userService.getUserById(dto);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const dto = req.params as UserIdParamsDto;
  const userData = req.body as UpdateUserDto;

  if (
    !req.user ||
    (dto.userId !== req.user.id && req.user.role !== Role.ADMIN)
  ) {
    throw new ForbiddenError("You are not authorized to update this user.");
  }
  try {
    const result = await userService.updateUser(dto, userData);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const dto = req.params as UserIdParamsDto;
  if (
    !req.user ||
    (dto.userId !== req.user.id && req.user.role !== Role.ADMIN)
  ) {
    throw new ForbiddenError("You are not authorized to update this user.");
  }
  try {
    const result = await userService.deleteUser(dto);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const toogleActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const dto = req.params as UserIdParamsDto;
  if (
    !req.user ||
    (dto.userId !== req.user.id && req.user.role !== Role.ADMIN)
  ) {
    throw new ForbiddenError("You are not authorized to manipulate this user.");
  }
  try {
    const result = await userService.toggleActivity(dto);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const dto = req.validated?.query as unknown as GetAllUsersQueryDto;
  try {
    const users = await userService.getAllUsers(dto);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
