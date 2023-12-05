---
title: "인턴십 프로젝트 1주차 - 프로젝트 환경 설정"
date: "2023-08-24"
description: "원티드 프론트엔드 인턴십 1주차 프로젝트 환경 설정하기"
isFeatured: false
---
7월 말- 8월 초 원티드 프론트엔드 인턴십에 지원했다. 사전 과제를 제출하고 선발된 인원에 한하여 참여할 수는 인턴십이다. 6월에 지원했다가 떨어져서 또 지원을 해도 괜찮을까 고민하다가 약 한달 반동안 공부한 내용으로 열심히 해보자! 하는 마음으로 사전과제를 시작했다. 1차 제출 기한을 맞춰 제출하기 위해 조금 빠듯하게 진행해서 디테일한 부분은 신경쓰지 못한 것이 아쉽다. 하지만 결과는 합격이다!!!☺️ 

사전 과제 github 링크 : https://github.com/somin00/wanted-pre-onboarding-frontend

첫 세션 후 바로 멘토님의 과제가 주어졌다. 첫 팀프로젝트는 각 팀원이 제출한 사전과제 코드에서 각 기능의 Best Practice를 선정하여 하나의 프로젝트를 만드는 것이다.
진행 방식은 전체적으로 봤을 때의 Best Practice를 뽑고 개선할 부분의 Best Practice를 합치는 방식으로 결정했다. 대략적으로 논의한 후 구현할 부분을 정했다. 나는 프로젝트 초기 설정을 맡았다. 첫 세션에서 배웠던 내용을 바탕으로 eslint, prettier, husky를 추가하기로 했다.  
&nbsp; 

### Eslint import 정렬 설정하기
eslint 옵션 논의 중에 한 팀원 분의 의견으로 import 정렬하는 설정을 추가하게 되었다. eslint 설정에 가장 많은 시간을 투자해서 정리해보았다.

[ import 정렬 기준 ]

1. 내장 모듈 최상위에 위치
2. react, react-dom, react-router-dom과 같은 라이브러리를 다른 라이브러리보다 상위에 위치
3. ts, tsx 모듈은 외부 라이브러리 아래에 위치
4. 상대 경로가 절대 경로보다 아래에 위치  
&nbsp; 

### 1. groups

```tsx
"groups": [
          "builtin", // builtin 모듈
          "external", // external 모듈
          "internal", // internal 모듈
          "parent", // 상위 경로에 있는 모듈
          "sibling", // 동일 경로에 있는 모듈
          "index", // 현재 경로 index 파일
          "object", // object import
          "type" // type import
        ],
```  
&nbsp; 

### 2. pathGroups

external 모듈 중 react, react-dom과 같은 라이브러리가 상위에 오도록 지정하는 옵션이다.

```json
"pathGroups": [
  { "pattern": "react", "group": "builtin", "position": "after" },
  { "pattern": "react-dom", "group": "builtin", "position": "after" }
]
```

builtin 뒤, 다른 모든 external 보다 앞에 위치하도록 한다.

- **pathGroupsExcludedImportTypes**
    
    기본적으로 적용되는 import 정렬 방식으로 인해 pathGroups에서 설정 했음에도 불구하고 적용되지 않는 옵션들을 위해 사용한다.
    
    ```tsx
    "pathGroupsExcludedImportTypes": ["react", "react-dom"]
    ```  
    &nbsp; 

### 3. 알파벳 순서 정렬

```json
"alphabetize": {
  "order": "asc", // 알파벳 순서 정렬 방식
  "caseInsensitive": true // 알파벳 대소문자 구분
}
```  
&nbsp; 

### 4. 개행

```tsx
"newlines-between": "always"
```

- ignore: 개행 규칙을 적용하지 않는다.
- always: group과 group 사이마다 개행을 적용한다. (group내부에서는 개행을 적용하지 않는다.)
- always-and-inside-groups: group과 group 사이, group 내부에서 개행을 적용한다.
- never: group과 group 사이 개행을 적용하지 않는다.  
&nbsp; 

### 느낀점

이미 작성한 코드에 lint나 prettier를 적용해서 에러나 경고가 많이 발생했다. 초기 설정이 왜 중요한지를 느낄 수 있었다. 이번 기회에 많은 옵션을 공부할 수 있었다. 다른 프로젝트를 진행할 때에도 lint나 prettier를 설정했지만 적용되지 않은 상태로 커밋하고 푸쉬하는 경우가 종종 있었다. husky를 처음으로 적용해봤는데 팀 프로젝트 컨벤션을 지키기에 정말 좋은 도구인 것 같다.