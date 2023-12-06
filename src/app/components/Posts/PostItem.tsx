import Link from "next/link";
import styles from "./PostItem.module.css";
import { Post } from "../../../../types";

export default function PostItem({ post }: { post: Post }) {
  const { title, description, date, slug } = post;
  const linkPath = `/posts/${slug}`;
  return (
    <li className={styles.post}>
      <Link href={linkPath}>
        <div className={styles.content}>
          <h3>{title}</h3>
          <p>{description}</p>
          <time>{date}</time>
        </div>
      </Link>
    </li>
  );
}
