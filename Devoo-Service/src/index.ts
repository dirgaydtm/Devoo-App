import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db';
import authRoutes from './routes/auth.route';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/api/auth", authRoutes)

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectDB()
});
