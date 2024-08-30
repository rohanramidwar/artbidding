import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getAllBids, joinRoom, placeBid } from "@/actions/roomActions";
import { io } from "socket.io-client";
import { FETCH_ROOM, UPDATE_BIDS } from "@/constants/actionTypes";

const ENDPOINT = "http://localhost:5000";

const SingleRoom = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(); //current socket

  const { isSignedIn, userId } = useAuth();
  const { isLoading, selectedRoom, allBids } = useSelector(
    (state) => state?.rooms
  );

  const registerToBid = () => {
    const roomId = selectedRoom?._id;
    if (isSignedIn) {
      dispatch(joinRoom({ roomId, clerkUserId: userId }));
    } else {
      toast.error("Please sign in first");
    }
  };

  const sendBid = () => {
    const room = selectedRoom?._id;
    const bid = selectedRoom?.currentBid?.bid
      ? selectedRoom?.currentBid?.bid + 1
      : selectedRoom?.openingBid + 1;
    if (isSignedIn) {
      dispatch(placeBid({ bid, clerkUserId: userId, room }, socketRef.current));
    }
  };

  //socket connection
  useEffect(() => {
    if (isSignedIn) {
      if (!socketRef.current) {
        socketRef.current = io(ENDPOINT);
      }

      socketRef.current.emit("setup", userId);
      socketRef.current.on("connection", console.log("Socket Connected"));

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [isSignedIn, userId]);

  //fetch all bids
  useEffect(() => {
    if (selectedRoom?._id) {
      dispatch(getAllBids(selectedRoom?._id, socketRef.current));
    }
  }, [selectedRoom]);

  //update bid(socket)
  useEffect(() => {
    if (isSignedIn && socketRef.current) {
      const handleBid = (newBid) => {
        if (selectedRoom?._id !== newBid.room._id) {
          //notify
        } else {
          dispatch({ type: UPDATE_BIDS, payload: newBid });
        }
      };

      socketRef.current.on("bid received", handleBid);

      return () => {
        socketRef.current.off("bid received", handleBid);
      };
    }
  }, [isSignedIn, selectedRoom, dispatch]);

  //update room(socket)
  useEffect(() => {
    if (isSignedIn && socketRef.current) {
      const handleRoomUpdate = (updatedRoomReceived) => {
        if (selectedRoom?._id !== updatedRoomReceived._id) {
          //notify
        } else {
          dispatch({ type: FETCH_ROOM, payload: updatedRoomReceived });
        }
      };

      socketRef.current.on("updated room received", handleRoomUpdate);

      return () => {
        socketRef.current.off("updated room received", handleRoomUpdate);
      };
    }
  }, [isSignedIn, selectedRoom, dispatch]);

  return (
    <div className="flex justify-center">
      <div className="w-3/4 flex gap-12 justify-between py-12 text-slate-800">
        {/* left  */}
        <div className="w-1/2">
          <p className="text-4xl pb-6">{selectedRoom?.roomName}</p>
          <p>
            Current bid:{" "}
            <span className="text-lg">
              &#36;
              {selectedRoom?.currentBid
                ? selectedRoom?.currentBid?.bid
                : 0}{" "}
            </span>
          </p>
          <p>Opening bid: &#36;{selectedRoom?.openingBid}</p>
          <p>Ends on: {selectedRoom?.endsOn}</p>
          <img
            className="py-6 w-full"
            src={selectedRoom?.itemPic}
            alt="item-pic"
          />
        </div>

        {/* right */}
        <div className="flex flex-col w-1/2">
          <div className="pb-6 flex justify-between items-center">
            <p className="text-2xl">Recent bids</p>
            {selectedRoom?.bidders.find(
              (bidder) => bidder.clerkUserId === userId
            ) ? (
              <Button onClick={sendBid} disabled={isLoading}>
                {isLoading ? "Placing.." : "Place bid"}
              </Button>
            ) : (
              <Button onClick={registerToBid} disabled={isLoading}>
                {isLoading ? "Registering.." : "Register to bid"}
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-6 bg-zinc-100 rounded-md p-6">
            {!allBids.length && "No bids yet"}
            {allBids?.map((bid) => (
              <div key={bid?._id}>
                <p>
                  <span>
                    {bid?.bidder?.firstName} {bid?.bidder?.lastName}
                  </span>{" "}
                  outbid with <span className="text-xl ">&#36;{bid?.bid}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default SingleRoom;
