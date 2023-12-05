---
title: "NextAuth를 이용한 로그인, 로그아웃 구현하기"
date: "2023-11-17"
description: "NextAuth를 이용한 로그인, 로그아웃, 리디렉션 기능 구현 내용 정리"
---

next-auth를 이용하여 회원가입, 로그인, 로그아웃 등 사용자 인증 관련 기능 구현을 해보았다.  
&nbsp;

### 로그인

&nbsp;

**[동적 API route 구성하기]**

Next.js의 동적 API route를 사용한다. 경로는 pages/api/auth/[…nextauth].js catch-all 라우트 방식으로 작성하면 된다. next-auth에서 제공하는 Provider 중 Credentials Provider를 사용한다. 로그인에 필요한 정보들을 직접 구성하여 구현할 수 있다.

(next-auth는 Oauth, Email, Credentials 세가지를 제공한다.)

```jsx
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  session: { jwt: true },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        //인증 관련 코드 작성
    }),
  ],
});
```

credentials(로그인에 필요한 정보)로 email, password를 지정했다. 데이터베이스에서 일치하는 email이 있는지 찾고 일치하는 경우 비밀번호 일치 여부를 판단하는 로직으로 로그인을 처리했다.

이때, 비밀번호는 암호화하기 때문에 bcryptjs에서 제공하는 compare 함수를 이용하여 일치 여부를 판단해야 한다.  
&nbsp;

**[로그인 요청 보내기]**

사용자가 로그인 버튼을 클릭했을 때는 next-auth/client에서 제공하는 signIn 함수를 사용한다.

```jsx
const result = await signIn("credentials", { redirect: false, email, password });
```

&nbsp;

**[로그인 상태 확인하기]**

```jsx
const [session, loading] = useSession();
```

useSession 훅을 사용하여 쿠키에 있는 session 정보를 가져올 수 있다. 클라이언트에서만 작동한다.

&nbsp;

### 로그아웃

next-auth/client에서 제공하는 signOut 함수를 사용한다.

&nbsp;

### 라우트 보호

**[클라이언트 코드로 리디렉션]**

useSession을 사용하면 로딩 상태에서 session이 없는 상태와 페이지 로드는 완료했지만 인증하지 않아서 session이 없는 상태를 구분하지 못해서 next-auth/client에서 제공하는 getSession을 사용해서 해결했다.

```jsx
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  getSession().then((session) => {
    if (!session) {
      window.location.href = "원하는 경로";
    } else {
      setIsLoading(false);
    }
  });
}, []);
```

위와 같은 방식으로 로그인하지 않은 사용자를 다른 페이지로 이동시킨다.  
&nbsp;

**🥲 아쉬운점**

클라이언트 코드상에서 리디렉션을 구현하면 한번 렌더링 된 이후에 사용자의 로그인 여부를 판단한다. 한번 렌더링 하기 때문에 리디렉션 전 로딩 상태에 렌더링 하는 페이지가 사용자에게 보인다.

→ 서버에서 리디렉션 처리를 하면 해결할 수 있다!  
&nbsp;

**[서버 코드로 리디렉션]**

리디렉션을 설정하고자 하는 페이지에 getServerSideProps로 기능을 구현한다. 페이지에 접근할 때마다 로그인 상태를 알아야 하기 때문에 getStaticProps가 아닌 getServerSideProps를 사용했다.

```jsx
export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false, //리디렉션 임시로 설정
      },
    };
  }
  return {
    props: { session },
  };
};
```

로그인하지 않은 상태일 경우 해당 페이지에는 접근조차 되지 않으며 auth 페이지로 리디렉션된다.

&nbsp;

**NEXT_URL 설정하기**

개발 환경에서 실행했을 때 로그인 페이지 라우트가 작동하지 않는 문제가 있었다. 여러 번 클릭해도 페이지가 이동하지 않고 화면에 아무런 변화가 없었고 몇 분 후 "localhost에서 리디렉션한 횟수가 너무 많습니다"라는 문구가 떴다🥲 브라우저에서만 화면을 보고 있었는데 코드 에디터 터미널에선 이미 경고 문구가 계속 뜨고 있었다..😅

```js
[next - auth][warn][NEXTAUTH_URL];
```

검색 결과 경고 그대로 NEXTAUTH_URL 환경 변수를 설정하지 않아서 발생한 문제였다. NEXTAUTH_URL은 Next.js가 실행될 URL을 의미한다.
.env.local 파일에 환경 변수를 설정하고 바로 해결할 수 있었다.
