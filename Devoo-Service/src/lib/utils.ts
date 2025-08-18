import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateJwt = (sub: string, res: Response) => {
  const token = jwt.sign({ sub }, process.env.JWT_SECRET as string, {
    expiresIn: "14d",
  });

  res.cookie("jwt", token, {
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    sameSite: "strict", // Helps prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
