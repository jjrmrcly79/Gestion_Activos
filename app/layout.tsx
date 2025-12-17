import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from './components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ISO 55000 Asset Management',
  description: 'Enterprise Asset Management System aligned with IAM and ISO 55000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen bg-[hsl(var(--background))] overflow-hidden`}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[hsl(var(--background))] to-transparent pointer-events-none z-10" />
          <div className="relative z-0 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
