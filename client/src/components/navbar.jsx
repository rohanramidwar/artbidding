import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import bidLogo from "../assets/bid-logo.png";
import { getOrders } from "@/actions/roomActions";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSignedIn, userId } = useAuth();

  const showMyOrders = () => {
    if (isSignedIn) {
      dispatch(getOrders(userId, navigate));
    } else {
      toast.error("Please sign in first");
    }
  };

  return (
    <nav className="flex justify-between py-2 px-6 bg-zinc-100 shadow items-center text-slate-800">
      <Link to="/">
        <div className="flex items-center gap-2">
          <img className="w-8 h-8" src={bidLogo} alt="b" />
          <p className="hidden sm:block font-medium">BiddingWars</p>
        </div>
      </Link>

      <div className="flex gap-6">
        {isSignedIn && (
          <Button onClick={showMyOrders} variant="outline">
            My orders
          </Button>
        )}

        <Link to="/create-room">
          <Button variant="outline">Create auction</Button>
        </Link>
        <SignedOut>
          <SignInButton className="btn" />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
