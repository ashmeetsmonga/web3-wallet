import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RecoilProvider from "@/providers/RecoilProvider";
import { Card } from "@/components/ui/card";
import ToasterProvider from "@/providers/ToasterProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={`bg-gray-100 ${inter.className}`}>
        <RecoilProvider>
          <ToasterProvider />
          <div className="w-screen h-screen flex flex-col items-center gap-10 p-20">
            <h1 className="text-8xl font-black text-center">Wallet Manager</h1>
            <Card className="w-[500px] h-4/5 shadow-2xl bg-gray-100">{children}</Card>
          </div>
        </RecoilProvider>
      </body>
    </html>
  );
}
