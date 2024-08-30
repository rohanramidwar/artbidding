import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Swords } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex justify-between py-2 px-6 bg-zinc-100 shadow items-center text-slate-800">
      <Link to="/">
        <div className="flex items-center gap-2">
          <Swords size={16} />
          <p className="hidden sm:block">Bidding-Wars</p>
        </div>
      </Link>

      <div className="flex gap-6">
        <Link to="/create-room">
          <Button variant="outline">Create auction</Button>
        </Link>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
