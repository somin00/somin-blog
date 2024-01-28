---
title: "알고리즘 공부하기 - 분할 정복"
date: "2024-01-28"
description: "분할 정복의 종류인 합병 정렬과 퀵 정렬 학습 내용 정리"
---

프로젝트에만 집중해서 그동안 알고리즘 공부에 소홀했던 것 같아 학부생 때는 시험 기간 빼고 보지 않던 알고리즘 책을 꺼냈다🤣 오랜만에 봐서 알고리즘 핵심 내용 외에는 무슨 내용인지 눈에 들어오지 않았지만... 지금 당장 나에게 필요한 내용들만 집중해서 공부했다!  
&nbsp;

### 분할 정복

분할 정복이란 문제의 입력 사례를 두 개 이상의 작은 입력 사례로 분할하여 작은 입력 사례의 답으로부터 전체 입력 사례의 답을 구하는 하향식 문제 풀이 방식이다.  
&nbsp;

**분할 정복을 이용한 알고리즘의 종류**

- 이분 탐색
- 합병 정렬
- 퀵 정렬
- 쉬트라쎈의 행렬 곱셈
- 큰 정수 계산법  
  &nbsp;

이 중에서 많이 사용되는 합병 정렬과 퀵 정렬에 대해 정리했다.
&nbsp;

### Merge Sort

합병 정렬은 두 개의 함수로 구현한다. 반으로 나누어주는 mergeSort와 나눈 데이터로 새로운 데이터를 만들어주는 함수인 merge 두 개가 필요하다.

```js
function merge(left, right) {
  const sortedArr = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) {
      sortedArr.push(left.shift());
    } else {
      sortedArr.push(right.shift());
    }
  }

  return [...sortedArr, ...left, ...right];
}

function mergeSort(arr) {
  if (arr.length === 1) return arr;
  const mid = Math.ceil(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  return merge(mergeSort(left), mergeSort(right));
}
```

합병 정렬은 merge 함수에서 새롭게 만들어진 배열을 저장하는 추가적인 메모리가 필요하다는 특징이 있다.

&nbsp;

### Quick Sort

pviot이라는 하나의 중심 축을 정하고 중심축보다 작은 것은 왼쪽으로 큰 것은 오른쪽으로 정렬하는 것이다.
나누어진 왼쪽과 오른쪽으로 다시 재귀를 실행하면 정렬이 된다.

```js
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[0];
  const left = [];
  const right = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] <= pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }

  const leftSort = quickSort(left);
  const rightSort = quickSort(right);

  return [...leftSort, pivot, ...rightSort];
}
```

퀵 정렬은 원소들 중 같은 값이 있는 경우에 처음 순서와 달라질 수 있다는 점에서 unstable 하다고 한다.  
&nbsp;

### MergeSort와 QuickSort 중 어느 것을 사용해야 할까?

mergeSort의 시간 복잡도는 O(nlogn)이고, quickSort는 O(n²)이다. 하지만 quickSort의 평균 시간 복잡도는 O(nlogn)으로 mergeSort와 같다.
mergeSort 정렬된 상태일 때 사용하는 것이 좋고, quickSort는 메모리 사용이 적고 데이터의 이동이 mergeSort에 비해 적다는 점을 기억하고 사용하면 좋을 것 같다.
