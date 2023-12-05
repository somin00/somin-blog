"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./ContactForm.module.css";
import Notification from "../ui/notification";

const initialFormValue = {
  email: "",
  name: "",
  message: "",
};

export default function ContactForm() {
  const [formValues, setFormValues] = useState(initialFormValue);
  const [requestStatus, setRequestStatus] = useState("");

  const inputInfo = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRequestStatus("pending");

    try {
      //post 요청 로직 추가 예정
      setRequestStatus("success");
      setFormValues(initialFormValue);
    } catch (e) {
      setRequestStatus("error");
    }
  };

  let notification;
  if (requestStatus === "pending") {
    notification = {
      status: "pending",
      title: "전송중",
      message: "메세지를 전송중입니다.",
    };
  }
  if (requestStatus === "success") {
    notification = {
      status: "success",
      title: "완료",
      message: "메세지 전송을 완료했습니다.",
    };
  }
  if (requestStatus === "error") {
    notification = {
      status: "error",
      title: "실패",
      message: "메세지 전송을 실패했습니다.",
    };
  }

  useEffect(() => {
    if (requestStatus === "success" || requestStatus === "error") {
      const timeoutId = setTimeout(() => {
        setRequestStatus("");
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [requestStatus]);

  return (
    <section className={styles.contact}>
      <h2>궁금한 것이 있다면 연락주세요🙂</h2>

      <form className={styles.form} onSubmit={sendMessage}>
        <div className={styles.controls}>
          <div className={styles.control}>
            <label htmlFor="email">이메일</label>
            <input type="email" id="email" value={formValues.email} required onChange={inputInfo}></input>
          </div>
          <div className={styles.control}>
            <label htmlFor="name">이름</label>
            <input type="text" id="name" value={formValues.name} required onChange={inputInfo}></input>
          </div>
        </div>
        <div className={styles.control}>
          <label htmlFor="message">내용</label>
          <textarea id="message" rows={5} value={formValues.message} required onChange={inputInfo}></textarea>
        </div>
        <div className={styles.actions}>
          <button>전송</button>
        </div>
      </form>
      {notification && (
        <Notification title={notification.title} message={notification.message} status={notification.status} />
      )}
    </section>
  );
}
