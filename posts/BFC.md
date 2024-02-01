---
title: "Margin Collapsing 현상"
date: "2023-12-11"
description: "css margin collapsing 현상이 언제 나타나는지와 해결 방법"
category: "css"
---

GitHub에서 프론트엔드 관련 필수 지식에 대해 정리해놓 것을 보다가 당연하다고 생각했더 Margin Collapsing에 대해 자세하게 적어 놓은 글을 보고 잊어버리지 않기 위해 정리했다.  
&nbsp;

### Margin Collapsing 현상

두개의 마진이 겹칠 때 더 큰 마진으로 덮어 씌우는 현상이다. 좌우 방향으로는 적용되지 않고 상하 방향으로만 적용된다. Block-level 엘리먼트에 한해서 발생한다.

**발생하는 2가지 경우**

**1. 인접 엘리먼트**  
상하로 두개의 블록 레벨 엘리먼트가 존재할 때 더 큰 마진으로 적용된다.

```jsx
<div class="div1"></div>
<div class="div2"></div>
```

```css
div {
  width: 50px;
  height: 50px;
  background-color: black;
}
.div1 {
  margin-bottom: 20px;
}
.div2 {
  margin-top: 40px;
}
```

![마진 겹침 현상 {880x600}](https://github.com/somin00/somin-blog/assets/61578822/10ca0b72-b36e-49dc-8c0a-90e7670e27ad)
div1의 margin-bottom을 20으로 설정했지만 div2의 margin-top 값인 40으로 설정되었다.  
&nbsp;

**2. 부모의 처음 또는 마지막 자식**

```jsx
<div class="div1">
  <div class="div2"></div>
</div>
```

```css
div {
  width: 50px;
  height: 50px;
}
.div1 {
  margin-top: 10px;
  background-color: black;
}
.div2 {
  margin-top: 100px;
  background-color: yellow;
}
```

![마진 겹침 현상 {800x600}](https://github.com/somin00/somin-blog/assets/61578822/503848cd-5c97-48ab-915c-0869f2c3b70f)
부모 요소는 margin이 10으로 설정되어 있지만 자식 요소의 margin이 100으로 설정되어 마진 겹침 현상이 발생했다.  
&nbsp;

![마진 겹침 현상 해결 {275x191}](https://github.com/somin00/somin-blog/assets/61578822/141f2f5a-290f-4685-83fd-ab1203521556)
div1에 border를 추가해서 해결했다. border나 padding을 줘서 경계를 구분한다.  
&nbsp;

여러 경우에 마진 겹침 현상이 발생하지만 새로운 BFC(Block Formatting Context)가 생성되면 발생하지 않는다.  
&nbsp;

### BFC란?

Block Formatting Context는 블록 레벨 요소에 사용되는 CSS 비주얼 서식 모델이다.
MDN에 BFC가 생성되는 경우가 잘 설명되어 있다. 그 중 익숙하고 사용한 적이 있었던 것들만 정리했다.

- float 사용
- position:absolut/relative 등 절대 위치를 잡는 요소
- display: inline-block 적용 요소
- flex items
- grid items
