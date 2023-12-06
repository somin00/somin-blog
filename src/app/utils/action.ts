"use server";
import { ContactContent } from "../../../types";
import connectDB from "./database";

export async function sendMessageApi(formData: ContactContent) {
  const { email, name, message } = formData;

  if (!email || !email.includes("@") || !name || name.trim() === "" || !message || message.trim() === "") {
    throw new Error("입력 형식이 맞지 않습니다.");
  }

  const newMessage: ContactContent = {
    email,
    name,
    message,
  };

  const client = await connectDB();
  const db = client.db("blog");
  const result = await db.collection("messages").insertOne(newMessage);

  if (!result) throw new Error("문의를 저장하지 못했습니다.");

  client.close();

  return {
    message: "문의 저장을 완료했습니다.",
  };
}
