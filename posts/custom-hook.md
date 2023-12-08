---
title: "커스텀 훅을 이용한 관심사의 분리"
date: "2023-09-20"
description: "React Custom hook을 이용하여 관심사 분리하기"
---

### 관심사의 분리 SOC (Seperation of Concerns)

하나의 모듈이 하나의 목적만 가지도록 하는 것이다. 하나의 목적만 가진다면 문제가 생겼을 때 문제의 원인을 찾기도 쉬우며 수정할 부분이 한곳으로 줄어든다. 즉, 변화에 유연하게 대응할 수 있으며 유지 보수가 쉬워진다.  
&nbsp;

**[비슷한 개념]**

- **단일 책임 원칙 SRP (Single Responsibility Principle)**

  ⇒ 각 모듈들은 책임을 가지고 있으며 각기 하나의 책임만을 가져야 한다는 원칙

- **KISS(Keep It Simple, Stupid)**

  ⇒ 간단하고 단순하게 만들기, 하나의 기능만 수행하도록 만들기

SoC, SRP, KISS 는 다 유사한 의미를 가지고 있다.  
&nbsp;

리액트에서 쉽게 할 수 있는 관심사의 분리는 UI 부분(JSX)과 UI를 변경시키는 로직 부분을 분리하는 것이다. Custom Hook을 이용하면 관심사의 분리를 할 수 있다.  
&nbsp;

### Custom Hook

함수형 컴포넌트에서 사용하는 방법으로 리액트가 기본적으로 제공해 주는 훅들을 이용해서 만드는 함수이다.

**커스텀 훅의 조건**

1. hook을 호출하는 함수여야 한다.
2. 함수 이름은 use로 시작해야 한다.  
   &nbsp;

**기본 hook 규칙**

1. 컴포넌트의 top-level 에서만 호출할 수 있다.

   → 2번 규칙 때문에 top-level에서 사용하지 않으면 에러가 발생한다.

2. 이름 시작을 use로 하면 리액트에서 훅으로 인식한다.  
   &nbsp;

멘토님의 말씀 중 실제 프로젝트에 사용할 때 참고할 수 있는 것을 적어봤다.

1. **커스텀 훅에서 반환하는 함수는 메모이제이션을 하는 것이 좋다.**

   어디에서 어떻게 사용될지 모르고, 함수는 계속해서 재생성 되기 때문에 발생할 수 있는 문제들이 있다.

   useEffect 내에서 사용된다면 무한 루프가 발생하고, React.memo를 사용하고 있는 컴포넌트의 Props로 전달한다면 무한 렌더링이 발생할 수 있다.

   메모이제이션으로 문제 상황을 사전에 차단할 수 있다.  
    &nbsp;

2. **return 타입은 Array? Object?**

   \*return 값이 반드시 있어야 할 필요는 없으며, 어떤 값을 리턴하든 상관없다.  
   &nbsp;

   **Array타입**

   사용하는 컴포넌트에서 다른 이름을 사용하고 싶다면 Array 사용

   ```jsx
   // 커스텀 훅
   const useHook = () => {
     return [a, b, c];
   };

   // 커스텀 훅 사용 컴포넌트
   const Component = () => {
     const [first, second, third] = useHook();
   };
   ```

   → index에 해당하는 값을 가져오기 때문에 index만 신경 쓰면 된다.  
   &nbsp;

   **Object타입**

   많은 값을 반환하는데 각각의 컴포넌트에서 일부 데이터만 추출해서 사용한다면 Object 사용

   ```jsx
   // 커스텀 훅
   const useHook = () => {
     return { a, b, c, d, e, f, g };
   };

   // 커스텀 훅 사용 컴포넌트
   const Component1 = () => {
     const { b, c } = useHook();
   };

   const Component2 = () => {
     const { e, f, g } = useHook();
   };
   ```

   → key에 해당하는 값을 가져오기 때문에 key만 신경 쓰면 된다.
