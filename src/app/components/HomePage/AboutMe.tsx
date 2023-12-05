import styles from "./AboutMe.module.css";

export default function AboutMe() {
  return (
    <section className={styles.about}>
      <h2>오소민</h2>
      <p>
        안녕하세요, 웹 프론트엔드 개발자 오소민입니다.
        <br />더 나은 개발자가 되기 위한 노력을 기록합니다.
      </p>
    </section>
  );
}
