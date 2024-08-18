import React from "react";
import AuctionCard from "./auctionCard";

const AllAuctions = () => {
  const items = [
    {
      picture:
        "https://i.pinimg.com/474x/13/67/eb/1367eb7f52e8cba1a9ab1147f18b77e5.jpg",
      name: "The Turtle's Path",
      startingBid: 85.0,
      endOn: "Thursday 5/16/24",
    },
  ];

  return (
    <div className="text-slate-800 p-6">
      <h1 className="text-4xl font-bold mb-8">Items For Sale</h1>
      <div className="grid grid-cols-5 gap-6 text-slate-800">
        {items.map((item, index) => (
          <AuctionCard
            key={index}
            picture={item.picture}
            name={item.name}
            startingBid={item.startingBid}
            endOn={item.endOn}
          />
        ))}
      </div>
    </div>
  );
};

export default AllAuctions;
