import type { Metadata } from "next";
import Provider from "./provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Blog Platform",
  description: "Made by Ughur Hasan",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-inter"> 
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
