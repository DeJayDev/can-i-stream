import { Links, LinksFunction, LiveReload, Outlet } from "remix";
import styles from "~/styles/app.css"

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Can I Stream...?</title>
        <Links/>
      </head>
      <body className="h-screen w-screen bg-white dark:bg-slate-900 dark:text-white"> {/* I feel like this is... "wrong", w/e */}
        <Outlet/>
        {process.env.NODE_ENV === "development" ? (
          <LiveReload />
        ) : null}
      </body>
    </html>
  );
}


export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }]
}
