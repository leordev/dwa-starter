export const drlFetchRecord = async (did: string, recordId: string) => {
  const dwebUrl = `https://dweb/${did}/records/${recordId}`;
  return fetch(dwebUrl);
};

export const drlFetchRecordJson = async (did: string, recordId: string) => {
  const res = await drlFetchRecord(did, recordId);
  if (res.ok) {
    return res.json();
  } else {
    console.error(`[DRL Fetch Status ${res.status}]`, res);
    const errorText = await res.text().catch((err) => err);
    console.error(`[DRL Fetch Error]`, errorText);
  }
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
