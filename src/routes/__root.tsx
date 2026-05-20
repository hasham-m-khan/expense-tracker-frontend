import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { userQueryOptions } from '@/lib/auth';


import NavBar from '@/components/NavBar';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions);
    return { user };
  },

  component: () => (
    <div className="min-h-screen">
      <NavBar />
      <main className="px-4 pt-8 relative bg-base-200 min-h-1/1">
        <Outlet />
      </main>
      {/* <TanStackRouterDevtools /> */}
    </div>
  )
})