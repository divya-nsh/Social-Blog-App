import mongoose from "mongoose";

export async function connectDB() {
  const MONGODB_URL = process.env.MONGODB_URL;
  if (!MONGODB_URL) {
    throw new Error("MONGODB_URL is not parsed as env");
  }
  try {
    const now = performance.now();
    console.log("conecting to db.....");
    await mongoose.connect(MONGODB_URL);
    console.log(
      "🎉Connected to DB in",
      (performance.now() - now).toFixed(0) + "ms"
    );
  } catch (error) {
    console.log("Failed to connect to DB:");
    console.log(error);
  }
}

mongoose.connection.on("disconnected", () => {
  console.log("🔌 Database connection lost.");
});
