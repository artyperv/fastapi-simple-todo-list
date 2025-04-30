import { defineConfig, defaultPlugins } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-axios",
  input: "openapi.json",
  output: "src/client",
  plugins: [
    ...defaultPlugins,
    "@hey-api/schemas",
    "@hey-api/transformers",
    "@hey-api/typescript",
    "@tanstack/react-query",
  ],
});
