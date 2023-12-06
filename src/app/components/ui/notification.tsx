import { createPortal } from "react-dom";

import styles from "./notification.module.css";

export type NotificationType = {
  title: string;
  message: string;
  status: string;
};

function Notification({ title, message, status }: NotificationType) {
  let statusStyles = "";

  if (status === "success") {
    statusStyles = styles.success;
  }

  if (status === "error") {
    statusStyles = styles.error;
  }

  const cssStyles = `${styles.notification} ${statusStyles}`;
  const notificationArea = document.getElementById("notifications")!;
  return createPortal(
    <div className={cssStyles}>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>,
    notificationArea
  );
}

export default Notification;
