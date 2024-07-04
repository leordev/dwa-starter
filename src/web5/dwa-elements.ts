import { getDwnEndpoints } from "./dids";

const httpToHttpsRegex = /^http:/;
const trailingSlashRegex = /\/$/;

let activeNavigation: boolean | undefined;

const loaderStyles = `
  .drl-loading-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: #fff;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    z-index: 1000000;
  }

  .drl-loading-overlay > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .drl-loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
  }

    .drl-loading-spinner div {
      position: relative;
      width: 2em;
      height: 2em;
      margin: 0.1em 0.25em 0 0;
    }
    .drl-loading-spinner div::after,
    .drl-loading-spinner div::before {
      content: '';  
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 0.1em solid #FFF;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      animation: drl-loading-spinner 2s linear infinite;
    }
    .drl-loading-spinner div::after {
      animation-delay: 1s;
    }

  .drl-loading-overlay span {
    --text-opacity: 2;
    display: flex;
    align-items: center;
    margin: 2em auto 0;
    padding: 0.2em 0.75em 0.25em;
    text-align: center;
    border-radius: 5em;
    background: rgba(255 255 255 / 8%);
    opacity: 0.8;
    transition: opacity 0.3s ease;
    cursor: pointer;
  }

    .drl-loading-overlay span:focus {
      opacity: 1;
    }

    .drl-loading-overlay span:hover {
      opacity: 1;
    }

    .drl-loading-overlay span::before {
      content: "✕ ";
      margin: 0 0.4em 0 0;
      color: red;
      font-size: 65%;
      font-weight: bold;
    }

    .drl-loading-overlay span::after {
      content: "stop";
      display: block;
      font-size: 60%;
      line-height: 0;
      color: rgba(255 255 255 / 60%);
    }

    .drl-loading-overlay.new-tab-overlay span::after {
      content: "close";
    }
  
  @keyframes drl-loading-spinner {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
`;

let elementsInjected = false;
export const injectElements = () => {
  if (elementsInjected) return;
  const style = document.createElement("style");
  style.innerHTML = `
    ${loaderStyles}

    .drl-loading-overlay {
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    :root[drl-link-loading] .drl-loading-overlay {
      opacity: 1;
      pointer-events: all;
    }
  `;
  document.head.append(style);

  let overlay = document.createElement("div");
  overlay.classList.add("drl-loading-overlay");
  overlay.innerHTML = `
    <div class="drl-loading-spinner">
      <div></div>
      Loading DRL
    </div> 
    <span tabindex="0"></span>
  `;
  overlay.lastElementChild?.addEventListener("click", cancelNavigation);
  document.body.prepend(overlay);
  elementsInjected = true;
};

const cancelNavigation = () => {
  document.documentElement.removeAttribute("drl-link-loading");
  activeNavigation = undefined;
};

const DID_URL_REGEX = /^https?:\/\/dweb\/([^/]+)\/?(.*)?$/;

const tabContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loading DRL...</title>
  <style>
    html, body {
      background-color: #151518;
      height: 100%;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      text-align: center;
    }
    ${loaderStyles}
  </style>
</head>
<body>
  <div class="drl-loading-overlay new-tab-overlay">
    <div class="drl-loading-spinner">
      <div></div>
      Loading DRL
    </div>
    <span onclick="window.close()" tabindex="0"></span>
  </div>
</body>
</html>
`;

interface ContextMenuTargetObject {
  src?: string;
  __src__?: string;
}
let contextMenuTarget: ContextMenuTargetObject | undefined;
async function resetContextMenuTarget(e?: PointerEvent) {
  if (e?.type === "pointerup") {
    await new Promise((r) => requestAnimationFrame(r));
  }
  if (contextMenuTarget) {
    contextMenuTarget.src = contextMenuTarget.__src__;
    delete contextMenuTarget.__src__;
    contextMenuTarget = undefined;
  }
}

let linkFeaturesActive = false;
export const addLinkFeatures = () => {
  if (!linkFeaturesActive) {
    document.addEventListener("click", async (event: any) => {
      let anchor = event.target.closest("a");
      if (anchor) {
        let href = anchor.href;
        const match = href.match(DID_URL_REGEX);
        if (match) {
          let did = match[1];
          let path = match[2];
          const openAsTab = anchor.target === "_blank";
          event.preventDefault();
          try {
            let tab;
            if (openAsTab) {
              tab = window.open("", "_blank");
              tab?.document.write(tabContent);
            } else {
              activeNavigation = path;
              setTimeout(
                () =>
                  document.documentElement.setAttribute("drl-link-loading", ""),
                50
              );
            }
            const endpoints = await getDwnEndpoints(did);
            await new Promise((r) => setTimeout(r, 4000));
            if (!endpoints.length) throw null;
            let url = `${endpoints[0].replace(
              trailingSlashRegex,
              ""
            )}/${did}/${path}`;
            if (openAsTab && tab) {
              if (!tab.closed) tab.location.href = url;
            } else if (activeNavigation === path) {
              window.location.href = url;
            }
          } catch (e) {
            if (activeNavigation === path) {
              cancelNavigation();
            }
            throw new Error(
              `DID endpoint resolution failed for the DRL: ${href}`
            );
          }
        }
      }
    });

    document.addEventListener("pointercancel", resetContextMenuTarget);
    document.addEventListener("pointerdown", async (event: PointerEvent) => {
      const target = event.composedPath()[0] as ContextMenuTargetObject;
      if (
        (event.pointerType === "mouse" && event.button === 2) ||
        (event.pointerType === "touch" && event.isPrimary)
      ) {
        resetContextMenuTarget();
        if (target && target?.src?.match(DID_URL_REGEX)) {
          contextMenuTarget = target;
          target.__src__ = target.src;
          const drl = target.src
            .replace(httpToHttpsRegex, "https:")
            .replace(trailingSlashRegex, "");
          const responseCache = await caches.open("drl");
          const response = await responseCache.match(drl);
          const url = response?.headers.get("dwn-composed-url");
          if (url) target.src = url;
          (target as HTMLElement).addEventListener(
            "pointerup",
            resetContextMenuTarget,
            {
              once: true,
            }
          );
        }
      } else if (target === contextMenuTarget) {
        resetContextMenuTarget();
      }
    });

    linkFeaturesActive = true;
  }
};
