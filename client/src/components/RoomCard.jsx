import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getRoom } from "@/actions/roomActions";
import moment from "moment";

const RoomCard = ({ room }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuctionEnded = useMemo(() => {
    if (!room?.endsOn) return false;
    const endDate = new Date(room.endsOn.replace(" ", "T"));
    return endDate <= new Date();
  }, [room?.endsOn]);

  const singleRoom = () => {
    const roomId = room?._id;
    if (roomId) {
      dispatch(getRoom(roomId, navigate));
    }
  };

  return (
    <div role="button" onClick={singleRoom} className="border border-zinc-300">
      <div className=" flex justify-center items-center h-56">
        <img className="p-5 max-h-56" src={room.itemPic} alt="item-pic" />
      </div>
      <div className="p-2 pb-5 pt-0">
        <p className="text-lg pb-5 uppercase text-center">{room?.roomName}</p>
        <p className="text-sm">
          {isAuctionEnded ? "Winning Bid" : "Current Bid"}: &#36;
          {room?.currentBid ? room?.currentBid?.bid : 0}{" "}
        </p>
        <p className="text-sm">Opening Bid: &#36;{room?.openingBid}</p>
        <p className="text-sm">
          {isAuctionEnded ? "Ended On" : "Ends On"}:{" "}
          {moment(room?.endsOn).format("dddd, MMMM Do YYYY, h:mm A")}
        </p>
        <div className="flex justify-end pt-3">
          {isAuctionEnded ? (
            <Button variant={"link"}>View Bid</Button>
          ) : (
            <Button>Place Bid</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
