import Navbar from "@/components/layouts/navbar";
import "./globals.css";
import SessionProvider from "./SessionProvider";
import { GlobalProvider } from "@/context";
import { Exo_2 } from "next/font/google";

const exo_2 = Exo_2({ subsets: ["latin"] });
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`h-[100vh] overflow-hidden flex ${exo_2.className}`}>
        <SessionProvider>
          <GlobalProvider>
            <Navbar />
            <div className="w-full px-[16px] lg:px-[64px] overflow-y-auto h-full">
              {children}
            </div>
          </GlobalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
