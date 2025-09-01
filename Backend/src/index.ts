import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './lib/db';
import authRoutes from './routes/auth.route';
import messageRoutes from './routes/message.route';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectDB()
});
