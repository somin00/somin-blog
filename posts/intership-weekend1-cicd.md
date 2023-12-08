---
title: "인턴십 1주차 복습 - CI/CD"
date: "2023-08-28"
description: "GitHub Actions를 이용한 CI/CD 환경 구축하기"
---

금요일 자정 Best Practice 과제 제출을 끝내고 주말은 1주 차 내용을 복습했다. 1주 차에는 eslint, prettier, husky, CI/CD를 배웠다. 과제 프로젝트 환경 설정을 담당해서 eslint, prettier, husky는 자연스럽게 복습을 하게 되어 CI/CD 내용에 더 집중했다.  
&nbsp;

### CI/CD 란?

CI(Continuous Integration)는 지속적으로 통합하는 것을 의미한다. 코드를 통합하고 코드를 테스트까지 진행하여 문제가 발생했을 때 바로 확인하고 수정할 수 있게 해준다. CD(Continuous Delivery/Deployment)는 CI과정으로 통합된 코드를 지속적으로 배포하는 것을 의미한다. CI/CD는 코드를 통합하고 테스트하고 사용자에게 배포하는 모든 과정을 한 번의 명령어 입력으로 처리할 수 있게 해준다.

클라우드형 플랫폼인 GitHub Actions는 저장소를 Public으로 설정하면 무료로 사용할 수 있다고 해서 GitHub Actions 통해 CI/CD를 구축하고, AWS S3를 통해 프로젝트 배포를 진행했다. 코드 작성은 하지 않고 CRA로 생성한 프로젝트 그대로를 이용했다.  
&nbsp;

### GitHub Actions를 이용한 CI/CD 구축

프로젝트 루트에 .github 폴더 안에 workflows 폴더를 생성하고 파일이름.yaml 파일을 생성하면 GitHub Actions에서 워크플로우를 인식하여 yaml 파일 내에서 등록한 이벤트가 발생했을 때 jobs에 지정한 명령어가 차례로 실행된다.

![cicd {362x104}](https://velog.velcdn.com/images/somin/post/972d0da0-4bed-40d8-b3e7-7a654bac9a08/image.png)

[CICD.yaml 파일]

```tsx
name: CI/CD

on:
  push:
    branches:
      - main

jobs:
  cicd:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2
        with:
          ref: "main"
      - name: Install Dependencies
        run: npm ci
      - name: Run Tests
        run: npm run test
      - name: Build Application
        run: npm run build
      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: "ap-northeast-2"
          SOURCE_DIR: "build"
```

repository → setting → secrets and variables → Actions에 추가

- AWS_S3_BUCKET: 버킷 이름
- AWS_ACCESS_KEY_ID: 액세스 키 ID
- AWS_SECRET_ACCESS_KEY: 액세스 키

세가지를 설정해주었다.  
&nbsp;

### 느낀점

코드를 수정하고 빌드 명령어를 실행하고 배포하는 과정을 설정 파일 하나만 작성하면 명령어 하나로 해결할 수 있다는 것이 신기하면서 CI/CD를 구축하는 이유를 확실하게 느꼈다. yaml 파일에서 들여 쓰기가 잘못된 경우에도 에러가 발생해서 문법 오류를 찾는 것이 어려웠다. 프로젝트 초반에 CI/CD를 구축해서 로컬 환경은 물론이고 배포 환경에서도 바로 테스트하면서 개발하면 효율적일 것 같다.
