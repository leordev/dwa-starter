import { didResolver, getDwnEndpoints } from "./dids";
import { ActivatePolyfillsOptions } from "./interfaces";

/* Service Worker-based features */
declare let self: ServiceWorkerGlobalScope;

const didUrlRegex = /^https?:\/\/dweb\/([^/]+)\/?(.*)?$/;
const httpToHttpsRegex = /^http:/;
const trailingSlashRegex = /\/$/;

export const setupDwaWorker = async (
  options: ActivatePolyfillsOptions = {}
): Promise<void> => {
  const workerSelf = self;
  try {
    if (
      typeof ServiceWorkerGlobalScope !== "undefined" &&
      workerSelf instanceof ServiceWorkerGlobalScope
    ) {
      workerSelf.skipWaiting();

      workerSelf.addEventListener("activate", (event: any) => {
        // Claim clients to make the service worker take control immediately
        event.waitUntil(workerSelf.clients.claim());
      });

      workerSelf.addEventListener("fetch", (event: FetchEvent) => {
        const match = event.request.url.match(didUrlRegex);
        if (match) {
          event.respondWith(
            handleFetchDrlEvent(event, match[1], match[2], options)
          );
        }
      });
    } else if (globalThis?.navigator?.serviceWorker) {
      // TODO: check virtual registration
      // const registration = await navigator.serviceWorker.getRegistration("/");
      // if (!registration) {
      //   // @ts-ignore
      //   const installUrl =
      //     options.path ||
      //     (globalThis.document
      //       ? document?.currentScript?.src
      //       : import.meta?.url);
      //   if (installUrl)
      //     navigator.serviceWorker
      //       .register(installUrl, { type: "module" })
      //       .catch((error) => {
      //         console.error(
      //           "DWeb networking feature installation failed: ",
      //           error
      //         );
      //       });
      // }
    } else {
      throw new Error(
        "DWeb networking features are not available for install in this environment"
      );
    }
  } catch (error) {
    console.error("Error in installing networking features:", error);
  }
};

async function handleFetchDrlEvent(
  event: FetchEvent,
  did: string,
  path: string,
  options: ActivatePolyfillsOptions
): Promise<Response> {
  const drl = event.request.url
    .replace(httpToHttpsRegex, "https:")
    .replace(trailingSlashRegex, "");
  const responseCache = await caches.open("drl");
  const cachedResponse = await responseCache.match(drl);
  if (cachedResponse) {
    if (!navigator.onLine || !options.onCacheCheck) return cachedResponse;
    const match = await options?.onCacheCheck(event, drl);
    if (match) {
      const cacheTime = cachedResponse.headers.get("dwn-cache-time");
      if (
        cacheTime &&
        Date.now() < Number(cacheTime) + (Number(match.ttl) || 0)
      ) {
        return cachedResponse;
      }
    }
  }
  try {
    if (!path) {
      const response = await didResolver.resolve(did);
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else
      return await fetchResource(event, did, drl, path, responseCache, options);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.log(`Error in DID URL fetch: ${error}`);
    return new Response("DID URL fetch error", { status: 500 });
  }
}

async function fetchResource(
  event: FetchEvent,
  did: string,
  drl: string,
  path: string,
  responseCache: Cache,
  options: ActivatePolyfillsOptions
): Promise<Response> {
  const endpoints = await getDwnEndpoints(did);
  for (const endpoint of endpoints) {
    try {
      const url = `${endpoint.replace(trailingSlashRegex, "")}/${did}/${path}`;
      const response = await fetch(url, { headers: event.request.headers });
      if (response.ok) {
        const match =
          options.onCacheCheck && (await options?.onCacheCheck(event, drl));
        if (match) {
          cacheResponse(drl, url, response, responseCache);
        }
        return response;
      }
      console.log(`DWN endpoint error: ${response.status}`);
      return new Response("DWeb Node request failed", {
        status: response.status,
      });
    } catch (error) {
      console.log(`DWN endpoint error: ${error}`);
      return new Response("DWeb Node request failed: " + error, {
        status: 500,
      });
    }
  }
  throw new Response("DWeb Node resolution failed: no valid endpoints found.", {
    status: 530,
  });
}

async function cacheResponse(
  drl: string,
  url: string,
  response: Response,
  cache: Cache
) {
  const clonedResponse = response.clone();
  const headers = new Headers(clonedResponse.headers);
  headers.append("dwn-cache-time", Date.now().toString());
  headers.append("dwn-composed-url", url);
  const modifiedResponse = new Response(clonedResponse.body, { headers });
  cache.put(drl, modifiedResponse);
}
