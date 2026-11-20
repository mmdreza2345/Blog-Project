import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "B-lock | Developer Blog",
  description: "Read and publish developer articles on B-lock.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex-1 pt-5 bg-[#f7f9fc]">{children}</div>
      </body>
    </html>
  );
}
