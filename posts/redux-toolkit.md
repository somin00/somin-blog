---
title: "redux-toolkit을 사용한 비동기 통신 처리하기"
date: "2024-01-10"
description: "redux-toolkit을 이용하여 서버에 api 요청 보내기"
category: "리액트 리덕스"
---

redux-toolkit을 연습하고자 서버 연결하지 않은 상태에서 적용했었다. 서버를 연결하고 나서는 비동기 통신이 필요하기 때문에 redux-thunk릉 사용해야 해서 redux-toolkit과 관련된 모든 코드를 수정했다. 수정 전 코드와 수정 후 코드에 대해 정리했다.  
 &nbsp;

## redux-toolkit 적용하기

1. redux, redux-toolkit 설치

```bash
npm i @reduxjs/toolkit react-redux redux
```

&nbsp;

2. 모든 상태를 관리할 store를 생성하고 사용할 수 있도록 Provider 연결하기

   store는 src/store/index.ts 파일에 생성했고, Provider는 index.tsx 파일에 연결했다.

```tsx
import { configureStore } from "@reduxjs/toolkit";
import todoSlice from "./todoSlice";

const store = configureStore({
  reducer: {
    todo: todoSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
```

&nbsp;

```tsx
import { Provider } from "react-redux";
import store from "./store/index";

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

&nbsp;

3. 리듀서 생성
   리듀서에는 상태를 변화시킬 함수들을 작성한다. src/store/todoSlice.ts에 작성

```tsx
import { createSlice } from "@reduxjs/toolkit";
import { Todo } from "../todo.model";

const initialState: Todo[] = [];

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    add: (state, action) => {
      state.push({
        id: Math.random().toString(),
        text: action.payload,
      });
    },
    remove: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export default todoSlice;
export const { add, remove } = todoSlice.actions;
```

&nbsp;

4. 사용하기

- 상태 값은 useSelector로 가져올 수 있다.

```tsx
import { useSelector } from "react-redux";
import { RootState } from "./store";

const App = () => {
  const todos = useSelector((state: RootState) => {
    return state.todo;
  });
  return ();
};
```

- 상태를 변화시킬 리듀서는 useDispatch와 todoSlice.ts에서 export한 actions들을 사용한다.

  할 일 삭제 기능을 예시로 작성했다.

```tsx
import { useDispatch } from "react-redux";
import { remove } from "../store/todoSlice";

export const TodoList = ({ todos }: TodoListProps) => {
  const dispatch = useDispatch();
  const deleteTodo = (id: string) => {
    dispatch(remove(id));
  };
};
```

&nbsp;

여기까지가 기본적인 redux-toolkit 사용 방법이다. redux에 비해 초기 설정을 할 것도 별로 없어서 매우 편리하다. 아래부터는 비동기 통신이 필요할 때 redux-toolkit을 적용하는 방법이다.  
&nbsp;

## 프론트와 서버 연결하고 redux-toolkit 비동기 통신 적용

가장 먼저 프론트에서 프록시 설정을 해야 한다. CORS 정책때문인데 자세한 건 별도의 포스트에 작성할 것이다..!

src/setProxy.js를 생성한다. 확실하게는 모르겠지만 별도의 typescript를 지원하지 않아 js확장자를 이용
했다는 글을 보고 js로 작성했다.

```bash
npm i http-proxy-middleware
```

setProxy.js

```jsx
import { createProxyMiddleware } from "http-proxy-middleware";

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/todos", {
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
};
```

&nbsp;

redux는 비동기 처리를 위해 redux-thunk, redux-saga 등의 미들웨어를 사용해야 한다. 상태 관리를 위해 redux-toolkit을 사용했기 때문에 thunk를 내장하고 있어 별도의 미들웨어가 필요 없다!

1. createAsynThunk로 thunk를 생성한다.

   createAsyncThunk를 이용하면 비동기 통신으로 상태 관리를 할 수 있다.

```tsx
export const fetchTodo = createAsyncThunk("asyncTodoThunk/getTodo", async (_, thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:5000/todos");
    const data = await response.data;
    const todos = (await data.todos) as Todo[];
    return todos;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});
```

get요청을 처리하는 thunk이다. 이와 비슷한 방식으로 post, patch, delete 요청에 대한 thunk를 작성했다.  
[todoAsyncSlice 자세한 코드 보기](https://github.com/somin00/somin-todo/blob/main/todo-client/src/store/todoAsynSlice.ts)  
&nbsp;

2. thunk 사용하기
   createSlice를 이용해 thunk를 사용한다. thunk가 반환하는 thunk action creator를 이용해 통신 상태에 따른 처리를 할 수 있다.

- pending
- fulfilled
- rejected

```tsx
export const asyncTodoThunkSlice = createSlice({
  name: "asyncTodoThunk",
  initialState: {
    value: [] as Todo[],
    status: "init",
  },
  reducers: {},
  extraReducers: (builder) => {
    //getTodo
    builder.addCase(fetchTodo.pending, (state) => {
      state.status = "Loading";
    });
    builder.addCase(fetchTodo.fulfilled, (state, action) => {
      state.value = action.payload;
      state.status = "Complete";
    });
    builder.addCase(fetchTodo.rejected, (state) => {
      state.status = "Failed";
    });
  },
});
```

&nbsp;

3. 사용하기

- 상태 값 가져오기

```tsx
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { fetchTodo } from "./store/todoAsynSlice";
import { useEffect } from "react";

const App = () => {
  const dispatch: AppDispatch = useDispatch();

  const todos = useSelector((state: RootState) => {
    return state.asyncTodoThunk.value;
  });

  useEffect(() => {
    dispatch(fetchTodo());
  }, [dispatch]);

  return ();
};
```

- 상태 값 변화하는 방법은 dispatch와 actions를 사용하는 이전 방법과 동일하다.  
  &nbsp;

다양한 상태 관리 라이브러리에 대해 공부하고 어떤 상황에 어떤 것이 적합할지도 몸소 느껴보고 추후 진행할 프로젝트에 직접 적용해 보고 싶다.
