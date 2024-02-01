---
title: "node, express, typescript로 CRUD 구현하기"
date: "2024-01-08"
description: "Node.js, express, typescript를 이용하여 투두리스트 CRUD API 구현"
category: "node typescript"
---

타입스크립트 강의를 들으면서 node.js express를 이용하여 투두리스트에 사용 가능한 서버를 만들어 보았다.
환경 설정 방법부터 코드까지 정리했다.
&nbsp;

## 1. 프로젝트 시작하기

최종 폴더, 파일 구성은 아래와 같이 했다.

![폴더 및 파일 구성 {352x664}](https://github.com/somin00/somin-blog/assets/61578822/af69ca5c-a844-44e0-9bb1-47b4706e5511)

- app.ts : 가장 처음 실행되는 파일
- controllers / todos.ts : 투두리스트 CRUD 함수 작성 파일
- model / todos.ts : 투두리스트 각 항목에 대한 클래스 지정으로 일종의 타입 선언과 같은 역할
- routes / todos.ts : api endpoint 지정

  &nbsp;

tsconfig.json 파일을 다음과 같이 설정하여 자바스크립트로 컴파일된 파일이 저장될 위치를 dist 폴더로 지정한다.

```bash
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
```

&nbsp;

@types/node @types/express를 추가로 다운로드해 타입스크립트 환경이 지원될 수 있도록 했다. body-parser로 요청 body를 json 형태로 변환하여 받을 수 있도록 했고, 코드 변경 시 서버를 자동으로 재시작하는 nodemon을 사용하여 개발 효율을 증가시켰다.  
&nbsp;

## 2. CRUD 구현

글 작성 후 프론트와 연결시켜 볼 예정이지만 아직 하지 않아서 postman을 이용하여 요청과 처리를 확인했다.

- app.ts 파일에서 라우트 별 미들웨어와 에러 처리 미들웨어를 작성했다.

  ```ts
  const app = express();

  app.use(json());

  app.use("/todos", todoRoutes);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ message: err.message });
  });

  app.listen(3000);
  ```

&nbsp;

- model/todos.ts 파일에서 투두리스트 각 항목의 타입을 지정했다. type이나 interface 키워드를 사용하는 것과 같은 역할을 한다.

  ```ts
  export class Todo {
    constructor(public id: string, public text: string) {}
  }
  ```

&nbsp;

- routes/todos.ts 파일에서 endpoint를 설정했다.

  ```ts
  router.post("/", createTodo);

  router.get("/", getTodos);

  router.patch("/:id", updateTodo);

  router.delete("/:id", deleteTodo);
  ```

  &nbsp;

- createTodo 할 일 목록 추가

  ```ts
  export const createTodo: RequestHandler = (req, res, next) => {
    const text = (req.body as { text: string }).text;
    const newTodo = new Todo(Math.random().toString(), text);

    TODOS.push(newTodo);

    res.status(201).json({
      message: "새 할 일을 추가했습니다.",
      createdTodo: newTodo,
    });
  };
  ```

  ![할 일 목록 추가 {523x266}](https://github.com/somin00/somin-blog/assets/61578822/e2cefab7-cae8-4891-998e-6f1a45577e3d)
  &nbsp;

- getTodo 할 일 목록 가져오기

  ```ts
  export const getTodos: RequestHandler = (req, res, next) => {
    res.status(200).json({
      message: "모든 할 일 목록을 가져오는데 성공했습니다.",
      todos: TODOS,
    });
  };
  ```

  ![전체 목록 가져오기 {566x336}](https://github.com/somin00/somin-blog/assets/61578822/9e809eb4-a7ec-49a4-ae65-c4030e5cac5e)
  &nbsp;

- updateTodo 할 일 목록 수정하기

  ```ts
  export const updateTodo: RequestHandler<{ id: string }> = (req, res, next) => {
    const todoId = req.params.id;
    const updateText = (req.body as { text: string }).text;

    const todoIdx = TODOS.findIndex((todo) => todo.id === todoId);

    if (todoIdx < 0) throw new Error("할 일을 찾을 수 없습니다.");
    TODOS[todoIdx] = new Todo(todoId, updateText);

    res.json({
      message: "할 일 목록을 수정했습니다.",
      updatedTodo: TODOS[todoIdx],
    });
  };
  ```

  ![할 일 수정 요청 {622x496}](https://github.com/somin00/somin-blog/assets/61578822/3ef89212-603d-40eb-96da-ce1bb5c64788)  
  ![수정 후 가져온 전체 목록 {478x356}](https://github.com/somin00/somin-blog/assets/61578822/382b4ba4-23a3-4f9d-b83e-839bdf736edf)

  &nbsp;

- deleteTodo 할 일 목록 삭제하기

  ```ts
  export const deleteTodo: RequestHandler<{ id: string }> = (req, res, next) => {
    const todoId = req.params.id;

    const todoIdx = TODOS.findIndex((todo) => todo.id === todoId);

    if (todoIdx < 0) throw new Error("할 일을 찾을 수 없습니다.");

    const deletedTodo = TODOS[todoIdx];
    TODOS.splice(todoIdx, 1);

    res.json({
      message: "할 일을 삭제했습니다.",
      deletedTodo,
    });
  };
  ```

  &nbsp;

데이터베이스에 연결하지 않아서 매번 데이터가 초기화되는 상태이다. 프론트엔드와 연결 후 데이터베이스를 연결하여 완전한 투두리스트 프로젝트를 완성 시킬 예정이다. 복잡한 구조의 프로젝트라면 아직 어렵겠지만 투두리스트 정도의 데이터 서버는 직접 만들어서 사용하려고 노력해야겠다.
