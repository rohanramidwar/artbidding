import Room from "../models/roomModel.js";
import User from "../models/userModel.js";

export const createRoom = async (req, res) => {
  const { roomName, itemPic, openingBid, endsOn, clerkUserId } = req.body;

  const clerkUser = await User.findOne({ clerkUserId });

  const newRoom = new Room({
    roomName,
    itemPic,
    openingBid,
    endsOn,
    roomAdmin: clerkUser._id,
  });
  try {
    const room = await newRoom.save();

    res.status(201).json(room);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const joinRoom = async (req, res) => {
  const { roomId, clerkUserId } = req.body;

  const clerkUser = await User.findOne({ clerkUserId });

  try {
    const added = await Room.findByIdAndUpdate(
      roomId,
      {
        $push: { bidders: clerkUser._id },
      },
      { new: true }
    );

    res.status(201).json(added);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
