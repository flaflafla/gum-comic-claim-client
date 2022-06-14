import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Claim from "./Claim";
import Detail from "./Detail";
import Stake from "./Stake";
import { KIDS_ADDRESS, PUPS_ADDRESS } from "./constants";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Stake />} />
      <Route path="claim" element={<Claim />} />
      <Route
        path="kid/:id"
        element={<Detail collectionAddress={KIDS_ADDRESS} />}
      />
      <Route
        path="pup/:id"
        element={<Detail collectionAddress={PUPS_ADDRESS} />}
      />
    </Routes>
  );
};

export default App;
