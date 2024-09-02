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

  const parseDate = (dateString) => {
    return new Date(dateString.replace(" ", "T"));
  };

  const currentDate = new Date();

  const liveRooms = rooms?.filter(
    (room) => parseDate(room?.endsOn) > currentDate
  );

  const pastRooms = rooms?.filter(
    (room) => parseDate(room?.endsOn) <= currentDate
  );

  return (
    <div className="text-slate-800 p-6">
      <p className="text-2xl">Live auctions</p>
      <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 py-6">
        {!liveRooms.length && "No live auctions found 🐣"}
        {liveRooms.map((room) => (
          <RoomCard key={room?._id} room={room} />
        ))}
      </div>
      <p className="text-2xl">Past auctions</p>
      <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-6 pb-12">
        {!pastRooms.length && "No past auctions found 🐣"}
        {pastRooms.map((room) => (
          <RoomCard key={room?._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Homepage;
