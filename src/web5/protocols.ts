import { DwnApi } from "@web5/api";

const addSchemas = (config: any) => {
  const types = config.types;
  const protocolUri = config.protocol;
  return Object.entries(types).reduce((result: any, [key, value]: any) => {
    if (value.dataFormats.some((format: string) => format.match("json"))) {
      result[key] = types[key].schema = protocolUri + "/schemas/" + key;
    }
    return result;
  }, {});
};

const profileDef = {
  published: true,
  protocol: "https://schema.org/ProfileSample",
  types: {
    name: {
      dataFormats: ["application/json"],
      schema: "https://schema.org/ProfileSample/schemas/name",
    },
    avatar: { dataFormats: ["image/gif", "image/png", "image/jpeg"] },
  },
  structure: { name: {}, avatar: {} },
};

const profileDefinition = {
  published: true,
  protocol: "https://schema.org/ProfileSample",
  types: {
    name: {
      dataFormats: ["application/json"],
    },
    avatar: {
      dataFormats: ["image/gif", "image/png", "image/jpeg"],
    },
  },
  structure: {
    name: {},
    avatar: {},
  },
};

export const profile = {
  uri: profileDefinition.protocol,
  schemas: addSchemas(profileDefinition),
  definition: profileDefinition,
};

export const byUri = {
  [profileDefinition.protocol]: profile,
};

export const installProtocols = async (dwn: DwnApi, did: string) => {
  const installed = await dwn.protocols.query({ message: {} });
  const configurationPromises = [];
  console.info(JSON.stringify(profileDefinition), { profile });
  try {
    for (const protocolUri in byUri) {
      let record = installed.protocols.find(
        (record) => protocolUri === record.definition.protocol
      );
      // if (!record) {
      console.info("installing protocol: " + protocolUri);
      const definition = byUri[protocolUri].definition;
      configurationPromises.push(
        dwn.protocols.configure({
          message: { definition },
        })
      );
      // } else {
      //   console.info("protocol already installed: " + protocolUri);
      // }
    }

    const configurationResponses = await Promise.all(configurationPromises);
    try {
      await Promise.all(
        configurationResponses.map(({ protocol }) => protocol?.send(did))
      );
    } catch (e) {
      console.log("remote push of configuration failed", e);
      return true;
    }
  } catch (e) {
    console.log("local install of configuration failed", e);
    return false;
  }
  return true;
};
