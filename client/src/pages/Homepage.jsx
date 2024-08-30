import { getAllRooms } from "@/actions/roomActions";
import RoomCard from "@/components/RoomCard";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Homepage = () => {
  const dispatch = useDispatch();

  //fetch all rooms
  useEffect(() => {
    dispatch(getAllRooms());
  }, [dispatch]);

  const { rooms } = useSelector((state) => state?.rooms);

  return (
    <div className="text-slate-800 p-6">
      <p className="text-2xl">Live auctions</p>
      <div className="grid grid-cols-6 gap-6 py-6">
        {!rooms.length && "No live auctions found"}
        {rooms.map((room) => (
          <RoomCard key={room?._id} room={room} />
        ))}
      </div>
      <p className="text-2xl">Past auctions</p>
      <div className="grid grid-cols-6 gap-6 py-6">No past auctions found</div>
    </div>
  );
};

export default Homepage;
