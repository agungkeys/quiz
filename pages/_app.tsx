import "@/styles/globals.css";
import { Outfit as FontSans } from "next/font/google"
import type { AppProps } from "next/app";
import { cn } from "@/lib/utils";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}
    >
      <Component {...pageProps} />
    </main>
  );
}
