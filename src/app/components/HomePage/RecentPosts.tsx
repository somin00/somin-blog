import Link from "next/link";
import { Posts } from "../../../../types";
import PostsContainer from "../Posts/PostsContainer";
import styles from "./RecentPosts.module.css";

export default function RecentPosts({ posts }: { posts: Posts }) {
  return (
    <section className={styles.latest}>
      <h2>최근 게시글</h2>
      <PostsContainer posts={posts} />
      <Link href="/posts" className={styles.link}>
        전체 게시글 보기
      </Link>
    </section>
  );
}
