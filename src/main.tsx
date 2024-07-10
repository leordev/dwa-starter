import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { Web5Provider } from "./web5/Web5Provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web5Provider>
      <App />
    </Web5Provider>
  </React.StrictMode>
);
