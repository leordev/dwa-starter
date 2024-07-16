# DWA Starter React

Decentralized Web App: it's a Web5 Progressive Web App.

## Why PWA?

It's a perfect match with Web5 DWNs since a PWA can work offline and DWN has a synced local storage.

## Running Locally

```sh
pnpm i
docker compose up -d
pnpm dev
```

## Building App

```sh
pnpm build
```

Deploy the `dist` folder to the server. It's just a static PWA! Please make sure all the settings are optimized for production, including your application descriptions, icons, service workers, polyfills and configurations (ie. check vite-pwa eslint recommendations below).

## React + Vite-PWA

This repo was created with vite-pwa, check the default instructions below.

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
