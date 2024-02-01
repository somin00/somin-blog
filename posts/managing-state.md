---
title: "공식 문서 읽기  Managing State"
date: "2023-10-26"
description: "React state에 대해 알아보기"
category: "리액트"
---

훅의 작동 원리에 대해 정확하게 알아보고자 공식 문서를 봤다가 기본 내용도 짚고 넘어가면 좋을 것 같아서 학습하기 부분부터 천천히 읽기 시작했다.

공식 문서 : https://react-ko.dev/learn/managing-state

React 원리에 대해 잘 안다고 생각했는데 읽으면서 잊고 있던 것들을 다시 떠올리기도 하고 애매하게 알고 있던 것들을 확실하게 알게 되었다. 꼭 기억하면 좋을 법한 내용들을 정리했다. 코드는 모두 공식 문서 코드이다.  
&nbsp;

### state 잘 사용하기

1. 두 개 이상의 state를 동시에 업데이트하는 경우 하나의 state로 합치는 것이 좋다.
2. props나 기존 state로 계산할 수 있는 정보는 state로 관리하지 않는다.
3. 동일한 데이터를 여러 state로 관리하면 동기화하기 어렵다. 중복을 피해야 한다.
4. 깊게 계층화된 state는 관리가 어렵기 때문에 가능한 평평하게 유지해야 한다.  
   &nbsp;

### state의 업데이트

부모로부터 받는 props를 state의 초기값으로 넣으면 부모의 state 값이 변경되어도 자식 컴포넌트에 반영되지 않는다.

→ 첫 번째 렌더링에만 useState의 state 값이 초기화되기 때문에 부모의 state 변경 사항을 바로 적용하려면 props로 전달한 값 자체를 사용해야 한다.  
&nbsp;

### state 보존

state는 UI 트리 상 같은 위치에 렌더링 되면 유지된다. React는 UI 트리에서 컴포넌트의 위치에 따라 state를 컴포넌트와 연결한다.

```jsx
import { useState } from "react";

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}
```

![UI 트리상 동일한 위치에서의 state 관리](https://velog.velcdn.com/images/somin/post/e8e1d678-f8de-41fb-8422-caececc09eba/image.png)
UI 트리상에서 동일한 위치에 렌더링 되는 동안 state를 유지한다. 컴포넌트가 제거되거나 다른 컴포넌트가 렌더링 되면 state를 삭제합니다.  
&nbsp;

**동일한 위치의 다른 컴포넌트는 state를 초기화합니다**

```jsx
import { useState } from "react";

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return <div>{isPaused ? <p>See you later!</p> : <Counter />}</div>;
}
```

![다른 컴포넌트 state 차이](https://velog.velcdn.com/images/somin/post/9fcb4b08-18de-466d-b1fd-fee1d789b89a/image.png)

### 컴포넌트 중첩 선언시 발생할 수 있는 문제

```jsx
export default function MyComponent() {
  function MyTextField() {
    return <div></div>;
  }

  return (
    <>
      <MyTextField />
    </>
  );
}
```

MyComponent가 재생성 될 때마다 MyTextField 컴포넌트 또한 재생성 되기 때문에 state 값을 유지할 수 없다. **항상 컴포넌트 함수를 최상위 수준에서 선언하는 것이 좋다.**  
&nbsp;

### 컴포넌트 위치에 따른 state 공유

**동일한 위치에서 state 재설정**

```jsx
import { useState } from "react";

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return <div>{isPlayerA ? <Counter person="Taylor" /> : <Counter person="Sarah" />}</div>;
}
```

두 플레이어 카운트 state를 공유한다. 다른 플레이어를 선택해도 이전 플레이어의 count 값이 유지된다.  
&nbsp;

**[컴포넌트 간 state를 공유하지 않는 방법]**

**1.컴포넌트를 다른 위치에 렌더링 하기**

다른 위치에 존재하기 때문에 state의 유지가 끊겨서 각각의 state를 사용할 수 있다.

```jsx
import { useState } from "react";

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA && <Counter person="Taylor" />}
      {!isPlayerA && <Counter person="Sarah" />}
    </div>
  );
}
```

&nbsp;

**2.key로 state 재설정하기**

```jsx
import { useState } from "react";

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return <div>{isPlayerA ? <Counter key="Taylor" person="Taylor" /> : <Counter key="Sarah" person="Sarah" />}</div>;
}
```

\*키는 부모 내에서만 위치를 지정할 뿐 전역으로 고유하지는 않다.
