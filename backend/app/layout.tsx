import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Family Chores API',
  description: 'API for managing family chores',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
