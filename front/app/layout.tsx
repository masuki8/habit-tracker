import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import { Toast } from "@/components/toast";

const zenKakuGothic = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku-gothic",
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Habit Tracker",
    template: "%s | Habit Tracker",
  },
  description: "小さな習慣を積み重ねる習慣トラッカー",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${zenKakuGothic.variable} h-full antialiased`}>
      <body className="flex h-screen flex-col">
        <Toast />
        {children}
      </body>
    </html>
  );
}
