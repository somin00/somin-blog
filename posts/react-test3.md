---
title: "따라하며 배우는 리액트 테스트 강의 section4 (1)"
date: "2024-02-19"
description: "여행 상품 판매 앱 만들며 TDD 학습하기"
category: "리액트 테스트"
---

### Eslint 설정

코드 형식이나 문법을 제대로 사용하고 있는지 확인하기 위해 사용한다. (주로 문법 오류를 잡기 위해 사용) 테스트 코드에서는 matcher를 제대로 사용하고 있는지 확인할 수 있다.

\*code formatter 역할을 prettier가 주로 한다.

1. vscode ESLint 익스텐션 설치
2. 설정 파일 생성 .eslintrc.json
3. eslint testing 플러그인 설치

   ```bash
   npm i -D eslint-plugin-testing-library eslint-plugin-jest-dom
   ```

   testing-library: render로 DOM을 그린다.

   jest-dom: expect-matcher 테스트

   **플러그인이란?** 기본적으로 제공하지 않는 규칙을 사용할 수 있게 해준다. 예를 들어, react와 관련된 설정을 위해 eslint-plugin-react를 사용할 수 있다.

4. 설정 파일

   ```json
   {
     "plugins": ["testing-library", "jest-dom"],
     "extends": ["react-app", "react-app/jest", "plugin:testing-library/react", "plugin:jest-dom/recommended"]
   }
   ```

   plugins: 설치한 플러그인 작성

   extends: 플러그인 설치 후 규칙을 정해야 사용할 수 있다.

&nbsp;

### Prettier 설정

방법1. npm으로 설치

여러 개발자와 같은 포맷을 공유할 수 있다.  
&nbsp;

방법2. vscode 익스텐션 설치 → ⭐️선택

혼자 개발할 때 편리하다.  
&nbsp;

개인 학습용이고, 이미 익스텐션을 설치해놨기 때문에 2번으로 결정했다.  
&nbsp;

### 프로젝트 전체 구조

```bash
📦client
┣ 📂 pages
┃ ┣ 📂 OrderPage
┃ ┃ ┣ 📂 OrderPge
┃ ┃ ┣ 📂 test 폴더
┃ ┣ 📂 SummaryPage 
┃ ┃ ┣ 📂 SummaryPage
┃ ┃ ┣ 📂 test 폴더
┃ ┣ 📂 CompletePage
┃ ┃ ┣ 📂 CompletePage
┃ ┃ ┣ 📂 test 폴더
```

&nbsp;

### Summary 페이지 Form

test code

- 주문 확인 체크 박스를 눌러야만 주문 확인 버튼을 누를 수 있다.

  ```jsx
  import { render, screen } from "@testing-library/react";
  import SummaryPage from "../SummaryPage";

  test("주문 확인 체크 박스를 눌러야만 주문 확인 버튼을 누를 수 있다.", () => {
    render(<SummaryPage />);

    const checkBoxElement = screen.getByRole("checkbox", {
      name: "주문 내역을 확인하셨나요?",
    });

    expect(checkBoxElement.checked).toEqual(false);

    const confirmBox = screen.getByRole("button", {
      name: "주문 확인",
    });

    expect(confirmBox.disabled).toBeTruthy();
  });
  ```

  ```tsx
  import React, { useState } from "react";

  export const SummaryPage = () => {
    const [checked, setChecked] = useState(false);
    return (
      <div>
        <div>주문 내역</div>
        <form>
          <label>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
              }}
            />
            주문 내역을 확인하셨나요?
          </label>
          <button type="submit" disabled={!checked}>
            주문 확인
          </button>
        </form>
      </div>
    );
  };
  ```

  &nbsp;

### Mock Service Worker

서버에서 데이터 가져오는 기능 테스트를 위해 서버에 요청을 보낼 때 요청을 가로채서 처리하고 응답을 보내주는 역할을 한다. 브라우저에 서비스 워커를 등록하는 방식과 서비스 워커 서버를 생성하는 방식이 있다. Jest 테스트 환경을 위해서 두번째 방법으로 진행했다.

**MSW 사용하기**

1. 설치

   ```bash
   npm install msw
   ```

2. 핸들러 생성

   상품 핸들러, 옵션 핸들러

   ```tsx
   // src/mocks/handler.ts
   export const handlers = [
     //여행 상품 정보
     http.get("http://localhost:5000/products", () => {
       return HttpResponse.json([
         {
           name: "America",
           imagePath: "/images/america.jpeg",
         },
         {
           name: "England",
           imagePath: "/images/england.jpeg",
         },
       ]);
     }),

     //옵션 정보
     http.get("http://localhost:5000/options", () => {
       return HttpResponse.json([
         {
           name: "Insurance",
         },
         {
           name: "Dinner",
         },
       ]);
     }),
   ];
   ```

3. 서버 생성

   ```tsx
   // src/mocks/server.ts
   import { setupServer } from "msw/node";
   import { handlers } from "./handlers";

   export const server = setupServer(...handlers);
   ```

4. API Mocking 설정

   ```tsx
   //setupTests.ts
   import { server } from "./mocks/server";

   beforeAll(() => server.listen());

   afterEach(() => server.resetHandlers());

   afterAll(() => server.close());
   ```

   &nbsp;

### 마무리

원래 목표는 테스트 코드도 타입스크립트로 작성하는 것이었다. 아직 테스트 코드 작성 방법도 모르는데 타입을 지정하는 방법까지 혼자 익히기가 너무 어려웠다.. 당장 테스트 코드 작성 방법을 파악하는 것이 학습 목표이기 때문에 타입스크립트 도입은 추후에 더 공부하고 도전해야겠다..🥲 프로젝트를 위한 기본적인 설정 내용을 정리했다. 다음 포스트는 구체적인 테스트 과정을 정리해야겠다!
