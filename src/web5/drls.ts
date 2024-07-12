export const drlFetchRecord = async (did: string, recordId: string) => {
  const dwebUrl = `https://dweb/${did}/records/${recordId}`;
  return fetch(dwebUrl);
};

export const drlFetchRecordJson = async (did: string, recordId: string) => {
  const res = await drlFetchRecord(did, recordId);
  return handleJsonResponse(res);
};

export const drlReadProtocol = async (
  did: string,
  protocolIdUri: string,
  subpath: string
) => {
  const encodedProtocolIdUri = encodeURIComponent(`${protocolIdUri}`);
  const dwebUrl = `https://dweb/${did}/read/protocols/${encodedProtocolIdUri}/${subpath}`;
  // https://dweb/${did}/read/protocols/${encodedProtocolIdUri}/avatar
  return fetch(dwebUrl);
};

export const drlReadProtocolJson = async (
  did: string,
  protocolIdUri: string,
  subpath: string
) => {
  const res = await drlReadProtocol(did, protocolIdUri, subpath);
  return handleJsonResponse(res);
};

// TODO: rest using protocols
//   const protocolRawUrl = "https://areweweb5yet.com/protocols/social";
//   const encodedProtocolIdUri = encodeURIComponent(protocolRawUrl);
//   const dwebUrl = `https://dweb/${did}/protocols/${encodedProtocolIdUri}/story/media`;
/**
 *
 * GET `https://dweb/${did}/protocols/${encodedProtocolIdUri}/story/media`;
 * list all the story media objects array
 *
 * GET https://dweb/${did}/read/protocols/${encodedProtocolIdUri}/story/media
 * returns the latest published media object
 * Useful for img tag src attribute (read last avatar)
 *
 * GET https://dweb/${did}/read/protocols/${encodedProtocolIdUri}/avatar
 * returns the latest published avatar object
 * Useful for img tag src attribute (read last avatar)
 *
 * handled here: https://github.com/TBD54566975/dwn-server/blob/main/src/http-api.ts#L145
 *
 */

const handleJsonResponse = async (res: Response) => {
  if (res.ok) {
    return res.json();
  } else {
    console.error(`[DRL Fetch Status ${res.status}]`, res);
    const errorText = await res.text().catch((err) => err);
    console.error(`[DRL Fetch Error]`, errorText);
  }
};
