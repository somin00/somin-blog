import styles from "./PostHeader.module.css";

export default function PostHeader({ title, date }: { title: string; date: string }) {
  return (
    <header className={styles.header}>
      <h1>{title}</h1>
      <time>{date}</time>
    </header>
  );
}
