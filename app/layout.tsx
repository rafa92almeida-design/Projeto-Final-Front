import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Digital Store - Drip Store',
  description: 'Sua loja online oficial de tênis, sneakers e moda urbana exclusiva.',
  openGraph: {
    title: 'Digital Store - Drip Store',
    description: 'Sua loja online oficial de tênis, sneakers e moda urbana exclusiva.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Store - Drip Store',
    description: 'Sua loja online oficial de tênis, sneakers e moda urbana exclusiva.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        suppressHydrationWarning
        className={`${plusJakartaSans.className} min-h-screen bg-[#F8F8F8] text-[#474747] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
