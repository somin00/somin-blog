import path from "path";
import matter, { GrayMatterFile } from "gray-matter";
import { Category, Post, Posts } from "../../../types";
import { readFile, readdir } from "fs/promises";

const postsDirectory = path.join(process.cwd(), "posts");

export const getPostData = async (fileName: string | string[]): Promise<Post> => {
  if (typeof fileName !== "string") throw new Error("게시글을 불러오지 못했습니다.");
  const postSlug = fileName.replace(/\.md$/, "");
  const filePath = path.join(postsDirectory, `${postSlug}.md`);
  const postData = await readFile(filePath, "utf-8");
  const { data, content }: GrayMatterFile<string> = matter(postData);

  const post: Post = {
    slug: postSlug,
    ...data,
    content,
  };

  return post;
};

export const getPostFiles = async (): Promise<string[]> => {
  return readdir(postsDirectory).then((postList) => postList);
};

export const getAllPost = async (): Promise<Posts> => {
  const postFiles: string[] = await getPostFiles();
  if (!postFiles) throw new Error("게시글 목록을 불러오지 못했습니다.");
  const allPost: Posts = await Promise.all(postFiles.map(async (postFile) => (await getPostData(postFile)) || {}));
  const sortedAllPost: Posts = allPost.sort((postA, postB) => (postA.date > postB.date ? -1 : 1));

  return sortedAllPost;
};

export const getRecentPosts = async (): Promise<Posts> => {
  const allPost: Posts = await getAllPost();
  const recentPosts: Posts = allPost.slice(0, 5);
  return recentPosts;
};

export const getCategory = async (): Promise<Category[]> => {
  const allPost: Posts = await getAllPost();
  const categorySet: Set<string> = new Set();
  allPost.forEach((post) => {
    if (post.category) {
      post.category.split(" ").map((category) => {
        categorySet.add(category);
      });
    }
  });
  const categories = [...categorySet].sort().map((category, idx) => ({ id: idx, category }));
  return [{ id: 100, category: "전체" }, ...categories];
};
