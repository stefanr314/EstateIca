import CustomError from "./CustomError";

class NotFoundError extends CustomError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

export default NotFoundError;
