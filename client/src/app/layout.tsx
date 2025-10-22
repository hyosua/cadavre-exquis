import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cadavre Exquis',
  description: 'Le jeu d\'écriture collaborative délirant !',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-theme="sunset">
      <body>{children}</body>
    </html>
  );
}