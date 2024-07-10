import { useState } from "react";

import appLogo from "/favicon.svg";
import reactLogo from "../assets/react.svg";

import { Button } from "@/components/ui/button";

export const Home = () => {
  const [count, setCount] = useState(0);

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
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <p className="mt-2">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
};
