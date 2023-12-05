"use client";
import styles from "./PostContent.module.css";
import PostHeader from "./PostHeader";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import atomDark from "react-syntax-highlighter/dist/cjs/styles/prism/atom-dark";
import js from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import ts from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import { Post } from "../../../../types";

SyntaxHighlighter.registerLanguage("js", js);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("ts", ts);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("css", css);

export default function PostContent({ postData }: { postData: Post }) {
  const { title, content, date } = postData;

  return (
    <article className={styles.content}>
      <PostHeader title={title} date={date} />
      <ReactMarkdown
        components={{
          code({ className, children }) {
            const language = className!.split("-")[1];

            return (
              <SyntaxHighlighter style={atomDark} language={language}>
                {String(children)}
              </SyntaxHighlighter>
            );
          },
          img: (image) => {
            if (!image.alt) {
              return (
                <>
                  <Image src={image.src || ""} alt={image.alt || ""} width={500} height={300} priority />
                  <br />
                </>
              );
            }
            const size = image.alt.match(/\{(\d+)x(\d+)\}/);
            const width = size ? Number(size[1]) : 500;
            const height = size ? Number(size[2]) : 300;

            return (
              <>
                <Image src={image.src || ""} alt={image.alt || ""} width={width} height={height} priority />
                <br />
              </>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
