---
title: "node, express, MySQL로 투두리스트 서버 개선하기"
date: "2024-01-09"
description: "투두리스트 프론트에 서버 연결하기 (feat. redux-toolkit)"
---

지난 포스트에서 node.js express를 이용하여 투두리스트 서버를 만든 내용을 정리했다. 데이터베이스에 대해 아주 얕게 알고 있기 때문에 좀 더 공부를 하고 개선을 하려고 했는데 투두리스트 정도는 아는 선에서 가능할 것 같아 바로 mysql을 연결해 보았다.
클라이언트 코드에 서버 통신 없이 redux-toolkit은 이미 적용한 상태였는데 서버와 연결하면서 비동기 통신이 필요하여 redux-toolkit 코드는 거의 수정되어서 추가 포스트를 작성할 예정이다.
&nbsp;

## 서버에 MySQL 적용하기

우선 프로젝트에 mysql을 연결하는 것이 시작이다. 서버단에서 mysql2를 설치한다. 지난 포스트에서 수정되는 것은 controller/todos.ts 파일뿐이다.

- mysql 사용하기

  ```bash
  mysql -uroot -p
  create database todoData;
  use todoData;
  ```

  todo 데이터를 관리할 데이터베이스를 todoData로 생성했다.

- 테이블 생성

  ```bash
  create table todos( id varchar(30) not null, text varchar(50) not null, checked bool );
  ```

- 테스트 데이터 삽입

  ```bash
  insert into todos values(0.123442232, "todo1", false);
  ```

  &nbsp;

데이터베이스와 테스트 데이터를 미리 하나씩 만들어 놓고 시작했다.
&nbsp;

데이터베이스의 비밀번호 이름은 환경 변수로 설정했다. node.js에서 환경 변수 설정을 위해 dotenv 패키지를 이용했다. src 폴더에 server.ts 파일을 생성하고 dotenv.config() 하위에 환경 변수를 가져다 쓰는 방식으로 사용할 수 있다.

```tsx
import dotenv from "dotenv";

dotenv.config();

export const DB_PWD = process.env.DB_PWD;
export const DB_NAME = process.env.DB_NAME;
```

&nbsp;

코드상에서 mysql을 사용하기 위해 config/mysql.ts 파일을 작성했다. 자신의 데이터베이스에 대한 정보를 입력하고 연결을 위한 init 함수를 생성한다.  
참고) mysql port 번호를 알기 위해서 터미널에 mysql server status 명령어를 친 후 port 번호를 확인할 수 있다.

```tsx
import { createConnection, Connection, ConnectionOptions } from "mysql2";
import { DB_NAME, DB_PWD } from "../server";

const db_info: ConnectionOptions = {
  host: "localhost",
  port: 0,
  user: "root",
  password: DB_PWD,
  database: DB_NAME,
};

function init(): Connection {
  return createConnection(db_info);
}

export { init };
```

&nbsp;

여기까지 하면 데이터베이스 연결은 다 된 것이다. controller/todos.ts에서 사용하는 코드는 다음과 같다. mysql.ts에서 작성한 init 함수를 이용하여 connection 객체를 생성한 후 CRUD 각 상황에 맞는 query를 작성하면 된다.

```tsx
import { RequestHandler } from "express";
import { init } from "../config/mysql";
import { Connection } from "mysql2";

const connection: Connection = init();

export const createTodo: RequestHandler = (req, res, next) => {
  const text = (req.body as { text: string }).text;
  const sql = `insert into todos (id, text, checked) values(?,?,?)`;
  const params = [Math.random().toString(), text, false];
  connection.query(sql, params, (error, results) => {
    if (error) {
      throw new Error("데이터 추가 실패");
    }
    res.status(201).json({...});
  });
};

export const getTodos: RequestHandler = (req, res, next) => {
  const sql = "select * from todos";
  connection.query(sql, (error, results) => {
    if (error) {
      throw new Error("데이터 불러오기 실패");
    }
    res.status(200).json({...});
  });
};

export const updateTodo: RequestHandler<{ id: string }> = (req, res, next) => {
  const todoId = req.params.id;
  const updateText = (req.body as { text: string }).text;
  const isComplete = (req.body as { checked: boolean }).checked;

  const sql = "update todos set id=?, text=?, checked=? where id=" + todoId;
  const params = [todoId, updateText, isComplete];

  connection.query(sql, params, (error, results) => {
    if (error) {
      throw new Error("데이터 수정 실패");
    }
    res.json({...});
  });
};

export const deleteTodo: RequestHandler<{ id: string }> = (req, res, next) => {
  const todoId = req.params.id;
  const sql = "delete from todos where id=" + todoId;

  connection.query(sql, (error, results) => {
    if (error) {
      throw new Error("데이터 삭제 실패");
    }
    res.json({...});
  });
};
```

&nbsp;

서버는 이렇게 마무리했다. 프론트에서 요청 보내는 방법은 내용이 너무 길어져서 다음 포스트에 작성할 예정이다.
다음 포스트에는 redux-toolkit으로 비동기 통신을 통한 상태 관리하는 방법을 작성할 것이다.
