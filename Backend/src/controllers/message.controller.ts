import { Request, Response } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";
import cloudinary from "../lib/cloudinary";

export const getUser = async (req: Request, res: Response) => {
  try {
    const LoggedInUser = req.user?._id;
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

export const getMessage = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user?._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(
      "Error in getMessage controller:",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({ message: "Internal server error." });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    let imageUrl;
    if (image) {
      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(
      "Error in sendMessage controller:",
      error instanceof Error ? error.message : error
    );
    res.status(500).json({ message: "Internal server error." });
  }
};
