import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { rooms } from "./rooms.js";
import { connectDB } from "./config/db.js";
import colors from "colors";

const app = express();

app.use(cors());

config();

connectDB();

const PORT = process.env.PORT || 5000;

app.get("/api/room", (req, res) => {
  res.send(rooms);
});

app.get("/api/room/:id", (req, res) => {
  const singleRoom = rooms.find((r) => r._id === req.params.id);
  res.send(singleRoom);
});

app.listen(PORT, () => {
  console.log(`Server Started on PORT: ${PORT}`.yellow);
});
