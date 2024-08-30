import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getRoom } from "@/actions/roomActions";

const RoomCard = ({ room }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const singleRoom = () => {
    const roomId = room?._id;
    if (roomId) {
      dispatch(getRoom(roomId, navigate));
    }
  };

  return (
    <div
      role="button"
      onClick={singleRoom}
      className="p-3 bg-zinc-100 border border-zinc-200 rounded-md"
    >
      <div className="overflow-clip max-h-40">
        <img className="" src={room.itemPic} alt="item-pic" />
      </div>
      <p className="text-xl pt-2">{room?.roomName}</p>
      <p>
        Current bid:{" "}
        <span className="text-lg">
          &#36;
          {room?.currentBid ? room?.currentBid?.bid : 0}{" "}
        </span>
      </p>
      <p>Opening bid: &#36;{room?.openingBid}</p>
      <p>Ends on: {room?.endsOn}</p>
      <div className="flex justify-end pt-3">
        <Button>Place bid</Button>
      </div>
    </div>
  );
};

export default RoomCard;
