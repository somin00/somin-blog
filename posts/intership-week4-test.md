---
title: "인턴십 프로젝트 4주차 - 소프트웨어 테스트"
date: "2023-10-10"
description: "Jest, RTL(React-Testing-Library)를 알아보자!👊🏻"
isFeatured: false
---

소프트웨어 테스트는 무엇이고 테스트 종류에는 어떤 것이 있는지 정리하고 Jest와 React Testing Library를 이용하여 간단한 테스트 실습을 해보았다🙂  
&nbsp; 

**소프트웨어 테스트란?** 소프트웨어가 의도대로 작동하는지 확인하는 것이다. 테스트를 작성하고 개발할 경우 소프트웨어가 정상 작동하는지 바로 확인하고 수정할 수 있다. 자동화 테스트를 통해 테스트 과정에서 발생할 수 있는 에러를 줄일 수 있다.  
&nbsp; 

**소프트웨어 테스트 종류**

- Unit Test (단위 테스트)
    
    가장 작은 범위의 테스트이다. 각각의 함수/메서드/컴포넌트 등의 작은 단위를 테스트하기 위해 사용한다.   
    &nbsp; 

- Integration Test (통합 테스트)
    
    두 개 이상의 모듈이 함께 동작하는 것을 확인하기 위한 테스트이다. 컴포넌트에서 다른 모듈을 사용할 때 잘 작동하는지 확인하는 것이 통합 테스트이다.  
    &nbsp;  

- End-to-End Test(E2E Test)
    
    유저의 환경과 유사한 환경을 구축한 후 테스트하는 것이다. 환경을 구축하고 유저 행동을 실행해야 하기 때문에 다른 테스트에 비해 복잡하고 비싸다.  
    &nbsp; 

Jest, Mocha, chai 등 테스트 라이브러리가 다양한데 Jest를 선택해서 학습한 이유는 Jest가 React를 주로 사용하기 때문에 React에서 환경 구성 시 사용되기 때문이다.  
&nbsp; 

### Jest 정리

의도한 대로 작동하는지 확인하기 위한 함수를 matchers라고 한다. 

특정 동작을 수행하고 결과값을 matcher로 검증한다.  
&nbsp; 

**동작 수행을 함수**

- test()
- it()

두 함수는 이름만 다르고 같은 기능을 수행한다.  
&nbsp; 

**matcher**

- toBe : expect 인자가 toBe의 인자와 일치 하는지 검사
- toEqual : Object의 경우 참조 타입이기 때문에 toBe를 사용하면 실제 결과와 상관없이 다르다는 결과가 반환된다. toEqual 사용해야 한다.
- toBeNull, toBeUndefined
- toContain : Iterable 객체가 특정 요소를 포함하는지 판단
- not : matcher 기댓값 반대로 변경  
&nbsp; 

### Jest 기본 실습

자바스크립트 코드를 테스트하기 위해 사용하는 테스팅 라이브러리이다.  
&nbsp; 

1. 카운트 기능 테스트

```jsx
export const ACTION_TYPE = {
  increase: "increase",
  decrease: "decrease",
};

export function counterReducer(state, action) {
  if (action?.type === ACTION_TYPE.increase) {
    return state + 1;
  }
  if (action?.type === ACTION_TYPE.decrease) {
    return state - 1;
  }
  return state;
}
```

countReducer function은 pure function

*pure function : side effect 없는 함수. input이 같으면 output도 같은 함수

```jsx
import { counterReducer, ACTION_TYPE } from "./components/Counter";

test("should return 2 when state is 1 and actions is increase", () => {
  const result = counterReducer(1, { type: ACTION_TYPE.increase });
  expect(result).toBe(2);
});

test("should return 0 when state is 1 and actions is decrease", () => {
  const result = counterReducer(1, { type: ACTION_TYPE.decrease });
  expect(result).toBe(0);
});

test("should return 1 when state is 1and action is undefined", () => {
  const result = counterReducer(1);
  expect(result).toBe(1);
});
```

