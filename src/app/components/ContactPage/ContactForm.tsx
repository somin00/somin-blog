"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./ContactForm.module.css";
import Notification, { NotificationType } from "../ui/notification";
import { ERROR_NOTIFICATION, PENDING_NOTIFICATION, SUCCESS_NOTIFICATION } from "@/app/costants";
import { ContactContent } from "../../../../types";

const initialFormValue = {
  email: "",
  name: "",
  message: "",
};

const initialNotification = {
  status: "",
  title: "",
  message: "",
};

async function sendContact(formValues: ContactContent) {
  const response = await fetch("/api", {
    method: "POST",
    body: JSON.stringify(formValues),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error("데이터 저장에 실패했습니다.");
  }

  return data;
}

export default function ContactForm() {
  const [formValues, setFormValues] = useState(initialFormValue);
  const [notification, setNotification] = useState<NotificationType>(initialNotification);

  const inputInfo = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotification(PENDING_NOTIFICATION);

    try {
      const data = await sendContact(formValues);
      if (!data) return;
      setNotification(SUCCESS_NOTIFICATION);
      setFormValues(initialFormValue);
    } catch (e) {
      setNotification(ERROR_NOTIFICATION);
    }
  };

  useEffect(() => {
    if (notification.status === "success" || notification.status === "error") {
      const timeoutId = setTimeout(() => {
        setNotification(initialNotification);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [notification]);

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
      {notification.status && (
        <Notification title={notification.title} message={notification.message} status={notification.status} />
      )}
    </section>
  );
}
