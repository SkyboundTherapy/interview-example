import {logger} from "@terreno/api";
import mongoose from "mongoose";

// A couple functions to simplify connecting to MongoDB.
export const connectToMongo = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/example";
    await mongoose.connect(mongoURI);
    console.info("MongoDB Connected...");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export async function closeMongo(): Promise<void> {
  await mongoose.connection.close();
  logger.info("Mongo connection closed");
}
