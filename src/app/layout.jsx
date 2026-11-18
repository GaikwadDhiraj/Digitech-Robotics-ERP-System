import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Digitech ERP System",
  description: "Enterprise Resource Planning - Digitech Robotics India Pvt. Ltd.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/favicon.png" />
        </head>
        <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
