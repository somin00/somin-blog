import { Posts } from "../../../../types";
import PostsContainer from "../Posts/PostsContainer";
import styles from "./AllPosts.module.css";

export default function AllPosts({ posts }: { posts: Posts }) {
  return (
    <section className={styles.posts}>
      <h2>모든 게시글</h2>
      <PostsContainer posts={posts} />
    </section>
  );
}
