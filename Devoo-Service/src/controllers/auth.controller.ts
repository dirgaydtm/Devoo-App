import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateJWT } from "../lib/utils";
import cloudinary from "../lib/cloudinary";

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
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
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //genarate jwt
      generateJWT(newUser._id.toString(), res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.log(
      "Error in signup controller:",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({ message: "Internal server error." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credential." });
    }

    await bcrypt.compare(password, user.password).then((isMatch: boolean) => {
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credential." });
      }
    });
    // Generate JWT
    generateJWT(user._id.toString(), res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.log(
      "Error in login controller:",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({ message: "Internal server error." });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt"); // Clear the JWT cookie
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.log(
      "Error in logout controller:",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profilePicture, username } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user._id;

    if (!profilePicture && !username) {
      return res.status(400).json({ message: "Nothing to update." });
    }

    const updateData: { profilePicture?: string; username?: string } = {};

    if (profilePicture) {
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(profilePicture);
      updateData.profilePicture = uploadResult.secure_url;
    }

    if (username) {
      updateData.username = username;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.status(200).json({ updatedUser });
  } catch (error) {
    console.log(
      "Error in updateProfile controller:",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({ message: "Internal server error." });
  }
};
