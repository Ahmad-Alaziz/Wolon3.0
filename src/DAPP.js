import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import VerticalNavbar from "./components/VerticalNavBar";
import HelpOthers from "./pages/helpOthers";

import "./App.scss";

const DAPP = ({ dappContract, address, memberNFT }) => {
  const [collapsed, setCollapsed] = useState(false);
  const handleCollapsedChange = (checked) => {
    setCollapsed(checked);
  };

  return (
    <div className={`app`}>
      <VerticalNavbar
        collapsed={collapsed}
        toggled={true}
        handleCollapse={handleCollapsedChange}
      />
      <Routes>
        <Route
          index
          element={
            <Dashboard dappContract={dappContract} memberNFT={memberNFT} />
          }
        />
        <Route path="help" element={<HelpOthers />} />
        <Route path="messages" element={<Dashboard />} />
        <Route path="chat" element={<Dashboard />} />
        <Route path="vote" element={<Dashboard />} />
        <Route path="support" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default DAPP;
