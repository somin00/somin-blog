---
title: "따라하며 배우는 리액트 테스트 강의 section2"
date: "2024-02-14"
description: "간단한 애플리케이션을 만들며 리액트 테스트 기초 학습하기"
category: "리액트 테스트"
---

## 테스 주도 개발 (TDD : Test Driven Development)

테스트 코드를 먼저 작성하고 실제 코드를 작성하는 개발 방법  
&nbsp;

### TDD의 좋은 점

- 많은 테스트를 거쳐 소스 코드에 안정감 부여
- 디버깅 시간 감소
- 소스 코드를 신중하게 작성하여 깨끗한 코드가 나올 확률 증가  
  &nbsp;

### 첫번째 앱 : 카운터 앱

- 컴포넌트 코드

  ```tsx
  function App() {
    const [counter, setCounter] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);

    const increase = () => {
      setCounter((prev) => prev + 1);
    };

    const decrease = () => {
      setCounter((prev) => prev - 1);
    };

    const toggleOnOffButton = () => {
      setIsDisabled((prev) => !prev);
    };

    return (
      <div className="App">
        <header className="App-header">
          <h3 data-testid="counter">{counter}</h3>
          <div>
            <button data-testid="minus" disabled={isDisabled} onClick={decrease}>
              -
            </button>
            <button data-testid="plus" disabled={isDisabled} onClick={increase}>
              +
            </button>
          </div>
          <div>
            <button data-testid="onoff" onClick={toggleOnOffButton} style={{ backgroundColor: "blue" }}>
              on/off
            </button>
          </div>
        </header>
      </div>
    );
  }
  ```

  &nbsp;

- 숫자 counter는 0부터 시작한다.

  ```tsx
  test("숫자 counter는 0부터 시작한다. ", () => {
    render(<App />);
    //screen object로 테트 하고자 하는 엘리먼트에 접근
    const counterElement = screen.getByTestId("counter");
    //시작 값이 0인지 테스트
    expect(counterElement).toHaveTextContent("0");
  });
  ```

  getByTestId 메서드와 data-testid로 부여한 아이디를 이용하여 요소에 접근할 수 있다. (getByTestId로 접근하는 것을 권장하지는 않는다고 한다. 기초 강의이기 때문에 여러 방법을 보여주려고 사용하신 것 같다.) toHaveTextContent는 해당 요소의 textContent가 가지는 값을 확인할 수 있는 matcher이다.  
  &nbsp;

- 플러스 버튼 텍스트 확인

  ```tsx
  test("+버튼 텍스트", () => {
    render(<App />);

    const plusButton = screen.getByTestId("plus");
    expect(plusButton).toHaveTextContent("+");
  });
  ```

  &nbsp;

- 마이너스 버튼 텍스트 확인

  ```tsx
  test("-버튼 텍스트", () => {
    render(<App />);

    const minusButton = screen.getByTestId("minus");
    expect(minusButton).toHaveTextContent("-");
  });
  ```

&nbsp;

- 플러스, 마이너스 버튼 기능 넣기

  유저 이벤트를 테스트하기 위해 FireEvent API를 사용한다.

  - 플러스 버튼을 클릭하면 숫자가 1 증가한다.

    ```tsx
    test("+ 버튼을 클릭하면 숫자가 1 증가한다.", () => {
      render(<App />);

      const plusButton = screen.getByTestId("plus");

      fireEvent.click(plusButton);

      const counterElement = screen.getByTestId("counter");
      expect(counterElement).toHaveTextContent("1");
    });
    ```

    &nbsp;

  - 마이너스 버튼을 클릭하면 숫자가 1 감소한다.

    ```tsx
    test("- 버튼을 클릭하면 숫자가 1 감소한다.", () => {
      render(<App />);

      const minusButton = screen.getByTestId("minus");

      fireEvent.click(minusButton);

      const counterElement = screen.getByTestId("counter");
      expect(counterElement).toHaveTextContent("-1");
    });
    ```

    &nbsp;

- on / off 버튼의 배경색이 파란색이다.

  ```tsx
  test("on/off 버튼 색상은 파란색이다.", () => {
    render(<App />);

    const toggleButton = screen.getByTestId("onoff");
    expect(toggleButton).toHaveStyle({ backgroundColor: "blue" });
  });
  ```

  &nbsp;

- on / off로 +, - 버튼을 활성화, 비활성화 한다.

  ```tsx
  test("on/off 버튼을 클릭하면 +, - 버튼이 비활성화된다.", () => {
    render(<App />);

    const toggleButton = screen.getByTestId("onoff");
    fireEvent.click(toggleButton);

    const plusButton = screen.getByTestId("plus");
    const minusButton = screen.getByTestId("minus");

    expect(plusButton).toBeDisabled();
    expect(minusButton).toBeDisabled();
  });
  ```

&nbsp;

### Query 사용 우선 순위

모든 접근성을 고려한 테스트를 진행할 수 있도록 우선순위를 제공하고 있다.

참고) [https://testing-library.com/docs/queries/about/#priority](https://testing-library.com/docs/queries/about/#priority)

- getByRole
- getByLabelText
- getbyPlaceholderText
- getbyText

지난번 사용했던 getByTestId는 사용자가 알 수 없는 것이다. role, text 같은 것들로 접근할 수 없는 경우에 사용하는 것이 좋다.

&nbsp;

### fireEvent보다 userEvent

userEvent는 fireEvent로 만들어진 것이다. 엘리먼트 타입에 따라 Label을 클릭했을 때, checkbox, radio를 클릭했을 때 더 적절한 반응을 한다. fireEvent는 click 이벤트 발생 시 버튼에 focus가 되지 않지만 userEvent는 버튼에 포커스 된다. 테스트는 최대한 사용자의 관점과 비슷하게 진행되어야 하기 때문에 userEvent 사용이 추천된다.

&nbsp;

아직 기초라 흥미롭다!! 테스트 코드를 먼저 짜고 테스트를 통과하도록 소스 코드를 작성하니까 제대로 작동하고 있다는 확신도 들고, 직접 브라우저를 실행해서 테스트하지 않아도 되는 것이 좋았다. 어려워지면 어떨지 모르겠지만…아직 즐겁다😆
