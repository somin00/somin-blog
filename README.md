# Next.js로 만든 개발 블로그

[✨SOMIN BLOG 보러가기✨](https://somin-blog.vercel.app/)

Next.js 학습용 프로젝트입니다. 프론트엔드와 개발에 대한 전반적인 학습 내용을 정리하는 개인 블로그입니다.

&nbsp;

## 사용 기술

<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white"/> <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white"/> <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white"/>

&nbsp;

## 🍀ABOUT BLOG

**메인페이지**  
개인 소개 및 최근 작성한 게시물 5개를 보여줍니다. 하단 링크를 통해 게시글 목록 페이지로 이동할 수 있습니다.
![메인페이지](https://github.com/somin00/somin-blog/assets/61578822/0fc67807-9108-4f30-8a2c-fd305c3a0716)
&nbsp;

**Posts 게시물 페이지**  
작성한 모든 게시물 목록을 보여줍니다. 카테고리 선택이 가능합니다. 
![게시글 목록 페이지](https://github.com/somin00/somin-blog/assets/61578822/834dd80d-6566-4ca9-9550-9ba1386bd4ee)
&nbsp;

**Contact 문의 페이지**  
블로그 개발에 대해 궁금한 점 또는 조언 등 자유롭게 글을 작성할 수 있는 페이지입니다.
<img width="1440" alt="문의페이지" src="https://github.com/somin00/next-blog/assets/61578822/758c489e-45de-4232-9234-9ab899f6f730">  
&nbsp;

&nbsp;

## 👩🏻‍💻구현방법

### **게시물 관련 기능**

**1. 글 작성 및 게시 기능**

vscode에서 md파일로 작성하면 파일시스템 모듈을 사용해 게시하는 방식으로 구현했습니다. 개인 블로그이기 때문에 글 작성하는 기능은 구현하지 않았습니다.

[코드 보기](https://github.com/somin00/somin-blog/blob/main/src/app/utils/post.ts)

&nbsp;

마크다운으로 작성한 내용을 파싱하기 위해 `react-markdown`
`react-syntax-highlighter` 를 사용했습니다.

[코드 보기](https://github.com/somin00/somin-blog/blob/main/src/app/components/Posts/PostDetail/PostContent.tsx)

&nbsp;

**2. 카테고리 선택 기능**  

파일시스템 모듈로 가져온 게시글 category 정보를 사용했습니다. 카테고리 목록은 중복을 없애고 게시글 목록을 렌더링 할 때 카테고리에 해당하는 게시글을 렌더링 하도록 구현했습니다. 각 게시글은 여러 카테고리를 가질 수 있으며 해당하는 모든 카테고리 목록에 보여집니다.  

[코드 보기](https://github.com/somin00/somin-blog/blob/main/src/app/utils/post.ts)

&nbsp;

**👍🏻배운 점**

import시 용량이 큰 패키지는 사용하려는 것만 import하는 것이 코드 양을 줄이는데 도움이 된다는 것을 알게되었습니다.

[패키지 import 및 사용 방법 수정]

<img width="1353" alt="package import" src="https://github.com/somin00/next-blog/assets/61578822/38f76ef2-3a94-4c7b-9fd4-e10bcd69e634">

[수정 전 빌드 결과]

![first bulld](https://github.com/somin00/next-blog/assets/61578822/faf6361e-7074-4b8b-968c-588e6909c313)

[수정 후 빌드 결과]

<img width="568" alt="third build" src="https://github.com/somin00/next-blog/assets/61578822/1b9f88a9-99af-463d-b865-35f9eeda166f">

posts/[slug] 파일의 빌드 결과를 보면 코드의 양이 많이 줄었음을 알 수 있습니다.

&nbsp;

**🥲아쉬운 점**

md 파일 파싱할 때 이미지의 크기를 동적으로 설정하고 싶었지만 이미지 사이즈를 추출하는 방식을 찾지 못했습니다. md 파일 alt 속성에 이미지 사이즈를 작성하면 정규표현식을 이용하여 추출한 다음 Image width, height로 설정하는 방식으로 구현했습니다. 이미지를 보기 좋게 렌더링 하기 위해서는 사이즈를 알아야 한다는 점이 아쉽습니다.

&nbsp;

### **문의 관련 기능**

**1. 글 작성 기능**

MongoDB를 사용하여 문의 내용 저장 기능을 구현했습니다.

[코드 보기](https://github.com/somin00/somin-blog/blob/main/src/app/utils/action.ts)

[데이터베이스에 저장된 데이터]

<img width="847" alt="문의" src="https://github.com/somin00/next-blog/assets/61578822/4b9f2075-2806-4994-9bf1-0864e1d50585">
