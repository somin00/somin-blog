import Link from "next/link";
import styles from "./Footer.module.css";
import { FaGithubSquare } from "react-icons/fa";

function Footer() {
  return (
    <footer className={styles.footer}>
      <Link href="https://github.com/somin00" aria-label="오소민 깃허브 링크">
        <FaGithubSquare className={styles.github} />
      </Link>
      <span>오소민&nbsp;&middot;&nbsp;&copy;2023 </span>
    </footer>
  );
}

export default Footer;
