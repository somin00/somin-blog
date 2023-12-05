---
title: "인턴십 프로젝트 2주차 - 렌더링 최적화"
date: "2023-09-14"
description: "리액트 렌더링 최적화를 위한 React.memo, useMemo, useCallback 알아보기"
isFeatured: false
---

렌더링은 화면에 요소를 그리는 것이다. HTML, CSS로 화면에 그린 것을 브라우저 DOM API를 JavaScript를 이용해 화면을 변화시킨다. 바닐라 자바스크립트를 이용해서 DOM 요소에 직접 접근하고 수정하는 것을 더 쉽게 하기 위해  React, Vue, Angular등의 라이브러리, 프레임워크를 사용한다.  
&nbsp; 

### 리액트에서의 렌더링 과정

리액트는 state가 변하면 state를 포함하는 컴포넌트와 해당 컴포넌트의 하위에 있는 모든 컴포넌트에서 리렌더링이 발생한다.

1. 기존 컴포넌트 UI를 재사용할 지 확인
2. 컴포넌트 함수를 호출
3. 2의 결과를 통해서 VirtualDOM을 생성
4. 이전 VirtualDOM과 새로운 VirtualDOM을 비교해서 변경된 부분만 DOM에 적용  
&nbsp; 

브라우저 렌더링 **CRP 과정**

1. HTML 파싱해서 DOM 생성
2. CSS 파싱해서 CSSOM 생성 
3. DOM과 CSSOM을 결합으로 Render Tree 생성
4. Render Tree와 Viewport의 width를 통해서 각 요소들의 위치와 크기를 계산 → Layout
5. 계산된 정보로 Render Tree의 요소들을 브라우저에 그림 → Paint

리액트는 브라우저에서 화면을 그리는 CRP 과정을 최소화하기 위해 VirtualDOM을 사용한다. 개발자는 React.memo, useMemo, useCallback을 사용하여 UI 재사용 최적화를 할 수 있다.  
&nbsp; 

### React.memo

React.memo는 HOC(Higher Order Component)로 컴포넌트를 받아서 컴포넌트를 리턴하는 함수이다.

React.memo로 감싼 컴포넌트는 상위 컴포넌트가 렌더링 되어도 Props를 이전 Props와 비교하여 변하지 않으면 렌더링 되지 않는다. 같은 Props를 전달하는데 지속적인 렌더링이 발생할 때 사용하는 것이 좋다.

- 얕은 복사(shallow compare)로 인한 참조형 타입 문제

    Props의 비교 방식이 얕은 복사이기 때문에 개발자가 직접 작성한 비교하는 함수를 두번째 인자로 넘길 수 있다. 이 함수의 return 값이 false인 경우 리렌더링된다.
    
    원시형 타입의 Props는 변경되면 새롭게 만들어진 데이터로 교체된다.
    참조형 타입의 Props는 내용이 변경되어도 객체를 가리키는 메모리 주소가 동일하기 때문에 내용 변경의 판단이 정확하지 않다. 내용이 같은 객체여도 메모리 주소가 다르기 때문에 같은 객체로 판단되지 않는다.  
    &nbsp; 
    
    **객체 불변성**
    
    한번 만들어진 객체는 수정하지 않아야 한다. 객체의 내용을 변경할 경우 기존 내용을 수정하는 것이 아니라 **새로운 객체를 만든 후 교체해야한다.**
    
    ```jsx
    const prev={ name: "hello", age: 30}, 
    const newObj={ ...prev, name: "hi"}
    
    prev===newObj //false
    ```  
    &nbsp;     

### useMemo

리액트에서 값을 메모이제이션 해주는 함수이다.

```jsx
const memoized=useMemo(()=>{}, [])
```  
&nbsp; 

### useCallback

함수 메모이제이션을 해주는 함수이다. useMemo로 함수 메모이제이션이 가능하지만 콜백 함수에서 또 함수를 리턴하는 형태가 되어 코드 가독성이 떨어진다. 

```jsx
const memoized=useCallback(()=>{}, [])
```

useMemo, useCallback은  콜백함수와 의존성 배열을 인자로 받는다. 의존성 배열에 작성한 값 중 하나라도 변경되면 새로운 값을 다시 계산한다.  
&nbsp; 

### 주의할 점
메모이제이션을 이유 없이 사용하는 것은 오히려 불필요한 비용이 들기 때문에

1. 새로운 값을 만드는 연산이 복잡하다.
2. 이전, 다음 호출의 동일성이 보장된다.

위 두가지 조건에 충족하고 최적화가 명확히 필요한 상황에 사용하는 것이 좋다.