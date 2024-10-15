import mongoose from "mongoose";
import { env } from "../env";

export async function conectDatabase() {
  mongoose.connect(env.URL_DB)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));
}