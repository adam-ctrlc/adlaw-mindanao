import { Geist, Geist_Mono } from "next/font/google";
import ApolloWrapper from "@/components/apollo-provider";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bai, Init Ba Karon? Tan-awa Ang Panahon",
  description:
    "Check kung mo-ulan ba o init kaayo sa inyong lugar. Real-time weather updates across Mindanao para di ka mabiktima sa panahon.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
