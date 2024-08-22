import { getAllRooms } from "@/actions/roomActions";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const Homepage = () => {
  const dispatch = useDispatch();

  //fetch all rooms
  useEffect(() => {
    dispatch(getAllRooms());
  }, [dispatch]);

  return <div>Homepage</div>;
};

export default Homepage;
