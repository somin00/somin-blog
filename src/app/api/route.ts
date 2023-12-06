import { NextResponse } from "next/server";
import { ContactContent } from "../../../types";
import connectDB from "../utils/database";

export const dynamic = "force-static";

export async function POST(request: Request) {
  const data = await request.json();
  const { email, name, message } = data;

  if (!email || !email.includes("@") || !name || name.trim() === "" || !message || message.trim() === "") {
    return new Response(null, {
      status: 422,
      statusText: "입력 값이 올바르지 않습니다.",
    });
  }

  const newMessage: ContactContent = {
    email,
    name,
    message,
  };

  try {
    const client = await connectDB();
    const db = client.db("blog");
    const result = await db.collection("messages").insertOne(newMessage);
    newMessage.id = result.insertedId.toString();
    client.close();
    return NextResponse.json({
      message: "문의 저장을 완료했습니다.",
      data: newMessage,
    });
  } catch (e) {
    return new Response(null, {
      status: 500,
      statusText: "문의 저장에 실패했습니다.",
    });
  }
}
