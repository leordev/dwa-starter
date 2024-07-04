import { addLinkFeatures, injectElements } from "./dwa-elements";
import { ActivatePolyfillsOptions } from "./interfaces";
import { setupDwaWorker } from "./setup-dwa-worker";

export const activatePolyfills = (options: ActivatePolyfillsOptions = {}) => {
  if (options.serviceWorker !== false) {
    setupDwaWorker(options);
  }

  const hasWindowDocument =
    typeof window !== "undefined" && typeof window.document !== "undefined";
  if (hasWindowDocument) {
    if (options.injectStyles !== false) {
      handleDwaElementsInjection();
    }
    if (options.links !== false) {
      addLinkFeatures();
    }
  }
};

const handleDwaElementsInjection = () => {
  if (document.readyState !== "loading") {
    injectElements();
  } else {
    document.addEventListener("DOMContentLoaded", injectElements, {
      once: true,
    });
  }
};
