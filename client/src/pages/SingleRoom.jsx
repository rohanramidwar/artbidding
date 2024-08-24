import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getAllBids, joinRoom, placeBid } from "@/actions/roomActions";
import { io } from "socket.io-client";
import { ADD_BID } from "@/constants/actionTypes";

const ENDPOINT = "http://localhost:5000";

const SingleRoom = () => {
  const dispatch = useDispatch();
  const socketRef = useRef();

  // const [socketConnected, setSocketConnected] = useState(false);

  const { isLoading, selectedRoom, allBids } = useSelector(
    (state) => state?.rooms
  );
  const { isSignedIn, userId } = useAuth();

  const registerToBid = () => {
    const roomId = selectedRoom?._id;
    if (isSignedIn) {
      dispatch(joinRoom({ roomId, clerkUserId: userId }));
    } else {
      toast.error("Please sign in first");
    }
  };

  const submitBid = () => {
    const room = selectedRoom?._id;
    const bid = selectedRoom?.currentBid?.bid
      ? selectedRoom?.currentBid?.bid + 1
      : selectedRoom?.openingBid + 1;
    if (isSignedIn) {
      dispatch(placeBid({ bid, clerkUserId: userId, room }, socketRef.current));
    }
  };

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

  useEffect(() => {
    if (isSignedIn && socketRef.current) {
      const handleBidReceived = (newBidReceived) => {
        if (selectedRoom?._id !== newBidReceived.room._id) {
        } else {
          dispatch({ type: ADD_BID, payload: newBidReceived });
        }
      };

      socketRef.current.on("bid received", handleBidReceived);

      return () => {
        socketRef.current.off("bid received", handleBidReceived);
      };
    }
  }, [isSignedIn, selectedRoom, dispatch]);

  return (
    <div className="flex justify-between p-6 text-slate-800 w-full">
      {/* left  */}
      <div className="w-1/3">
        <p className="text-4xl py-6">{selectedRoom?.roomName}</p>
        <p>
          Current bid: &#36;
          {selectedRoom?.currentBid ? selectedRoom?.currentBid?.bid : 0}
        </p>
        <p>Opening bid: &#36;{selectedRoom?.openingBid}</p>
        <p>Ends on: {selectedRoom?.endsOn}</p>
        <img className="py-6" src={selectedRoom?.itemPic} alt="item-pic" />
      </div>

      {/* right */}
      <div className="flex flex-col w-1/3">
        <div className="py-6 flex justify-between items-center">
          <p className="text-2xl">All bids</p>
          {selectedRoom?.bidders.find(
            (bidder) => bidder.clerkUserId === userId
          ) ? (
            <Button onClick={submitBid} disabled={isLoading}>
              {isLoading ? "Placing.." : "Place bid"}
            </Button>
          ) : (
            <Button onClick={registerToBid} disabled={isLoading}>
              {isLoading ? "Registering.." : "Register to bid"}
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-6">
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
    </div>
  );
};

export default SingleRoom;
