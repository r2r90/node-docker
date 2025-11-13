import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import { createClient } from "redis";
import { RedisStore } from "connect-redis"; // ✅ правильный импорт

import {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} from "./config/config.js";

import postRouter from "./routes/postRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

const redisClient = createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`,
});
redisClient.on("error", (err) => console.error("❌ Redis Client Error", err));

await redisClient.connect();
console.log("✅ Connected to Redis");

const store = new RedisStore({
  client: redisClient,
  prefix: "session:",
});

app.use(
  session({
    store,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 60000,
    },
  })
);

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

async function connectWithRetry() {
  try {
    await mongoose.connect(mongoURL);
    console.log("✅ Successfully connected to Mongo Database :) !");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    setTimeout(connectWithRetry, 5000);
  }
}
connectWithRetry();

app.enable("trust proxy", true);
app.use(cors({}));
app.get("/api/v1", (req, res) => {
  res.send("<h1>BUBUBBUBUBU</h1>");
  console.log("Hellooooo");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server listening on port ${port}`));
