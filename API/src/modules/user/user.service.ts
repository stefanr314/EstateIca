import { ForbiddenError, NotFoundError } from "../../shared/errors";
import { GetAllUsersQueryDto } from "./dtos/getAllUsers.dto";
import { UpdateUserDto } from "./dtos/updateUser.dto";
import { UserIdParamsDto } from "./dtos/userIdParams.dto";
import { User } from "./user.model";

export class UserService {
  // Define methods for user-related operations here
  // For example, getUserById, updateUser, deleteUser, etc.
  // These methods will interact with the User model and handle business logic
  async getUserById(dto: UserIdParamsDto) {
    const user = await User.findById(dto.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (!user.isActive) {
      throw new ForbiddenError("User is not active");
    }
    // const wishlist = await user.populate("wishlist"); //NEK ZJAPI OVAKO TRENUTNO
    // logging.log(wishlist);

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      //   wishlist,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      isSuperhost: user.isSuperhost,
      profilePictureUrl: user.profilePictureUrl,
      joined: user.createdAt,
    };
  }
  async updateUser(dtoUserId: UserIdParamsDto, userData: UpdateUserDto) {
    const user = await User.findById(dtoUserId.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (!user.isActive) {
      throw new ForbiddenError("User is not active");
    }
    // Update user properties
    user.firstName = userData.firstName || user.firstName;
    user.lastName = userData.lastName || user.lastName;
    user.profilePictureUrl =
      userData.profilePictureUrl || user.profilePictureUrl;
    user.phoneNumber = userData.phone || user.phoneNumber;
    await user.save();
    return {
      message: "User updated successfully",
      userId: user._id.toString(),
    };
  }
  async deleteUser(dto: UserIdParamsDto) {
    const user = await User.findById(dto.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (!user.isActive) {
      throw new ForbiddenError("User is not active");
    }
    user.isActive = false; // Soft delete by setting isActive to false
    await user.save();
    return {
      message: "User deleted successfully",
      userId: user._id.toString(),
    };
  }
  async getAllUsers(dto: GetAllUsersQueryDto) {
    const { page = 1, limit = 10, isVerified, isActive, sortBy, search } = dto;
    const skip = (page - 1) * limit;

    let queryObject: any = {};
    if (isActive !== undefined) {
      queryObject.isActive = isActive;
    }
    if (isVerified !== undefined) {
      queryObject.isVerified = isVerified;
    }
    if (search) {
      queryObject.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const query = User.find(queryObject);
    if (sortBy) {
      const sortObject: Record<string, 1 | -1> = {};
      const sortFields = sortBy.split(",");

      for (const field of sortFields) {
        const [key, order] = field.split(":");
        sortObject[key] = order === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
      }
      query.sort(sortObject);
    }
    const users = await query.skip(skip).limit(limit).exec();
    if (!users || users.length === 0) {
      throw new NotFoundError("No users found");
    }
    logging.log(users);
    return users.map((user) => ({
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      joined: user.createdAt,
    }));
  }
  async toggleActivity(dto: UserIdParamsDto) {
    const user = await User.findById(dto.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    user.isActive = !user.isActive; // Toggle the isActive status
    await user.save();
    return {
      message: user.isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      userId: user._id.toString(),
      isActive: user.isActive,
    };
  }
}
