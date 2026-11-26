import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SpeedType — Clean, Distraction-Free Typing Practice',
  description:
    'Modern typing speed and accuracy practice platform. Start typing immediately with zero sign-up required.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="st-ambient-bg min-h-screen bg-bg-primary text-text-primary selection:bg-accent-soft selection:text-text-primary">
        {children}
      </body>
    </html>
  );
}

