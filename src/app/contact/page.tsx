import { Metadata } from "next";
import ContactForm from "../components/ContactPage/ContactForm";

export const metadata: Metadata = {
  title: "문의 페이지",
  description: "오소민 또는 블로그에 궁금한 사항을 남겨주세요.",
};

export default function ContactPage() {
  return <ContactForm />;
}
