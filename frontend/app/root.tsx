import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
} from "react-router";
import type { Route } from "./+types/root";

import Header from "./Components/Header";
import Sidebar from "./Sidebar/Sidebar";

const linksArray = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
  },
];

// Use normal import in dev
if (import.meta.env.DEV) {
  import("./index.css");
} else {
  try {
    const stylesheet = await import("./index.css");
    linksArray.push({
      rel: "stylesheet",
      href: stylesheet.default as unknown as string,
    });
  } catch {
    // fallback
  }
}

export const links: Route.LinksFunction = () => linksArray as any;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      {/* 🌌 App layout */}
      <body className="relative flex flex-col h-screen w-screen overflow-hidden bg-[var(--color-solar-bg)] text-[var(--color-solar-text)]">
        {/* 🌠 StarMap renders behind everything */}
        <div className="absolute inset-0 -z-10">
          {children /* StarMap or page background lives here */}
        </div>

        {/* 🪐 Foreground UI */}
        <Header />

        {/* 📄 Main content layer */}
        <div
          className="relative flex flex-row flex-1 w-full overflow-hidden z-10"
          style={{
            paddingTop: "calc(var(--header-margin-top) + var(--header-height))",
          }}
        >
          <Sidebar />
          <Outlet />
        </div>

        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
