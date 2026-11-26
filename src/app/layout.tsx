import type { Metadata } from 'next';
import { Fira_Code, Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
      data-theme="obsidian-coral"
      data-font="jetbrains-mono"
      className={`${geistSans.variable} ${jetbrainsMono.variable} ${firaCode.variable} ${geistMono.variable} dark`}
    >
      <body className="st-ambient-bg min-h-screen bg-bg-primary text-text-primary selection:bg-accent-soft selection:text-text-primary">
        {children}
      </body>
    </html>
  );
}

