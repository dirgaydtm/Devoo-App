import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateJwt } from "../lib/utils";

export const signup = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //genarate jwt
      generateJwt(newUser._id.toString(), res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.log(
      "Error during signup:",
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    res.status(500).json({ message: "Internal server error." });
  }
};

export const login = (req: Request, res: Response) => {
  res.send("login route");
};
export const logout = (req: Request, res: Response) => {
  res.send("logout route");
};
