import type { Metadata } from "next";
import AboutMe from "@/components/HomePage/AboutMe";
import RecentPosts from "@/components/HomePage/RecentPosts";
import { getRecentPosts } from "../../utils/post";

export const metadata: Metadata = {
  title: "오소민 블로그",
  description: "오소민에 대한 소개, 최근 작성한 게시글을 확인할 수 있습니다.",
};

export default async function Home() {
  const recentPosts = await getRecentPosts();
  return (
    <>
      <AboutMe />
      <RecentPosts posts={recentPosts} />
    </>
  );
}
