import React from "react";
import { Button } from "./ui/button";

const ViewAuction = () => {
  const item = {
    picture:
      "https://i.pinimg.com/474x/13/67/eb/1367eb7f52e8cba1a9ab1147f18b77e5.jpg",
    name: "The Turtle's Path",
    startingBid: 85.0,
    endOn: "Thursday 5/16/24",
  };

  const bids = [
    {
      bid: 87,
      name: "Rohan Ramidwar",
    },
    {
      bid: 86,
      name: "Rohan Ramidwar",
    },
  ];

  return (
    <div className="flex justify-between gap-6 p-6 text-slate-800">
      {/* left */}
      <div className="flex flex-col gap-3 w-full">
        <p className="text-4xl">
          Auction For <span className="font-bold">{item.name}</span>
        </p>
        <p>Current Bid: &#36;0</p>
        <p>Starting Bid: &#36;{item.startingBid}</p>
        <p>Bid Interval: &#36;1</p>
        <p>Ends On: {item.endOn}</p>
        <img
          className="max-w-sm border border-zinc-200 rounded-md "
          src={item.picture}
          alt=""
        />
      </div>
      {/* right */}
      <div className="w-full flex flex-col gap-6">
        <div className="flex justify-between">
          <p className="text-2xl font-semibold">Current Bid</p>
          <Button>Place Bid</Button>
        </div>
        <div className="flex flex-col gap-6">
          {bids.map((bid) => (
            <div className="bg-zinc-100 p-3 rounded-md">
              &#36;{bid.bid} by {bid.name} &#183; a minute ago
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewAuction;
