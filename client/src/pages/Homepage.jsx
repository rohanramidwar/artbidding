import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRooms } from "@/actions/roomActions";
import Hero from "@/components/Hero";
import RoomCard from "@/components/RoomCard";

// Defining the shimmer animation in a style tag that will be embedded in the component
const CustomSkeleton = () => {
  return (
    <div className="border border-zinc-300">
      {/* Image placeholder */}
      <div className="flex justify-center items-center h-56">
        <div className="w-full h-44 mx-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:400%_100%]" />
      </div>

      {/* Content placeholder */}
      <div className="p-2 pb-5 pt-0">
        {/* Room name placeholder */}
        <div className="h-6 w-3/4 mx-auto mb-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:400%_100%]" />

        {/* Current/Winning bid placeholder */}
        <div className="h-4 w-2/3 mb-2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:400%_100%]" />

        {/* Opening bid placeholder */}
        <div className="h-4 w-1/2 mb-2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:400%_100%]" />

        {/* Date placeholder */}
        <div className="h-4 w-4/5 mb-2 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:400%_100%]" />

        {/* Button placeholder */}
        <div className="flex justify-end pt-3">
          <div className="h-9 w-24 rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:400%_100%]" />
        </div>
      </div>
    </div>
  );
};

const Homepage = () => {
  const dispatch = useDispatch();
  const { rooms, isLoading } = useSelector((state) => state?.rooms);

  useEffect(() => {
    dispatch(getAllRooms());
  }, [dispatch]);

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

  const skeletonCount = 4;

  return (
    <div className="text-slate-800">
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>

      <Hero />
      <div className="p-5 sm:p-14">
        <p className="text-xl uppercase">Live auctions</p>
        <div className="py-8">
          {isLoading ? (
            <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(skeletonCount)].map((_, index) => (
                <CustomSkeleton key={`live-skeleton-${index}`} />
              ))}
            </div>
          ) : !liveRooms?.length ? (
            <p>No live auctions found</p>
          ) : (
            <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {liveRooms.map((room) => (
                <RoomCard key={room?._id} room={room} />
              ))}
            </div>
          )}
        </div>

        <p className="text-xl uppercase">Past auctions</p>
        <div className="py-8">
          {isLoading ? (
            <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(skeletonCount)].map((_, index) => (
                <CustomSkeleton key={`past-skeleton-${index}`} />
              ))}
            </div>
          ) : !pastRooms?.length ? (
            <p>No past auctions found</p>
          ) : (
            <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {pastRooms.map((room) => (
                <RoomCard key={room?._id} room={room} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
