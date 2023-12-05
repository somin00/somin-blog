---
title: "HTTP 정리"
date: "2023-12-01"
description: "HTTP가 무엇이고 어떤 특징이 있는지에 대한 학습 내용 정리"
---

학부생 때 전공 수업을 통해 네트워크에 대해 배웠지만 시간이 많이 지나 흐릿하게 남은 기억을 다시 떠올려 보고자 정리해 봤다.

## HTTP란?

HyperText Transfer Protocol의 약자로 서버-클라이언트 모델을 지키면서 웹상에서 request, response 형태로 데이터를 주고받을 수 있는 프로토콜이다. TCP/IP를 기반으로 작동한다.  
&nbsp;

**TCP/IP란?**  
TCP/IP 인터넷에서 사용하는 프로토콜 그룹을 말한다. Application, Transport, Network, Data link, Physical Layer 5개 계층이 존재한다. 전송 계층이 응용 계층 간 데이터 전송을 가능하게 한다. 전송 계층에서 사용하는 프로토콜 중 하나인 TCP는 연결형이며 신뢰성 있는 통신을 보장한다.

- TCP란?  
  Transmission Control Protocol의 약자이다. TCP 프로토콜을 이용하여 생성하는 패킷은 segment라고 한다.
  &nbsp;

  **<연결형>**  
  3-way handshake를 통해 통신하려는 두 호스트 전송 계층 사이에 논리적 연결을 구성한다. 데이터 전송을 완료하면 연결을 끊는다.  
  &nbsp;

  **<신뢰성 있는>**  
  데이터를 순서에 맞게, 오류 없이, 손실 없이, 중복 없이 전달하기 위해 오류 제어, 흐름 제어, 혼잡 제어를 실행한다. 이로 인해 신뢰성 있는 데이터 전송이 가능하다.  
  &nbsp;

- **3-way handshake란?**  
  TCP 연결 초기화를 의미한다. 클라이언트에서 SYN 패킷을 서버로 보낸 후 서버에서 ACK 패킷을 추가하여 SYN+ACK 패킷을 클라이언트로 보낸다. 클라이언트에서 받은 ACK 패킷을 서버로 보내면 TCP 연결에 성공한다.

### Request 메소드

- GET  
  데이터를 가져오기 위해 사용한다. 요청 데이터가 URL의 Query string으로 전달된다. 브라우저 기록에 남으며 캐시가 된다. 데이터가 드러나기 때문에 보안 측면에서 좋지는 않다.  
  &nbsp;

- POST  
  데이터 처리를 위해 사용한다. 요청에 필요한 데이터는 요청의 body 프로퍼티에 작성한다. 브라우저 기록이 남지 않기 때문에 캐시는 불가능하다.  
   &nbsp;

- PUT  
  데이터를 수정하기 위해 사용한다. 모든 리소스를 수정한다.

```js
//기존 데이터
const obj = {
  name: "somin",
  age: 25,
};

//PUT 요청 데이터
{
  age: 26;
}

//수정 데이터
const obj = {
  age: 26,
};
```

&nbsp;

- PATCH  
  데이터를 수정하기 위해 사용한다. 요청한 리소스만(일부만) 수정한다.

```js
//기존 데이터
const obj = {
  name: "somin",
  age: 25,
};

//PATCH 요청 데이터
{
  age: 26;
}

//수정 데이터
const obj = {
  name: "somin",
  age: 26,
};
```

&nbsp;

### status code

요청을 보낸 후 response로 오는 status code를 이용하여 후처리를 할 수 있다.

- 1xx (정보) : 요청을 받았으며 작업을 계속한다.
- 2xx (성공) : 요청을 성공적으로 수신했으며 성공적으로 처리했다.
- 3xx (리다이렉션) : 요청을 처리하기 위해 추가적인 작업이 필요하다.
- 4xx (클라이언트 오류) : 요청에 문제가 있다.
- 5xx (서버 오류) : 유효한 요청이지만 처리에 실패했다.  
  &nbsp;

**[주로 사용하는 status code]**

- 200 (Ok) : 요청 성공
- 201 (Created) : 데이터 생성 성공
- 400 (Bad Request) : 잘못된 요청
- 401 (UnAutorized) : 권한 없는 리소스에 접근
- 403 (Forbidden) : 요청 route가 존재하지 않음
- 502 (Bad Gateway) : 서버에서 예외 처리하지 못한 문제 발생
