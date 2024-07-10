import React, { createContext, useEffect, useState } from "react";
import { activatePolyfills } from "../web-features";

interface Web5ContextProps {
  initialized: boolean;
}

const Web5Context = createContext<Web5ContextProps>({
  initialized: false,
});

const Web5Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log("Web5Provider initialized");
    activatePolyfills({
      injectStyles: true,
      links: true,
    });

    setInitialized(true);
  }, []);

  return (
    <Web5Context.Provider value={{ initialized }}>
      {children}
    </Web5Context.Provider>
  );
};

export { Web5Provider, Web5Context };
