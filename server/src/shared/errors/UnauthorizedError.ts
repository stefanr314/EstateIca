import CustomError from "./CustomError";

class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export default UnauthorizedError;
