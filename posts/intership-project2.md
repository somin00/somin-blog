---
title: "인턴십 프로젝트 2주차 - GitHub REST API 사용하기"
date: "2023-09-25"
description: "GitHub REST API를 이용하여 이슈 목록 렌더링하기"
category: "인턴십 프로젝트"
---

1주 차 프로젝트는 사전 과제를 기반으로 팀 과제를 진행해서 조금 여유로웠기 때문에 블로그에 바로 정리할 수 있었다. 2주 차부터는 개인적으로 과제를 하고 팀끼리 Best Practice를 도출하는 것을 4일 동안 진행해야 해서 정리할 정신이 없었다🥲 개인적으로도 진행 상황을 꾸준히 기록했고 팀 과제도 회의록과 리드미 정리를 해놓은 덕분에 프로젝트 진행을 어떻게 했는지 생생하게 기억난다. 문서 작성의 중요성을 다시 한번 느꼈다👍🏻

우리 팀은 개인적으로 과제를 진행하고 그중 가장 완성도 있고 개선하기 편한 코드를 투표해서 뽑은 후 Best Practice를 만드는 방식으로 진행한다. 이번 주엔 내 코드가 뽑혔다!!! ✨ 뽑혔지만 수정할 것은 정말 많았다..🥲 오늘은 개인 과제에서 개선이 필요했던 부분들을 기록해 보았다.  
&nbsp;

### 2주차 과제 : GitHub REST API를 이용하여 특정 레포지토리 이슈 목록 보여주기

[**GitHub REST API document 바로가기**](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28)

[**개인 과제 GitHub 바로가기**](https://github.com/somin00/pre-onboarding-12th-2-14)

[**팀 과제 GitHub 바로가기**](https://github.com/WANTED-TEAM14/pre-onboarding-12th-2-14)  
&nbsp;

### 개선이 필요했던 부분

1. 이슈 목록 API 요청

   ```jsx
   const axiosIstance = axios.create({
     baseURL: BASE_URL,
   });

   axiosIstance.interceptors.request.use((config) => {
     config.headers.Authorization = `Bearer ${TOKEN}`;
     return config;
   });

   //이슈 목록 요청
   export const getIssues = async (page: number) => {
     const data = await axiosIstance.get(url);
     return data.data;
   };

   //선택한 이슈에 대한 상세 내용 요청
   export const getIssueDetail = async (issueNumber: number) => {
     const data = await axiosIstance(`${BASE_URL}/${issueNumber}`);
     return data.data;
   };
   ```

   개인 과제에서 작성한 코드이다. 여기서 선택한 이슈 상세 내용을 가져오는 API 요청은 Link의 state로 전달할 수 있기 때문에 불필요한 요청이라고 생각했다. getIssueDetail을 제거하면 axios 인스턴스를 생성하고 interceptor를 설정할 이유도 없어서 많은 코드를 줄일 수 있다.

   팀 과제에서는 axios 대신 Octokit을 사용했다.  
   &nbsp;

2. 무한 스크롤

   처음 구현해 본 기능이라 완성도가 낮았다. 제대로 구현해 보고 싶어서 팀 과제에서 무한 스크롤 부분을 맡아 개선했다.  
   &nbsp;

   (1) 스크롤 감지

   개선 전 코드

   ```jsx
   {
     issueList.map((issue, idx) => {
       return (
         <li key={issue.number}>
           <IssueItem {...issue} errorMessage={errorMessage} />
           {isAdvertisementCell(idx) && <Advertisement />}
         </li>
       );
     });
   }
   <div ref={targetRef}></div>;
   ```

   스크롤 감지를 위한 ref 적용을 content가 없는 div 태그에 하는 방식으로 코드를 작성했다.  
   &nbsp;

   개선 후 코드

   ```jsx
   {
     issueList.map((issue, idx) => {
       return (
         <li key={issue.number} ref={checkIsLastIssue(idx) ? targetRef : null}>
           <IssueItem {...issue} errorMessage={errorMessage} />
           {isAdvertisementCell(idx) && <Advertisement />}
         </li>
       );
     });
   }
   ```

   이슈 리스트의 마지막 요소가 스크롤을 감지하면 되기 때문에 마지막 요소에 ref를 적용하는 방식으로 수정했다.  
   &nbsp;

   (2) 무한스크롤 로딩 처리

   스크롤 감지가 되지 않는 상태에서 계속 ‘데이터 로딩 중’ 문구가 띄워져있었다. 개발자 도구의 요소 탭에서 확인하기 전까지는 로딩 true로 유지하고 있는 것을 몰랐다.. 정말 치명적인 실수를 할 뻔했다🥲

   스크롤을 감지했을 때 page 변수를 +1하고 변한 page 값으로 api 요청하는 방식으로 작동한다.

   ```jsx
   `${BASE_URL}?state=open&sort=comments&direction=desc&page=${page}&per_page=10`,
   ```

   그래서 데이터 페칭하는 부분에서 로딩 상태를 변경했다. 처음엔 finally 부분을 작성하지 않아서 로딩 상태가 변경되지 않았던 것이다. finally 부분 코드를 추가해 요청이 끝날 때마다 로딩 상태를 비활성화하는 방법으로 해결했다.

   ```jsx
   const fetchIssues = useCallback(async () => {
     try {
       setLoading(true); //로딩 활성화
       const data = await getIssues(currentNum);
       setIssueList((prev) => {
         return [...prev, ...data];
       });
     } catch (e) {
       setIsShowError(true);
     } finally {
       setLoading(false); //로딩 비활성화
     }
   }, [currentNum]);
   ```

   &nbsp;

3. 에러 처리

   에러 페이지 문구를 사용자 관점에서 알기 쉽게 수정이 필요하다.  
   &nbsp;

4. 매직 넘버 사용 줄이기

   매직 넘버는 변수에 저장하지 않고 직접 사용하는 숫자 값이다. 읽는 사람이 보기에 숫자의 의미가 명확하지 않고 사용 이유를 알 수 없다.  
   &nbsp;

3, 4번은 기능 구현에 집중하느라 당연한 것임에도 불구하고 신경 쓰지 못했다. 다음 과제에서는 개선하여 더 좋은 코드를 할 수 있도록 노력해야겠다.
