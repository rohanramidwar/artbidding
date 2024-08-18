import React from "react";
import logo from "../assets/bid.png";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-zinc-100 shadow text-slate-800 py-5 px-10 flex w-full justify-between items-center">
      <img src={logo} className="w-10   " alt="artbid" />
      <ul className="flex gap-8">
        <Link to={"/"}>
          <Button className="text-slate-800 bg-zinc-200 hover:bg-zinc-300">
            All Auctions
          </Button>
        </Link>
        <Link to={"/create-auction"}>
          <Button className="text-slate-800 bg-zinc-200 hover:bg-zinc-300">
            Create Auction
          </Button>
        </Link>
        <Link to={"/my-auctions"}>
          <Button className="text-slate-800 bg-zinc-200 hover:bg-zinc-300">
            My Auctions
          </Button>
        </Link>
      </ul>
      <div>
        <Button>Sign in</Button>
      </div>
    </nav>
  );
};

export default Navbar;
