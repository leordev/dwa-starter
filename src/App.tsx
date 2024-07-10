// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import appLogo from "/favicon.svg";

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import PWABadge from "@/PWABadge.tsx";
import { Sidebar } from "@/layout/Sidebar.tsx";
import { Settings } from "@/pages/Settings.tsx";
import { Home } from "@/pages/Home.tsx";

export const App = () => {
  return (
    <Router>
      <div className="flex md:min-h-screen">
        <Sidebar />
        <div className="ml-52 p-4 w-full md:ml-0">
          <Routes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        <PWABadge />
      </div>
    </Router>
  );
};
