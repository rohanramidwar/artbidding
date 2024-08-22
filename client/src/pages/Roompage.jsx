import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { joinRoom } from "@/actions/roomActions";

const Roompage = () => {
  const dispatch = useDispatch();

  const { isLoading, singleRoom } = useSelector((state) => state?.rooms);
  const { isSignedIn, userId } = useAuth();

  const registerToBid = () => {
    const roomId = singleRoom?._id;
    if (isSignedIn) {
      dispatch(joinRoom({ roomId, clerkUserId: userId }));
    } else {
      toast.error("Please sign in first");
    }
  };

  return (
    <div className="flex justify-between p-6 text-slate-800 w-full">
      {/* left  */}
      <div className="w-1/3">
        <p className="text-4xl py-6">{singleRoom?.roomName}</p>
        <p>
          Current bid: &#36;
          {singleRoom?.currentBid ? singleRoom?.currentBid : 0}
        </p>
        <p>Opening bid: &#36;{singleRoom?.openingBid}</p>
        <p>Ends on: {singleRoom?.endsOn}</p>
        <img className="py-6" src={singleRoom?.itemPic} alt="item-pic" />
      </div>

      {/* right */}
      <div className="w-1/3">
        <div className="py-6 flex justify-between items-center">
          <p className="text-2xl">All bids</p>
          <Button onClick={registerToBid}>
            {isLoading ? "Registering.." : "Register to bid"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Roompage;
