import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import {Notifications} from "@mantine/notifications";
import {ColorSchemeScript, MantineProvider} from "@mantine/core";
import "~/tailwind.css";
// Ensure this is always below tailwind styles
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />

        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className="tw-bg-ap-background tw-text-ap-foreground tw-text-base tw-dark">
      <MantineProvider defaultColorScheme="dark">
                    <Notifications
                        position="top-right"
                        autoClose={5000}
                        zIndex={1000}
                    />

                    <Outlet />

                    <ScrollRestoration />
                    <Scripts />
                </MantineProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