pure function일 경우 테스트 코드 작성이 쉬워진다.  
&nbsp; 

2. 함수 호출 테스트 

saveUserInput의 매개변수 saveFunction 함수가 userInput과 함께 호출되는지에 대해 테스트한다.

```jsx
function saveUserInput(userInput, saveFunction) {
  saveFunction(userInput);
}
```

함수 호출 여부를 판단하는 toHaveBeenCalledWith matcher를 사용한다. 

function 키워드로 생성하는 일반 함수는 테스트가 되지 않기 때문에 Jest에서 지원하는 Mock Function을 사용해야 한다. 

saveUserInput에서 saveFunction이 어떤 역할을 하는 함수인지 알 필요가 없기 때문에 정상적인 작동을 하는 함수가 아니라 임의의 함수여도 무방하다.

```jsx
test("saveUserInput should call with userInput", () => {
  const saveFunction = jest.fn();
  saveUserInput("hello", saveFunction);
  expect(saveFunction).toHaveBeenCalledWith("hello");
});
```  
&nbsp; 

**[Mock Function 사용시 중요한 점 : Dependency Injection]**

saveUserInput에 saveFunction을 주입하는 형태로 코드를 작성해야 테스트가 가능하다.

→ saveUserInput의 인자로 넘겨주는 형태여야 한다는 의미이다.  
&nbsp; 

### React Testing Library 실습

DOM 상에 요소들이 존재하는지 검사하기 위해 CRA에 기본적으로 포함되어 있는 jest-dom 라이브러리를 함께 사용했다. 

RTL은 최종적으로 사용자가 볼 UI에 초점을 두고 테스트하기 위한 라이브러리이다. 컴포넌트를 렌더링하고 요소에 접근할 수 있는 기능을 제공한다. 결과 중심의 테스트를 사용할 경우 세부 기능 구현이 변경되어도 보이는 결과가 같다면 테스트 코드를 수정할 필요가 없다.

- render : 화면에 렌더링
- screen : 렌더링 되고 있는 화면을 의미한다. DOM 상에서 document.body와 동일하다고 할 수 있다.  
&nbsp; 

**요소 가져오는 메서드 종류**

- getBy- : 요소가 DOM 상에 있는지 동기적으로 확인한다. 만약 찾는 요소가 없을 경우 예외를 던진다.
- findBy- : 요소가 DOM 상에 있는지 비동기적으로 확인한다. 요소를 찾기 위해 일정 시간을 기다리며, 시간이 지난 후에도 찾지 못하면 예외를 던진다.
- queryBy- : getBy와 동일하게 동작하지만 찾는 요소가 없을 경우 null을 반환한다.  
&nbsp; 

**이벤트 발생 시키기**

testing-library/user-event 사용  
&nbsp; 

1. 제목 요소, 증가 버튼, 감소 버튼이 document에 존재하는지 테스트

```jsx
test("Component should render heading and increase, decrease button", () => {
  render(<Counter />);

  const heading = screen.getByRole("heading");
  const increaseButton = screen.getByText(/Increase/i);
  const decreaseButton = screen.getByText(/decrease/i);

  expect(heading).toBeInTheDocument();
  expect(increaseButton).toBeInTheDocument();
  expect(decreaseButton).toBeInTheDocument();
});
```  
&nbsp; 

2. 증가 버튼 클릭 이벤트 기능 테스트 

```jsx
test("Counter should render count:1 when increase button is clicked", () => {
  render(<Counter />);

  const heading = screen.getByRole("heading");
  const increaseButton = screen.getByText(/Increase/i);

  expect(heading).toHaveTextContent("count:0");

  userEvent.click(increaseButton);

  expect(heading).toHaveTextContent("count:1");
});
```

컴포넌트를 render 하는 코드와 요소들에 접근하는 코드의 중복이 발생한다. describe 블록의 beforeEach 메서드를 사용하거나 중복되는 로직만 함수로 분리하여 중복을 제거할 수 있다. 

함수로 분리하는 것이 가독성이 좋아 함수로 분리했다.