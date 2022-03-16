import { LiveReload, Outlet } from "remix";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Can I Stream...?</title>
      </head>
      <body>
        <h1>Can I Stream...?</h1>
        <div>
          <Outlet/>
        </div>
        {process.env.NODE_ENV === "development" ? (
          <LiveReload />
        ) : null}
      </body>
    </html>
  );
}
