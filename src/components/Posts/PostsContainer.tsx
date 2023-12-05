import { Posts } from "../../../types";
import PostItem from "./PostItem";
import styles from "./PostsContainer.module.css";

export default function PostsContainer({ posts }: { posts: Posts }) {
  return (
    <ul className={styles.grid}>
      {posts.map((post) => (
        <PostItem key={post.slug} post={post} />
      ))}
    </ul>
  );
}
