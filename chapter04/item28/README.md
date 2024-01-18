# **아이템28. 유효한 상태만 표현하는 타입을 지향하기**

## 1. 유효한 상태

효과적으로 타입을 설계하기 위해서는, 유효한 상태만 표현할 수 있는 타입을 만들어 내는 것이 가장 중요하다.

> 유효란?
> "보람이나 효과가 있음"

프로그래밍 관점에서 살펴보면 어딘가에 사용될 수 있는 상태를 말한다.

### 1-1. 무효한 상태의 예

```ts
interface State {
  a: string;
  b: string;
  c?: string;
  d?: string;
}
```

왜 무효한 상태일까?

```ts
interface StateOne {
  a: string;
  b: string;
}

interface StateTwo {
  a: string;
  b: string;
  c: string;
}

interface StateThree {
  a: string;
  b: string;
  d: string;
}

interface StateFour {
  a: string;
  b: string;
  c: string;
  d: string;
}
```

이 중 내가 원하는 타입이 StateOne, StateTwo, StateThree 밖에 없다면 StateFour는 무효한 상태가 된다. 그러므로 상단의 State Type은 무효한 상태를 포함하기 때문에 혼란을 초래하기 쉽고 오류를 유발하게 된다.

### 1-2 무효한 상태에서 벗어나기

무효한 상태에서 벗어나기 위해서는 태그된 유니온을 사용하면 된다.

> 태그된 유니온이란?
> 특정 속성을 통해 값이 속하는 브랜치를 식별할 수 있는 유니온

아래 예시에서는 type 속성이 태그

```ts
interface StateOne {
  type: "one";
  a: string;
  b: string;
}

interface StateTwo {
  type: "two";
  a: string;
  b: string;
  c: string;
}

interface StateThree {
  type: "three";
  a: string;
  b: string;
  d: string;
}

type State = StateOne | StateTwo | StateThree;
```

이로써 State 타입은 유효한 상태만 표현하는 타입이 된다.

## 2. 웹 어플리케이션의 페이지 상태 예시

### 2-1. 무효한 상태를 포함한 상태

페이지 내용을 로드하고 화면에 표시한다.

```ts
interface State {
  pageText: string;
  isLoading: boolean;
  error?: string;
}

async function changePage(state: State, newPage: string) {
  state.isLoading = true;
  try {
    const response = await fetch(getUrlForPage(newPage));
    if (!response.ok) {
      throw new Error(`Unable to load ${newPage}: ${response.statusText}`);
    }
    const text = await response.text();
    state.isLoading = false;
    state.pageText = text;
  } catch (e) {
    state.error = "" + e;
  }
}
```

위의 코드에는 여러 문제점들이 있지만, 코어한 문제는 상태 값의 두 가지 속성이 동시에 정보가 부족하거나(요청이 실패한 것인지 여전히 로딩 중인지 알 수 없음), 두 가지 속성이 충돌(오류이면서 동시에 로딩 중일 수 있음)할 수 있다는 것이다.

### 2-2. 유효한 상태만 포함한 상태

```ts
interface RequestPending {
  state: "pending";
}

interface RequestError {
  state: "error";
  error: string;
}

interface RequestSuccess {
  state: "ok";
  pageText: string;
}

type RequestState = RequestPending | RequestError | RequestSuccess;

interface State {
  currentPage: string;
  requests: { [page: string]: RequestState };
}
```

위의 타입을 사용한 changePage 함수는 다음과 같다.

```ts
async function changePage(state: State, newPage: string) {
  state.requests[newPage] = { state: "pending" }; // pending 상태로 변경
  state.currentPage = newPage;

  try {
    const response = await fetch(getUrlForPage(newPage));
    if (!response.ok) {
      throw new Error(`Error: 에러 발생`);
    }
    const pageText = await response.text();
    state.requests[newPage] = { state: "ok", pageText }; // ok 상태로 변경
  } catch (error) {
    state.requests[newPage] = { state: "error", error: String(error) }; // error 상태로 변경
  }
}
```

changePage 함수 내에서 state 의 값에 따라 상태가 바뀌는 것을 볼 수 있다. 더 이상 불필요한 상태인 무효한 상태를 포함하지 않게 된다.

## ⭐️ 3줄 요약

### 1. 유효한 상태만 표현하는 타입을 지향하자. 코드가 길어지거나 표현하기 어렵지만 결국은 시간을 절약하고 고통을 줄인다.

### 2. 유효한 상태와 무효한 상태를 둘 다 표현하는 타입은 혼란을 초래하기 쉽고 오류를 유발한다.

### 3. 즉, 타입을 설계할 때, 어떤 값들을 포함하고 어떤 값들을 제외할지 신중하게 결정해야 한다.
