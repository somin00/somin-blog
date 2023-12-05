---
title: "인턴십 프로젝트 3주차 - 디바운싱, 로컬캐싱"
date: "2023-10-05"
description: "API 호출에 대한 디바운싱, 로컬 캐싱 기능 구현 기록"
isFeatured: false
---

3주 차 과제도 역시 개인 과제를 하고 Best Practice를 도출하는 방식으로 진행했다. 구현해야 할 기능은 사용자가 입력한 검색어에 맞는 추천 검색어 보여주기이다. 기능 요구 사항 중 API 호출 횟수 줄이기, API 호출별 로컬 캐싱 구현하기에 대해 구현 방법과 개선 방법을 정리해 보았다.  
&nbsp;

### 3주차 과제 GitHub

[**개인 레포지토리 바로가기**](https://github.com/somin00/pre-onboarding-12th-3-14)

[**팀 레포지토리 바로가기**](https://github.com/WANTED-TEAM14/pre-onboarding-12th-3-14)  
&nbsp;

### 구현 방법 및 개선 방법

**1. API 호출 횟수 줄이기**

기능 구현을 위해 디바운싱 방법을 적용했다. 사용자의 입력이 언제 끝날지 모르기 때문에 연속적으로 발생하는 이벤트 중 마지막 이벤트를 감시하는 것이 적합하다고 판단했다.

사용자가 입력하는 값을 디바운싱 하는 코드이다. useDebounce 훅으로 분리하여 작성했다. 이벤트가 감지될 때마다 함수를 호출하지 않고 DELAY_TIME마다 호출하는 방식이다.

```jsx
import { DELAY_TIME } from "constants/debounceConfig";

import { useEffect, useState } from "react";

function useDebounce(value: string) {
  const [debouncedValue, setDebouncedValue] = useState < string > value;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedValue(value);
    }, DELAY_TIME);

    return () => clearTimeout(debounceTimer);
  }, [value]);

  return debouncedValue;
}

export default useDebounce;
```

이렇게 작성했을 경우 문제점에 대해 멘토님께 피드백을 받았다.

1. 사용자가 입력한 state를 기반으로 debounce 하는 또 다른 state를 만들기 때문에 비효율적이다.
2. debounce value를 만드는 것이 아닌 사용자 입력에 따라 함수를 호출하는 기능 자체를 debounce 하는 것이 옳다. → 함수 자체를 debounce 처리하자.

```jsx
export const debounce = (callback, delay) => {
  let timeoutId;

  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};
```

callback 매개변수 자리에 검색어 처리를 담당하는 함수들을 인자로 전달하는 방식으로 개선할 수 있다. 개선 코드는 멘토님이 작성해 주신 코드를 따라 작성해 본 것이다. 타입스크립트로 작성해 주셨지만 아직 타입스크립트 지식이 부족해서 자바스크립트로 작성했다..🥲

디바운싱 기능을 구현해 본 경험도 적고 값을 디바운싱하는 방식만 생각해 봤지 함수를 디바운싱할 생각은 못 했다는 것이 아쉽다. 구현해 봤던 기능이라도 새롭고 다양한 사고로 접근하려고 노력해야겠다👊🏻  
&nbsp;

**2. API 호출별 캐싱 구현**

로컬 캐싱은 Cache Storage API를 이용해서 구현했다. 로컬 스토리지와 세션 스토리지는 5MB 크기의 문자열만 저장 가능하기 때문에 Cache Storage API 사용했다.

Cache Storage 사용 참고 링크: [https://web.dev/i18n/ko/cache-api-quick-guide/#캐시-생성-및-열기](https://web.dev/i18n/ko/cache-api-quick-guide/#%EC%BA%90%EC%8B%9C-%EC%83%9D%EC%84%B1-%EB%B0%8F-%EC%97%B4%EA%B8%B0)  
&nbsp;

개인 과제에서 진행한 방식으로는 단어별로 캐시 저장 공간을 만들어서 저장하는 방식으로 구현했다.

```jsx
export const getSearchWords = async (debouncedValue: string) => {
  try {
    const cacheName = `cache_${debouncedValue}`;
    const queryUrl = `${BASE_URL}?q=${debouncedValue}`;

    const cachedData = await getCachedData(cacheName, queryUrl);
  } catch (e) {
    //생략
  }
};
```

![cache {204x97}](https://github.com/somin00/next-blog/assets/61578822/f3dafe6c-6fb0-48d3-85c8-c02ae33f1723)
&nbsp;

Best Practice 도출 시 API base url을 캐시 이름으로 설정하여 저장 공간은 하나만 만들고 그 안에 단어 별로 저장하는 방식으로 수정하였다.

```jsx
export const getRecommendedKeywords = async (keyword: string) => {
  try {
    const queryUrl = `${BASE_URL}?q=${keyword}`;

    const cachedData = await getCachedData(CACHE_STORAGE, queryUrl);

    return data;
  } catch (e) {
    //생략
  }
};
```

![localcaching {658x61}](https://github.com/somin00/next-blog/assets/61578822/7b718bae-90f5-4ab3-a2f4-a98cfab9d413)

코드 상으로 차이는 거의 없지만 수정한 방식이 캐시 저장 현황을 더 알기 쉽다는 장점이 있어서 수정했다.
