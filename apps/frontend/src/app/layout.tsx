import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/SessionProvider";
import { ThemeRegistry } from "./theme-registry";
import "@/styles/theme.css";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Outmoni",
  description: "Your Personal Finance Tracker",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ⬅️ cookies() is async now
  const cookieStore = await cookies();
  const storedTheme = cookieStore.get("theme")?.value ?? "light";
  const initialTheme = storedTheme === "dark" ? "dark" : "light";

  return (
    <html lang="en" data-theme={initialTheme}>
      <body className="antialiased bg-app text-app">
        <ThemeRegistry initialTheme={initialTheme}>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
