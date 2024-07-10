import appLogo from "/favicon.svg";
import reactLogo from "../assets/react.svg";

import { Web5Connection } from "@/web5/Web5Connection";

export const Home = () => {
  return (
    <div className="text-center">
      <div className="flex justify-center my-4">
        <a href="https://vitejs.dev" target="_blank">
          <img src={appLogo} className="h-16 mx-4" alt="vite-pwa logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-16 mx-4" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold">DWA Starter</h1>
      <div className="my-4">
        <Web5Connection />
      </div>
    </div>
  );
};
