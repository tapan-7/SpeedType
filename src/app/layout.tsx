import type { Metadata } from 'next';
import {
  Fira_Code,
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  Inconsolata,
  JetBrains_Mono,
  Roboto_Mono,
  Space_Mono,
} from 'next/font/google';
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

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  weight: ['400', '700'],
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

const inconsolata = Inconsolata({
  variable: '--font-inconsolata',
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
      className={`${geistSans.variable} ${jetbrainsMono.variable} ${firaCode.variable} ${geistMono.variable} ${ibmPlexMono.variable} ${spaceMono.variable} ${robotoMono.variable} ${inconsolata.variable} dark`}
    >
      <body className="st-ambient-bg min-h-screen bg-bg-primary text-text-primary selection:bg-accent-soft selection:text-text-primary">
        {children}
      </body>
    </html>
  );
}

