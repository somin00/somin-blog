---
title: "Webpack 설정"
date: "2024-01-03"
description: "타입스크립트 프로젝트에 웹팩 설정해보기"
---

이전에 작성한 코드를 es모듈을 사용하여 리팩토링했다. 지금은 코드와 파일의 양이 적어서 문제 되지 않지만 만약 실제 서비스라면 이대로 배포하면 다운로드에 소요되는 시간이 늘어나기 때문에 사용자가 불편함을 겪을 수 있다. 그래서 오늘은 코드 번들링을 위해 사용하는 도구 중 webpack을 사용해 보았다.  
&nbsp;

## 1. 패키지 다운로드

```bash
npm i -D webpack webpack-cli webpack-dev-server typescript ts-loader
```

- webpack : 코드 변환 도구
- webpack-cli : 웹팩 명령을 프로젝트에서 실행 가능하게 함
- webpack-dev-server : 빌트인 개발 서버를 마련하여 프로젝트 내부에서 웹팩을 사용하여 파일 변경을 트리거 하여 변경이 있을 시 다시 컴파일 하여 페이지 제공
- ts-loader : 웹팩 코드 타입을 타입스크립트로 지정할 수 있음  
  &nbsp;

## 2. webpack.config.js 파일 설정

웹팩은 nodejs환경을 이용하기 때문에 nodejs 구문을 사용한다.

### 개발 모드 워크플로우 → **webpack.config.js**

```jsx
const path = require("path");
module.exports = {
  mode: "development", //개발을 위한 빌드로 명시할 경우 최적화를 줄이고 디버깅을 편하게 함
  entry: "./src/app.ts", //시작 파일
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  output: {
    filename: "bundle.js", //번들링 코드를 저장할 파일 이름
    path: path.resolve(__dirname, "dist"), //dist 파일 절대 경로 생성
    publicPath: "/dist/", //webpack-dev-server를 위한 추가 구성. 출력이 어디에 작성되었는지 명시
  },
  devtool: "inline-source-map", //추출해야 하는 소스 맵이 생성될 것이라고 알림
  module: {
    //웹팩이 해야 할 일을 명시
    rules: [
      {
        test: /\.tsx?$/, //웹팩이 파일을 찾을 때마다 규칙이 적용되는 파일인지 확인하는 작업 수행
        use: "ts-loader", //찾은 파일을 타입스크립트 로더로 처리. tsconfig 파일에 설정한 구성을 가져와서 실행
        exclude: /node_modules/, //탐색에서 제외할 것
      },
    ],
  },
  resolve: {
    //찾아낸 import에 어떤 파일 확장자를 사용할지 전달. 기본값으로 .js 파일을 찾음
    extensions: [".ts", ".js"],
  },
};
```

### 프로덕션 워크플로우 → **webpack.config.prod.js**

clean-webpack-plugin을 사용하면 기존에 dist 파일에 존재하는 모든 코드를 지우고 새로운 코드를 저장할 수 있다.

```bash
npm i -D clean-webpack-plugin
```

```jsx
const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "production", //코드 최적화, 최소화 실행
  entry: "./src/app.ts",
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "none",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
```

&nbsp;

## 3. build 스크립트 설정 후 적용 확인

```bash
"start": "webpack-dev-server",
"build": "webpack --config webpack.config.prod.js"
```

webpack-dev-server를 사용할 경우 메모리에서만 번들이 생성되고 dist 파일에 생성되지 않는다. 개발 서버에서만 동작하도록 start 스크립트에 사용했다.  
&nbsp;

적용 후 개발자 도구의 소스 탭에서 확인하면 소스맵을 확인할 수 있다.  
![소스맵 {221x261}](https://github.com/somin00/drag-drop/assets/61578822/cdb3bb45-fe03-44ac-a599-51400dd06ddc)  
&nbsp;

이전에 es module로 코드를 분리했을 때는 페이지가 로드될 때 여러 파일을 받아왔지만 웹팩을 사용하면 번들링 한 파일 하나만 가져오는 것을 확인할 수 있다.  
![번들링 후 네트워크 탭 {198x100}](https://github.com/somin00/drag-drop/assets/61578822/35f6d5aa-4725-4543-9a18-ef6cbae319b9)
