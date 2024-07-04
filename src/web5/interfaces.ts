export interface ActivatePolyfillsOptions {
  serviceWorker?: boolean;
  injectStyles?: boolean;
  links?: boolean;
  onCacheCheck?: (event: any, route: string) => { ttl: number };
}
