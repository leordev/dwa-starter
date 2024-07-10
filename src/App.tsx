import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PWABadge from "@/PWABadge.tsx";
import { Sidebar, SidebarButton } from "@/layout/Sidebar.tsx";
import { Settings } from "@/pages/Settings.tsx";
import { Home } from "@/pages/Home.tsx";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Web5Provider } from "@/web5/Web5Provider";

export const App = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Web5Provider>
          <div className="flex md:min-h-screen">
            {isDesktop && <Sidebar className="min-h-screen fixed w-64" />}
            <div
              className={`p-4 ${
                isDesktop ? "ml-64" : "w-full"
              } max-w-screen-lg`}
            >
              {!isDesktop && <SidebarButton />}
              <Routes>
                <Route path="/settings" element={<Settings />} />
                <Route path="/" element={<Home />} />
              </Routes>
            </div>
            <PWABadge />
          </div>
        </Web5Provider>
      </ThemeProvider>
    </Router>
  );
};
