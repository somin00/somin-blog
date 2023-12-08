---
title: "인턴십 3주차 복습 - 의존성"
date: "2023-09-21"
description: "의존성, 의존성역전원칙(DIP), 의존성 주입"
---

## 의존성

특정 모듈이 동작하기 위해 다른 모듈을 필요로 하는 것이다.  
&nbsp;

### 1. 의존선 역전 원칙

의존성이 추상에 의존하며 구체에는 의존하지 않는 것이다. 코드상에서 interface를 구현하는 것이다.
interface가 존재할 때 사용하는 입장은 어떻게 구현되어있는지 신경 쓰지 않고 '해야 하는 것'과 '결과'만 신경 쓸 수 있다.구현하는 입장에서는 정한 약속을 지키는 선에서 세부적인 구현 방법은 어떻게 바꾸든 상관이 없다.

- **추상** : '해야 하는 것'과 '결과'
- **구체** : '동작'과 '흐름'

구체에 의존한 코드를 작성하면 구체가 변화할 때마다 의존하는 모든 코드를 수정해야 한다.

```jsx
fetch(endpoint, {
	headers:{
		Authorization:localStorage.getItem("ACCESS_TOKEN");
	}
}
```

위 코드에서는 fetch가 localStorage에 의존하고 있다. getItem이 다른 이름으로 변경된다면 localStorage에 의존하고 있는 모든 코드를 변경된 이름으로 수정해야 한다. 하지만 로컬스토리지에 접근하는 코드에 대한 추상을 만들고 구체를 만든다면 이런 문제를 해결할 수 있다.

TokenRepositoryInterface라는 추상을 만들고 추상에서 정의한 약속에 맞게 구체를 만들었다.

```jsx
/*
	TokenRepositoryInterface

	  save(token:string):void
	  get():string
	  remove():void
*/

class TokenRepository {

  save(token) {
  }

  get() {
		return localStorage.getItem(key)
  }

  remove() {
  }
}

const tokenRepository = new TokenRepository();

fetch(endpoint, {
	headers:{
		Authorization:tokenRepository.get();
	}
})
```

그렇다면 fetch는 TokenRepositoryInterface에만 의존하고 있으며 localStorage에 의존하고 있는 것은 TokenrRepository뿐이다.  
&nbsp;

💡 의존성 방향

fetch → TokenRepositoryInterface(추상) **←** TokenRepository(구체) → localStorage  
&nbsp;

따라서 localStorage의 구체가 바뀌었을 때 TokenRepository 클래스만 수정하면 된다.  
&nbsp;

다시 정리하면 **의존성 역전 원칙(DIP)** 은 추상에 대한 의존성을 중간에 추가하여 특정 시점에서 코드의 실행 흐름과 의존성 방향이 반대가 되는 것이다.  
&nbsp;

### 2. 의존성 주입

의존성 주입이란 모듈에 필요한 의존성을 해당 모듈을 사용하는 곳에서 주입해주는 형태로 작성하는 것을 말한다.의존성 주입을 적용하면 모듈 외부의 코드만 수정해서 동작을 변경할 수 있게 된다.

리액트는 props를 통해서 단방향 데이터 전달만 가능하기에 의존성을 주입을 위해서 Context API를 사용한다.
