import ErrorPage from "@/pages/Error";
import NotFoundPage from "@/pages/NotFound";
import { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <Outlet />,
  notFoundComponent: (props) => <NotFoundPage {...props} />,
  errorComponent: (props) => <ErrorPage {...props} />,
});
