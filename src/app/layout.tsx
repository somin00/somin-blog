import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Layouts/Navigation";
import Footer from "@/components/Layouts/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "오소민 블로그",
  description: "프론트엔드 개발 학습 내용을 기록하는 개인 개발 블로그입니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
        <div id="notifications"></div>
      </body>
    </html>
  );
}
