import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adrian Villatoro | Software Developer",
  description:
    "Portfolio of Adrian Villatoro, a Virginia Tech computer science student building full-stack products, APIs, and data systems.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
