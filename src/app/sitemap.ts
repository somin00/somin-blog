import { MetadataRoute } from "next";
import { getAllPost } from "./utils/post";
import { Posts } from "../../types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts: Posts = await getAllPost();
  const posts = allPosts.map((post) => ({
    url: `https://somin-blog.vercel.app/post/${post.slug}`,
    lastModified: post.date,
  }));

  return [
    {
      url: "https://somin-blog.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://somin-blog.vercel.app/contact",
      lastModified: new Date(),
    },
    ...posts,
  ];
}
