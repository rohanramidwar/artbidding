import React from "react";
import Navbar from "./components/navbar";
import AllAuctions from "./components/allAuctions";
import { Route, Routes } from "react-router-dom";
import CreateAuction from "./components/createAuction";
import MyAuctions from "./components/myAuctions";
import ViewAuction from "./components/viewAuction";

const App = () => {
  return (
    <>
      {/* navbar  */}
      <Navbar />
      {/* all auctions  */}
      <Routes>
        <Route path="/" Component={AllAuctions} />
        <Route path="/create-auction" Component={CreateAuction} />
        <Route path="/my-auctions" Component={MyAuctions} />
        <Route path="/view-auction" Component={ViewAuction} />
      </Routes>
      {/* create auction  */}
      {/* my auctions  */}
      {/* view auction */}
    </>
  );
};

export default App;
