import Navbar from "@/components/layouts/navbar";
import "./globals.css";
import SessionProvider from "./SessionProvider";
import { GlobalProvider } from "@/context";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex">
        <SessionProvider>
          <GlobalProvider>
            <Navbar />
            <div>{children}</div>
          </GlobalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
