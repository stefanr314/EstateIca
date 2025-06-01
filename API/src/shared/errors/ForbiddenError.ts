import CustomError from "./CustomError";

class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export default ForbiddenError;
