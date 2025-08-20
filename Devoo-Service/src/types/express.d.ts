import { Document } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        username: string;
        profilePicture?: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}
