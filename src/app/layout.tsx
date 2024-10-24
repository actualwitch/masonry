import StyledComponentsRegistry from "@/registry";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masonry",
  description: "Building the wall",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
