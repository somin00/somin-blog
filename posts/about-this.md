---
title: "함수 호출 방식에 따른 this 바인딩"
date: "2023-11-29"
description: "javascript에서 함수 호출 방식에 따라 this가 바인딩되는 방식에 대한 학습 내용 정리"
category: "javascript"
---

this가 호출되는 방식에 따라 어떤 객체와 바인딩되는 지에 대해 정리했다.

this는 함수가 호출될 때 어떻게 호출되었는지에 따라 가리키는 객체가 동적으로 결정된다.

**<참고>** 함수의 상위 스코프를 결정하는 Lexical Scope는 함수를 선언할 때 결정되는 것이다.  
&nbsp;

### 1. 함수 호출 this

글로벌 영역에서 선언된 함수는 전역 객체의 메소드이기 때문에 this는 기본적으로 전역 객체 (Global object)에 바인딩된다. 함수 내의 함수, 메소드 내부 함수, 콜백 함수의 경우에도 this는 전역 객체를 가리킨다. 즉, 내부 함수인 경우에는 어디에서 선언되었든 this가 전역 객체에 바인딩되는 것이다.

apply, call, bind 메소드를 사용하면 this를 명시적으로 원하는 객체에 바인딩할 수 있다.  
&nbsp;

### 2. 메소드 호출 this

객체 프로퍼티로 지정되어 있는 함수는 메소드로 호출된다. 호출될 때 this는 메소드가 속한 객체에 바인딩된다.  
&nbsp;

### 3. 생성사 함수 호출 this

자바스크립트는 다른 언어와 다르게 어떤 함수에든 new 연산자를 붙이면 생성자 함수로 작동할 수 있다. new 연산자로 생성자 함수를 호출하면 빈 객체를 생성하고 this가 그 객체를 가리킨다.

**<참고>** 생성자 함수는 반환문을 작성하지 않는 경우 this가 가리키는 객체를 반환한다. this를 반환하지 않는 함수는 생성자로 역할을 하지 못하기 때문에 보통 반환문을 작성하지 않는다.  
&nbsp;

**[생성자 함수에 new 연산자를 붙이지 않고 호출할 경우 발생하는 문제]**  
 일반함수와 생성자 함수의 호출 시 this 바인딩 방식이 다르기 때문에 문제가 발생한다.

생성자 함수를 new 연산자 없이 호출할 경우 this가 전역 객체를 가리키게 되고 this를 반환하지 않기 때문에 undefined를 반환한다.

&nbsp;

### 4. apply/call/bind 호출 this

세 메소드는 Function.prototype 객체 메소드이다.

- **apply**  
   this를 특정 객체에 바인딩하지만 본질적 기능은 함수의 호출이다.

  ```js
  Function.apply(object, argument);
  ```

  apply 메소드를 사용한 함수가 첫번째 매개변수에 있는 object를 가리키고 해당 object에 argument를 할당한다. argument는 배열 형태로 전달한다.
  &nbsp;

- **call**  
  apply 메소드와 기능은 같지만 두번째 인자로 전달하는 값의 형태를 배열이 아닌 각각 하나의 값으로 전달한다.

  ```js
  Function.call(object, argument);
  ```

  apply와 call를 콜백함수의 this를 콜백함수를 호출하는 외부 함수가 가리키는 this와 일치시키기 위해 사용한다.

  &nbsp;

- **bind**  
  콜백함수의 this 바인딩은 bind 메소드로도 가능하다. 단, apply, call 메소드와 다르게 bind 메소드는 함수를 실행하지 않기 때문에 함수 호출을 직접해야 한다.

  ```js
  callback.bind(this)();
  ```
