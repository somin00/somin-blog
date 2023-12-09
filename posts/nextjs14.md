---
title: "Next.js 14버전으로 블로그 만들기 1"
date: "2023-12-08"
description: "Next.js 14버전으로 블로그를 만들며 학습한 내용과 겪은 어려움"
---

Next.js를 공부하기 위해 예전에 듣던 강의를 다시 들어서 13이전 버전으로 블로그를 만들었었다. Next의 특징을 잘 몰랐기 때문에 직접 사용할 생각보다는 공부용으로 만들었다. 그런데 이미 13이후 버전이 나오면서 라우팅 방식, 서버 사이드 렌더링 방식 등등.. 많은 것이 달라졌다..😱 이제 Next 기초라도 확실히 알았다고 생각했는데 바로 아무것도 모르는 사람이 되어버린 것이다...🥲 하지만 바뀌면 뭐 어떠냐!! 바로 다시 공부하면 되다!! 마인드로 공부 시작👊🏻 강의만 듣고 기초만 공부하기엔 지루할 거 같아서 블로그를 정말 내가 사용할 블로그로 만들어 보자는 생각으로 최신 버전으로 업그레이드하기로 마음먹었다👏🏻 그 과정에서 겪은 어려움과 알게 된 내용을 정리해 보았다.  
&nbsp;

### 1. 라우팅 방식

기존 pages 라우팅에서 app 라우팅으로 바뀌었다. pages/ 디렉토리에서 설정하던 라우팅을 app/ 디렉토리에서 설정하면 된다.

**pages 라우팅 방식**

![page routing 파일구조 {570 x558}](https://github.com/somin00/somin-blog/assets/61578822/3b7c8986-eadf-4d55-b046-c52ec4c106fc)  
&nbsp;

**app 라우팅 방식**

![app라우팅 파일구조 {227x310}](https://github.com/somin00/somin-blog/assets/61578822/90270f37-3513-4fe3-afce-d5f4e93eb02e)  
&nbsp;

- Layout : 기본 레이아웃을 정의할 수 있다. 공통 레이아웃을 children을 감싸는 현태로 제공한다. 폴더 경로에서 사용하며 기존의 \_app.tsx, \_document.tsx 파일의 역할을 한다.
- page.확장자 : pages 라우팅에서 index.확장자로 사용하던 파일의 이름을 page.확장자로 작성해야 한다.  
  &nbsp;

### 2. 서버 사이드 렌더링

12버전에서는 getServerSideProps, getStaticProps, getStaticPaths 등 서버 사이드 렌더링을 위함 함수를 작성해야 했다. 13버전에서는 기본적으로 모든 컴포넌트가 서버 사이드 컴포넌트이다. fetch에 옵션을 줘서 static으로 동작하게 할 수 있다. useState, useEffect는 클라이언트 사이드 컴포넌트에서 사용해야 하기 때문에 'use client'를 사용한다.

```tsx
"use client";
import { useState } from "react";

export default function ContactForm() {
  const [formValues, setFormValues] = useState(initialFormValue);

  return <section>...</section>;
}
```

프로젝트에서 사용하지는 않았지만 fetch에 옵션을 주어 static처럼 동작하게 할 수 있다.

```tsx
//getStaticProps처럼 동작
//force-cache가 기본이다.
fetch(url, { cache: "force-cache" });

//getServerSideProps처럼 동작
fetch(url, { cache: "no-store" });

//getStaticProps
//임의로 10초 지정
fetch(url, { next: { revalidate: 100 } });
```

&nbsp;

### 3. 메타데이터 추가

12버전에는 컴포넌트에서 반환하는 jsx 파일에서 Head 태그를 이용하여 작성했다. 13버전은 metadata라는 이름의 객체를 export 하는 방법으로 작성한다.  
&nbsp;

**12버전 메타데이터**  
postDetail 페이지로 동적 라우팅을 사용한 페이지의 메타데이터 설정 방법이다.

```tsx
return (
  <>
    <Head>
      <title>{postData.title}</title>
      <meta name="description" content={postData.description} />
    </Head>
    ...
  </>
);
```

&nbsp;

**13버전 메타데이터**

- 정적 메타데이터 설정 방법

  ```tsx
  export const metadata: Metadata = {
    title: "오소민 블로그",
    description: "오소민에 대한 소개, 최근 작성한 게시글을 확인할 수 있습니다.",
  };
  ```

&nbsp;

- 동적 메타데이터 설정 방법

  ```tsx
  export const generateMetadata = async ({ params: { slug } }: Props): Promise<Metadata> => {
    const postData = await getPostData(slug);

    return {
      title: postData.title,
      description: postData.description,
    };
  };
  ```

  동적 메타데이터는 generateMetadata 함수를 이용한다.  
  &nbsp;

다음 포스트에는 프로젝트를 진행하며 경험한 어려움을 정리해야겠다.🙂
