import Navbar from "@/components/layouts/navbar";
import "./globals.css";
import SessionProvider from "./SessionProvider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex">
        <SessionProvider>
          <Navbar />
          <div>{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
