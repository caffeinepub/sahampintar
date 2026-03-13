import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { motion } from "motion/react";
import { Dashboard } from "./pages/Dashboard";
import { StockDetail } from "./pages/StockDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 2,
    },
  },
});

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster theme="dark" />
    </div>
  ),
});

function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
      data-ocid="nav.panel"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <a
            href="/"
            className="flex items-center gap-2.5"
            data-ocid="nav.link"
          >
            <img
              src="/assets/generated/saham-pintar-logo-transparent.dim_120x120.png"
              alt="SahamPintar"
              className="h-8 w-8 object-contain"
            />
            <div>
              <span className="font-display font-bold text-foreground text-lg leading-none block">
                SahamPintar
              </span>
              <span className="text-xs text-muted-foreground leading-none">
                Analisa Saham IDX Real-Time
              </span>
            </div>
          </a>
          <div className="flex items-center gap-1">
            {["ADRO", "PTBA", "ANTM", "TLKM", "BBSI"].map((t) => (
              <a
                key={t}
                href={`/stock/${t}`}
                className="hidden sm:block text-xs font-mono text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-accent transition-colors"
                data-ocid="nav.link"
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const utmUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;
  return (
    <footer className="border-t border-border mt-16 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs text-muted-foreground">
          © {year} SahamPintar. Dibuat dengan ❤️ menggunakan{" "}
          <a
            href={utmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          ⚠️ Bukan merupakan saran investasi. Selalu lakukan riset mandiri.
        </p>
      </div>
    </footer>
  );
}

// Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const stockDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stock/$ticker",
  component: StockDetail,
});

const routeTree = rootRoute.addChildren([indexRoute, stockDetailRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
