---
title: "따라하며 배우는 리액트 테스트 강의 section1"
date: "2024-02-13"
description: "테스트의 필요성과 테스트 코드를 작성하기 전 필요한 기본 지식"
category: "리액트 테스트"
---

곧 프로젝트에서 리팩토링 + 테스트 코드 작성을 하게 되는데 테스트와 관련해서 지식이 너무 부족해서 강의를 통해 학습해 보려고 한다.  
&nbsp;

### 테스팅의 필요성과 얻는 이점은?

- 디버깅 시간 단축
- UI 문제인지 DB 문제인지 등의 버그 발견 용이
- 안정적인 애플리케이션
- 재설계 시간 단축, 추가 기능 구현 편리함

&nbsp;

### RTL이란?

React 구성 요소 작업을 위한 테스팅 라이브러리이다. DOM 노드를 테스트하기 위한 DOM Testing Library의 기능에 리액트 구성요소에 대한 API를 추가한 것이다.
간단하게 말하면 리액트 컴포넌트를 테스트하는 가벼운 솔루션이다. CRA로 프로젝트 생성 시 기본적으로 지원하기 때문에 편리하게 사용 가능하다.  
&nbsp;

**[에어비엔비에서 만든 Enzyme과의 차이]**

- Enzyme - 구현 주도 테스트 (Implementation Driven Test)  
   A 컴포넌트와 B 컴포넌트 사이에 주고받는 Props, 각 컴포넌트 내에서 관리되는 state에 초점을 둔 테스트를 진행한다.

- RTL - 행위 주도 테스트 (Behavior Driven Test)  
  어떤 행위가 제대로 작동하는지 테스트

Enzyme은 React 구성 요소의 내부를 테스트할 수 있는 유틸리티를 제공하지만 RTL은 React 구성 요소를 완전히 신뢰하여 구성 요소의 세부 구현 정보 대신 구현된 기능의 작동을 테스트한다.  
&nbsp;

### DOM이란?

Document Object Model의 약자로 XML, HTML 문서를 계층으로 표현하여 생성, 변형, 삭제할 수 있게 돕는 인터페이스이다.  
HTML은 화면에 보여주고자 하는 것을 문서로 만든 단순 텍스트이고, DOM은 브라우저의 렌더링 엔진에 의해 HTML이 객체 모델로 변환된 것이다. 따라서 DOM은 자바스크립트에 의해 수정될 수 있으나 HTML은 수정할 수 없다.  
&nbsp;

### 웹 페이지 빌드 과정 (Critical Rendering Path : CRP)

브라우저가 서버에서 페이지에 대한 HTML 응답을 화면에 보이기까지의 과정이다.

1. HTML → DOM, CSS → CSSOM
2. DOM + CSSOM + JavaScript ⇒ Render Tree (화면에 보이는 모든 콘텐츠, 콘텐츠의 스타일 정보를 포함하는 최종 렌더링 트리)
3. Layout (크기, 위치)
4. Paint (레이아웃 결과 선택, 픽셀 페인트)  
   &nbsp;

### Jest에 대하여

FaceBook에 의해 만들어진 테스팅 프레임워크이다. RTL을 이용해서 DOM을 렌더링하고 Jest로 테스트를 수행한다. Test Case를 만들어서 애플리케이션 코드가 잘 돌아가는지 확인하는 용도이며, 단위(Unit) 테스트를 위해 사용한다. Jest가 테스트할 파일을 찾는 역할도 한다. CRA로 프로젝트 생성 시 기본적으로 지원하기 때문에 편리하게 사용 가능하다.

**[테스트 파일로 인식하는 것들]**

- filename.test.확장자
- filename.spec.확장자
- tests 폴더 내에 모든 파일

&nbsp;

### Jest 파일 구조 & 사용법

```tsx
describe("description", () => {
  it("description", () => {
    expect().matcher();
  });
  test("description", () => {});
});
```

- describe: 여러 관련 테스트를 그룹화하는 블록
- test(it): 개별 테스트 수행
- expect: 값을 테스트할 대 사용. matcher와 함께 사용됨
- matcher: expect로 테스트하고자 하는 값에 대한 검사에 사용  
  &nbsp;

### 간단한 기능 미리보기

- render 함수  
  인자로 전달하는 React 컴포넌트를 DOM에 렌더링 하는 함수  
  RTL에서 제공하는 쿼리 함수, 유틸리티 함수를 포함하는 객체를 리턴
  &nbsp;

- 쿼리 함수  
  페이지에서 요소를 찾기 위해 사용  
  get, find, query 유형의 쿼리가 있다. 요소가 발견되지 않았을 때 리턴 값이 다르기 때문에 적절하게 사용해야 한다. 둘 이상의 요소가 예상되면 getAllBy, queryAllBy, findAllBy를 사용하는 것이 좋다.
  - **getBy…**  
    쿼리에 대해 일치하는 노드를 반환하고 일치하는 요소가 없거나 둘 이상의 요소가 발견되면 오류를 발생시킨다.
  - **queryBy…**  
    쿼리에 대해 일치하는 노드를 반환하고 일치하는 요소가 없으면 null을 반환한다. 둘 이상의 요소가 발견되면 오류를 발생시킨다.
  - **findBy…**  
    getBy + waitFor = findBy (waitFor : 일정 시간 동안 기다리는 것에 대한 테스트를 위해 사용한다.)
    쿼리에 대해 일치하는 요소가 있으면 Promise를 반환한다. 요소가 발견되지 않거나 제한 시간 이후(1000ms 이후) 둘 이상의 요소가 발견되면 reject된다.
