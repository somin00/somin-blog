import { Metadata } from "next";
import AllPosts from "../components/PostsPage/AllPosts";
import { getAllPost } from "../utils/post";

export const metadata: Metadata = {
  title: "전체 게시글",
  description: "전체 게시글 목록입니다.",
};

export default async function AllPostPage() {
  const allPost = await getAllPost();
  return <AllPosts posts={allPost} />;
}
