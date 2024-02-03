import { ALL_POSTS } from "@/app/costants";
import { Posts } from "../../../../types";
import PostItem from "./PostItem";
import styles from "./PostsContainer.module.css";

export default function PostsContainer({ posts, selectedCategory }: { posts: Posts; selectedCategory?: string }) {
  const filteredPosts = posts.filter((post) => post.category.includes(selectedCategory!));
  return (
    <ul className={styles.grid}>
      {selectedCategory === ALL_POSTS || !selectedCategory
        ? posts.map((post) => <PostItem key={post.slug} post={post} />)
        : filteredPosts.map((post) => <PostItem key={post.slug} post={post} />)}
    </ul>
  );
}
