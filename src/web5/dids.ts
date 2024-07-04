import { UniversalResolver, DidDht, DidWeb } from "@web5/dids";

export const didResolver = new UniversalResolver({
  didResolvers: [DidDht, DidWeb],
});

export const getDwnEndpoints = async (did: string): Promise<string[]> => {
  const { didDocument } = await didResolver.resolve(did);
  let endpoints = didDocument?.service?.find(
    (service) => service.type === "DecentralizedWebNode"
  )?.serviceEndpoint;
  return (Array.isArray(endpoints) ? endpoints : [endpoints]).filter((url) =>
    url.startsWith("http")
  );
};
