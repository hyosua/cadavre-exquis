import type { Metadata } from "next";
import "./globals.css";
import { SocketManager } from "@/components/SocketManager";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Cadavre Exquis",
  description: "Le jeu d'écriture collaborative délirant !",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <SocketManager />
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
