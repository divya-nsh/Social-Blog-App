import mongoose from "mongoose";
import { resolveWithRetries } from "../utils/generalUtils.js";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  let start = performance.now();
  try {
    console.log("connecting to DB...");
    await resolveWithRetries(
      () => mongoose.connect(process.env.MONOGDB_URL),
      {
        retries: 8,
        backOffFactor: 2,
        delay: 1000,
        onFailed(e, r) {
          console.log("Failed to connect to DB", e.message);
          console.log(`Retrying... ${r}/8`);
        },
      }
      //
      //0:1s 1:2s 2:4s 3:8s 4:16s 6:32s 7:64s 8:128s
    );
    console.log(
      "🍀 Succesfully connected to DB in",
      Math.floor(performance.now() - start) + "ms"
    );
  } catch (err) {
    console.log("----Error while connecting to Database----");
    console.log(err.message);
  }
}

mongoose.connection.on("disconnected", async () => {
  console.log("🔌 Database connection lost. Attempting to reconnect...");
  // connectDB();
});

mongoose.connection.on("error", (err) => {
  console.log("��� Database error");
});
