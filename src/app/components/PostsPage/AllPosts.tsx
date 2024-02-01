"use client";
import { SyntheticEvent, useState } from "react";
import { Category, Posts } from "../../../../types";
import PostsContainer from "../Posts/PostsContainer";
import styles from "./AllPosts.module.css";
import CategoryList from "./Category";

export default function AllPosts({ posts, categories }: { posts: Posts; categories: Category[] }) {
  const [selectedCategory, setSelectedCategory] = useState("");

  const selectCategory = (e: SyntheticEvent) => {
    setSelectedCategory((e.target as HTMLSelectElement).value);
  };
  return (
    <section className={styles.posts}>
      <h2>모든 게시글</h2>
      <CategoryList categories={categories} onChange={selectCategory} />
      <PostsContainer posts={posts} selectedCategory={selectedCategory} />
    </section>
  );
}
