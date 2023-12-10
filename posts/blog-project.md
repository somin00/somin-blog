---
title: "Next.js 14버전으로 블로그 만들기 2"
date: "2023-12-10"
description: "Next.js 14버전으로 블로그를 만들며 학습한 내용과 겪은 어려움"
---

지난 포스트는 Next.js 13이후 버전에서 변경된 부분들을 정리했다. 이번 포스트는 블로그를 13이후 버전으로 변경하면서 수정한 코드와 겪은 어려움에 대해 작성해 보았다.

### 버전 수정으로 인한 변경

- pages 라우팅 방식에서 app 라우팅으로 변경
- metadata 작성 방식 변경  
  &nbsp;

아래는 버전 수정이 아닌 옮기는 과정에서 수정이 필요한 것 같아 수정한 부분이다.

### 1. 글 내용 불러오는 방식 동기식 처리 -> 비동기식 처리

이전에는 readFileSync, readdirSync 메서드를 사용해서 글 목록과 내용을 불러올 때 동기로 처리하도록 구현했다. 처음 블로그를 만들 때에는 fs 모듈에 어떤 메서드가 있는지 잘 몰랐기 때문에 강의를 보며 작성했던 것이다. 버전 수정을 하면서 여러 블로그를 참고해 보고 비동기 처리 메서드가 있다는 것을 알고 자원을 더 효율적으로 사용할 수 있을 것 같아 수정했다.

- 동기식 처리 코드

```ts
import fs from "fs";

export const getPostData = (...): => {
  ...
  const postData = fs.readFileSync(filePath, "utf-8"); // 데이퍼 파싱 중 추가 루프 실행 중지됨
  ...
};
```

- 비동기식 처리 코드

```ts
import { readFile} from "fs/promises";

export const getPostData = async (...) => {
  ...
  const postData = await readFile(filePath, "utf-8");
  ...
};
```

&nbsp;

### 2. 문의 내용 저장 방식

contact 페이지에서 문의를 작성하고 작성 버튼을 누르면 문의가 데이터베이스에 저장된다.
기존에는 pages/api/contact.ts 에 api route를 생성하여 구현했다.

```ts
export default async function postHandler(req: NextApiRequest, res: NextApiResponse) {}
```

이렇게 api route를 생성하고 컴포넌트에서 fetch 요청을 보내 응답을 받는 형식이었다.  
&nbsp;

13이후 버전에서는 server actions를 지원하여 굳이 route를 만들지 않고 구현하는 방식으로 수정했다.
server actions를 사용하면 서버 컴포넌트나 클라이언트 컴포넌트 내에서 데이터를 fetch 하는 코드를 작성, 호출할 수 있다.

```ts
"use server";

export async function sendMessageApi(formData: ContactContent) {}
```

```ts
const data = await sendMessageApi(formValues);
```

서버와 통신하는 코드를 작성할 함수에 "use server"를 명시하고 데이터를 페칭할 컴포넌트 파일에서 함수를 사용하면 된다. 이렇게 하면 컴포넌트 내에서 서버와 통신하는 로직을 구현할 수 있다.  
&nbsp;

### 3. 검색 엔진 최적화

지금까지 프로젝트를 진행하고 lighthouse 검사를 돌리면 접근성에 대한 보완은 자주 해봤지만 검색 엔진 최적화는 뭔가 어려운 느낌이라 나중에 해봐야지 생각만 하다가 드디어 해봤다😅 사실 metadata와 서버 사이트 렌더링만으로도 검색 엔진 최적화가 거의 될 거라고 생각했다. 배포 후에 lighthouse 검사를 해봤더니 89점이 나왔다. Next.js를 사용하는 큰 이유 중 하나가 검색 엔진 최적화도 있기 때문에 잘은 모르지만 100점을 만들어 보고자 도전했다!

![검색엔진 최적화 전 {820x370}](https://github.com/somin00/somin-blog/assets/61578822/f8c97fc1-aeb3-42db-8b2c-3cd8b9c459d5)

페이지 색인 생성이 차단됨. 문제를 그대로 구글에 검색해 보니 robots.txt, sitemap.xml 파일이 필요한 것 같았다. 리액트에 기본적으로 있어서 본 적은 있지만 직접 수정해 본 적이 없어서 낯선 파일들이다.. 열심히 공식 문서와 블로그를 찾아가며 작성해 봤다.  
&nbsp;

**동적 robots.txt**  
robots.txt는 검색 엔진 크롤러가 액세스하거나 정보 수집이 가능한 페이지인지 불가능한 페이지인지 알려주는 역할을 하는 파일이다.

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://somin-blog.vercel.app/sitemap.xml",
    host: "https://somin-blog.vercel.app",
  };
}
```

&nbsp;

**동적 sitemap.xml**  
sitemap.xml은 웹사이트 내 모든 페이지의 목록을 나열한 파일이다. 이 파일을 제출하면 크롤링 과정에서 발견되지 않는 페이지도 크롤링 되고 색인될 수 있게 한다.

```ts
import { MetadataRoute } from "next";
import { getAllPost } from "./utils/post";
import { Posts } from "../../types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts: Posts = await getAllPost();
  const posts = allPosts.map((post) => ({
    url: `https://somin-blog.vercel.app/post/${post.slug}`,
    lastModified: post.date,
  }));

  return [
    {
      url: "https://somin-blog.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://somin-blog.vercel.app/contact",
      lastModified: new Date(),
    },
    ...posts,
  ];
}
```

&nbsp;

robots.txt, sitemap.xml 생성 후 lighthouse 검사 기준 100을 만들었다.
![검색 엔진 최적화 후 {474x302}](https://github.com/somin00/somin-blog/assets/61578822/d5d08c3f-b5ef-49a4-92c9-805463ade58b)  
&nbsp;

아직 검색 엔진 최적화를 위한 모든 과정을 알진 못하지만 앞으로 더 공부하고 프로젝트를 만드는 데에서 그치지 않고 많은 사람들이 접근할 수 있는 서비스를 만들어야겠다!😆
