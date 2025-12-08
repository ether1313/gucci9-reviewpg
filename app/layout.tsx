import type { Metadata } from "next";
import "./globals.css";
import FloatingIcon from "../components/FloatingIcon";

export const metadata: Metadata = {
  title:
    "Gucci9 Reviews Australia | Trusted Casino Wallet & Gaming Platform Feedback",
  description:
    "Read authentic Gucci9 reviews from Australian players. Discover how Gucci9 helps users enjoy smooth, secure, and trusted online gaming experiences. Transparent feedback, trusted ratings, and real user experiences from across Australia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        {/* Inter Font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        className="antialiased relative"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >

        {/* BACKGROUND IMAGE — DESKTOP + MOBILE */}
        <div
          className="
            fixed top-0 left-0 w-full h-full bg-cover bg-center z-[-2]
            hidden lg:block
          "
          style={{ backgroundImage: "url('/desktop.png')" }}
        />

        <div
          className="
            fixed top-0 left-0 w-full h-full bg-cover bg-center z-[-2]
            lg:hidden
          "
          style={{ backgroundImage: "url('/mobile.png')" }}
        />

        {/* OVERLAY */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[-1]" />

        {/* 页面内容层 */}
        <div className="relative z-[5]">
          {children}
        </div>

        {/* 浮动图标 */}
        <FloatingIcon />

      </body>
    </html>
  );
}
