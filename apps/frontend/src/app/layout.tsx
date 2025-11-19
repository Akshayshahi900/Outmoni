import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Outmoni",
  description: "Your Personal Finance Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <AuthSessionProvider>
        {children}</AuthSessionProvider>
      </body>
    </html>
  );
}
