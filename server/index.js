import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import colors from "colors";
import roomRoutes from "./routes/roomRoutes.js";
import { Webhook } from "svix";
import bodyParser from "body-parser";
import User from "./models/userModel.js";
import mongoose from "mongoose";
import bidRoutes from "./routes/bidRoutes.js";

const app = express();
//enable us to send post req
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

app.use(express.json());

app.use("/api/room", roomRoutes);

app.use("/api/bid", bidRoutes);

config();

connectDB();

app.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async function (req, res) {
    try {
      const payloadString = req.body.toString();
      const svixHeaders = req.headers;

      const wh = new Webhook(process.env.WEBHOOK_SECRET);
      const evt = wh.verify(payloadString, svixHeaders);

      const { id, ...attributes } = evt.data;

      const eventType = evt.type;

      if (eventType === "user.created") {
        const firstName = attributes.first_name;
        const lastName = attributes.last_name;
        const profilePic = attributes.profile_image_url;

        const user = new User({
          clerkUserId: id,
          firstName: firstName,
          lastName: lastName,
          profilePic: profilePic,
        });

        await user.save();
        console.log("User is created");
      }

      res.status(200).json({
        success: true,
        message: "Webhook received",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Started on PORT: ${PORT}`.yellow);
});
