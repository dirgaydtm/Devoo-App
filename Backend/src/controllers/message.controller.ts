import { Request, Response } from "express";
import User from "../models/user.model";

export const getUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const LoggedInUser = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: LoggedInUser } }).select(
      "-password"
    );

    res.status(200).json(filteredUser);
  } catch (error) {
    console.log(
      "Error in getUser controller:",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({ message: "Internal server error." });
  }
};
