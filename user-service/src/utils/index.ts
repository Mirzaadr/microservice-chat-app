import bcrypt from "bcryptjs";

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
      statusCode: number,
      message: string | undefined,
      isOperational = true,
      stack = ""
  ) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      if (stack) {
          this.stack = stack;
      } else {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

export const encryptPassword = async (password: string): Promise<string> => {
  const encryptedPassword = await bcrypt.hash(password, 12);
  return encryptedPassword;
}

export const isPasswordMatch = async (password: string, userPassword: string): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, userPassword);
  return isMatch;
}