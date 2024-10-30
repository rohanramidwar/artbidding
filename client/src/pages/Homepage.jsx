import { getAllRooms } from "@/actions/roomActions";
import Hero from "@/components/Hero";
import RoomCard from "@/components/RoomCard";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Homepage = () => {
  const dispatch = useDispatch();

  //fetch all rooms
  useEffect(() => {
    dispatch(getAllRooms());
  }, [dispatch]);

  const { rooms, isLoading } = useSelector((state) => state?.rooms);

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
    <div className="text-slate-800">
      <Hero />
      <div className="p-5 sm:p-14">
        <p className="text-xl uppercase">Live auctions</p>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="py-8">
            {!liveRooms.length ? (
              <p>No live auctions found</p>
            ) : (
              <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {liveRooms.map((room) => (
                  <RoomCard key={room?._id} room={room} />
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-xl uppercase">Past auctions</p>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="py-8">
            {!pastRooms.length ? (
              <p>No past auctions found</p>
            ) : (
              <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {pastRooms.map((room) => (
                  <RoomCard key={room?._id} room={room} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>{" "}
    </div>
  );
};

export default Homepage;
