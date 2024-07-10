import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PWABadge from "@/PWABadge.tsx";
import { Sidebar, SidebarButton } from "@/layout/Sidebar.tsx";
import { Settings } from "@/pages/Settings.tsx";
import { Home } from "@/pages/Home.tsx";
import { useMediaQuery } from "./hooks/use-media-query";

export const App = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <Router>
      <div className="flex md:min-h-screen">
        {isDesktop && <Sidebar className="min-h-screen fixed bg-white w-64" />}
        <div className={`p-4 ${isDesktop ? "ml-64" : "w-full"}`}>
          {!isDesktop && <SidebarButton />}
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
