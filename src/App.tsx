// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import appLogo from "/favicon.svg";

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PWABadge from "./PWABadge.tsx";
import { GlobalNav } from "./layout/GlobalNav.tsx";

import "./App.css";
import { Settings } from "./pages/Settings.tsx";
import { Home } from "./pages/Home.tsx";

function App() {
  return (
    <Router>
      <div className="app">
        <GlobalNav />
        <div className="content">
          <Routes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>

        <PWABadge />
      </div>
    </Router>
  );
}

// export function OldApp() {
//   const [count, setCount] = useState(0);
//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={appLogo} className="logo" alt="vite-pwa logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>DWA Starter</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//       <PWABadge />
//     </>
//   );
// }

export default App;
