import React, { createContext, useContext, useEffect, useState } from "react";

import { Web5, Web5ConnectResult } from "@web5/api";

import { Web5UserAgent } from "@web5/user-agent";
import { BearerDid } from "@web5/dids";
import { installProtocols } from "./protocols";

interface Web5ContextProps {
  initialized: boolean;
  web5Connection?: Web5ConnectResult;
  connect?: () => Promise<Web5ConnectResult>;
  isConnecting: boolean;
}

const Web5Context = createContext<Web5ContextProps>({
  initialized: false,
  isConnecting: false,
});

export const Web5Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initialized, setInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [web5Connection, setWeb5Connection] = useState<
    Web5ConnectResult | undefined
  >(undefined);

  useEffect(() => {
    console.log("Web5Provider initialized");
    setInitialized(true);
  }, []);

  const connect = async () => {
    if (!initialized) {
      throw new Error("Web5 not initialized");
    }

    setIsConnecting(true);

    try {
      const connection = await Web5.connect({
        techPreview: {
          dwnEndpoints: ["https://dwn.tbddev.org/dwn2"],
        },
      });
      setWeb5Connection(connection);
      setIsConnecting(false);
      return connection;
    } catch (error) {
      setIsConnecting(false);
      throw error;
    }
  };

  return (
    <Web5Context.Provider
      value={{ initialized, connect, web5Connection, isConnecting }}
    >
      {children}
    </Web5Context.Provider>
  );
};

export const useWeb5 = () => {
  const context = useContext(Web5Context);
  const [protocolsInitialized, setProtocolsInitialized] = useState(false);
  const [bearerDid, setBearerDid] = useState<BearerDid | undefined>(undefined);

  // TODO: refactor, installing proxy multiple times
  useEffect(() => {
    if (context.web5Connection && !bearerDid) {
      const loadBearerDid = async () => {
        if (!context.web5Connection) {
          return;
        }
        const userAgent = context.web5Connection.web5.agent as Web5UserAgent;
        const identity = await userAgent.identity.get({
          didUri: context.web5Connection.did,
        });
        if (!identity) {
          throw new Error("Failed to load Bearer Identity");
        }
        setBearerDid(identity.did);
      };
      loadBearerDid();

      if (!protocolsInitialized) {
        installProtocols(
          context.web5Connection.web5.dwn,
          context.web5Connection.did
        ).then((installationResult) => {
          setProtocolsInitialized(installationResult);
        });
      }
    }
  }, [context.web5Connection]);

  if (!context) {
    throw new Error("useWeb5 must be used within a Web5Provider");
  }

  const { web5Connection, isConnecting, connect } = context;

  const userAgent = web5Connection?.web5.agent as Web5UserAgent;

  return {
    web5Connection,
    isConnecting,
    connect,
    userAgent,
    dwn: web5Connection?.web5.dwn,
    did: web5Connection?.did,
    bearerDid,
  };
};
