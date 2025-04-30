import { client } from "@/client/sdk.gen";
import { SessionProvider } from "@/context/SessionContext";
import { routeTree } from "@/routeTree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import type { FC } from "react";
import { queryClient, withQuery } from "./withQuery";
import { withTheme } from "./withTheme";

const withProviders = (component: FC) =>
  withTheme(
    withQuery((props) => {
      return <SessionProvider>{component(props)}</SessionProvider>;
    })
  );

// OpenAPI
client.setConfig({
  baseURL: "/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
client.instance.interceptors.request.use((config) => {
  //console.log(config);
  return config;
});

// New router
const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <div>Loading...</div>,
  defaultPreload: "intent",
  context: {
    // auth: undefined!, // This will be set after we wrap the app in an AuthProvider
    queryClient,
  },
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerApp: FC = withProviders(() => {
  return <RouterProvider router={router} />;
});

export default InnerApp;
