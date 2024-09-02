import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getAllBids, joinRoom, placeBid } from "@/actions/roomActions";
import { io } from "socket.io-client";
import { FETCH_ROOM, UPDATE_BIDS } from "@/constants/actionTypes";
import moment from "moment";
// import ConfettiEffect from "@/components/ConfettiEffect";
import { loadStripe } from "@stripe/stripe-js";

const ENDPOINT = "https://bidding-wars-backend.vercel.app";

const SingleRoom = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(); //current socket
  const [inProcess, setInProcess] = useState(false);

  const { isSignedIn, userId } = useAuth();
  const { isLoading, selectedRoom, allBids } = useSelector(
    (state) => state?.rooms
  );

  const isAuctionEnded = useMemo(() => {
    if (!selectedRoom?.endsOn) return false;
    const endDate = new Date(selectedRoom.endsOn.replace(" ", "T"));
    return endDate <= new Date();
  }, [selectedRoom?.endsOn]);

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

  const makePayment = async () => {
    setInProcess(true);
    const stripe = await loadStripe(
      "pk_test_51Ptrd0Kr2vWG4UII1jNdHmT0zC28evCW85B5vtvbVuP6zWretaX4Aq8cz8Qt4dUeVN6Bcy6J2USlOlfJMIVqwxBS00ytRUAzR0"
    );

    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(
      "https://bidding-wars-backend.vercel.app/api/stripe/create-checkout-session",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          roomId: selectedRoom?._id,
          name: selectedRoom?.roomName,
          pic: selectedRoom?.itemPic,
          amount: selectedRoom?.currentBid?.bid,
          userId: userId,
        }),
      }
    );

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    setInProcess(false);

    if (result.error) {
      console.log(result.error);
      setInProcess(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="px-6 sm:w-3/4 flex sm:flex-row flex-col gap-12 sm:justify-between py-12 text-slate-800">
        {/* left  */}
        <div className="sm:w-1/2">
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

          {isAuctionEnded ? (
            selectedRoom?.currentBid?.bidder?.clerkUserId === userId ? (
              <div className="pt-3">
                {/* <ConfettiEffect /> */}
                <p className="pb-1 text-lg">
                  Congratulations!🎉 You are the winner!
                </p>
                {selectedRoom?.claimed ? (
                  <>
                    <Button disabled={true}>Claimed</Button>
                    <p className="pt-2 text-blue-600">
                      Check order status in{" "}
                      <span className="text-lg">my orders</span>
                    </p>
                  </>
                ) : (
                  <Button
                    onClick={makePayment}
                    disabled={inProcess}
                    className="bg-blue-600 hover:bg-blue-500"
                  >
                    {inProcess ? "Claiming.." : "Claim item"}
                  </Button>
                )}
              </div>
            ) : selectedRoom?.currentBid?.bidder ? (
              <p className="pt-3">
                Sold to{" "}
                <span className="text-lg text-blue-600">
                  {selectedRoom.currentBid.bidder.firstName}{" "}
                  {selectedRoom.currentBid.bidder.lastName}{" "}
                </span>{" "}
                🎉 for{" "}
                <span className="text-lg text-green-600">
                  &#36;
                  {selectedRoom?.currentBid?.bid}
                </span>
              </p>
            ) : (
              <p className="pt-3 text-red-600">Sold to no one!</p>
            )
          ) : null}

          <img
            className="py-6 w-full"
            src={selectedRoom?.itemPic}
            alt="item-pic"
          />
        </div>

        {/* right */}
        <div className="flex flex-col sm:pb-0 pb-12 sm:w-1/2">
          <div className="pb-6 flex justify-between items-center">
            <p className="text-2xl">Recent bids</p>
            {isAuctionEnded && (
              <p className="text-red-600">Auction has ended!</p>
            )}
            {!isAuctionEnded &&
              (selectedRoom?.bidders.find(
                (bidder) => bidder.clerkUserId === userId
              ) ? (
                <Button onClick={sendBid} disabled={isLoading}>
                  {isLoading ? "Placing.." : "Place bid"}
                </Button>
              ) : (
                <Button onClick={registerToBid} disabled={isLoading}>
                  {isLoading ? "Registering.." : "Register to bid"}
                </Button>
              ))}
          </div>
          <div className="flex flex-col gap-6 bg-zinc-100 rounded-md p-6">
            {!allBids.length && "No bids yet 🐣"}
            {allBids?.map((bid) => (
              <div className="flex gap-2 items-center" key={bid?._id}>
                <img
                  className="w-5 h-5 rounded-full"
                  src={bid?.bidder?.profilePic}
                  alt="profile-pic"
                />
                <p>
                  <span className="text-lg">
                    {bid?.bidder?.firstName} {bid?.bidder?.lastName}
                  </span>{" "}
                  outbid with <span className="text-lg ">&#36;{bid?.bid}</span>{" "}
                </p>
                &#xb7;
                <span className="text-sm text-slate-600">
                  {" "}
                  {moment(bid?.createdAt).fromNow()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default SingleRoom;
