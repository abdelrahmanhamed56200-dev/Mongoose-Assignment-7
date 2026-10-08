import mongoose from "mongoose"
import { env } from "../config/env.js";

export async function connectDB  () {
    try {
        await mongoose.connect(env.db.url);
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

