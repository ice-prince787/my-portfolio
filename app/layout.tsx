import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dipankar.dev",
  description: "Mid-level full-stack developer building fast, beautiful web apps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/*
          CSS zoom scales the entire page relative to 1920px base.
          Unlike transform:scale, zoom:
            - Does NOT break position:fixed (sidebar stays fixed)
            - Does NOT break BSOD/modal overlays
            - Affects layout flow so scrollbar is automatically correct
            - Supported in all modern browsers (Chrome, Edge, Safari, Firefox 126+)
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const BASE = 1920;
                function applyZoom() {
                  var zoom = window.innerWidth / BASE;
                  // Clamp: never zoom above 100% (no upscaling on large screens)
                  zoom = Math.min(zoom, 1);
                  document.body.style.zoom = zoom;
                }
                applyZoom();
                window.addEventListener('resize', applyZoom);
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}