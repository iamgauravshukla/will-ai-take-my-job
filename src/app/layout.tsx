import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Will AI Take My Job? | Personalized AI Career Risk Analysis",
  description:
    "Discover how artificial intelligence could impact your role. Get a personalized AI automation risk report and learn to future-proof your career in seconds.",
  keywords: [
    "AI automation",
    "job automation",
    "career risk",
    "AI impact",
    "future of work",
    "career planning",
    "skill development",
  ],
  openGraph: {
    title: "Will AI Take My Job? | AI Career Risk Analysis",
    description: "Get a personalized automation risk score for your role. Learn which tasks will be automated and future-proof your career.",
    url: "https://aitakejob.com",
    siteName: "Will AI Take My Job?",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Will AI Take My Job?",
    description: "Discover your automation risk and future-proof your career",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
