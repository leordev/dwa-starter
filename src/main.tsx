import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "@/App.tsx";
import { Web5Provider } from "@/web5/Web5Provider";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web5Provider>
      <App />
    </Web5Provider>
  </React.StrictMode>
);
