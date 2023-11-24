import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

mongoose.set("strictQuery", false);

async function mongoConnect() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.error("Error connecting to DB:", err.message);
  }
}

export default mongoConnect;
