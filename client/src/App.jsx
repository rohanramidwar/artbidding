import React from "react";
import Homepage from "./pages/Homepage";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreatePost from "./components/CreatePost";
import { Toaster } from "react-hot-toast";
import SingleRoom from "./pages/SingleRoom";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" Component={Homepage} />
        <Route path="/create-room" Component={CreatePost} />
        <Route path="/room/:id" Component={SingleRoom} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
