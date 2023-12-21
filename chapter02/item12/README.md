# **아이템12. 함수 표현식에 타입 적용하기**

<hr/>

## 타입스크립트에서는 함수 표현식을 사용하는 것이 좋다!

> 참고: [함수의 문장과 표현식](#참고-함수-문장statement과-표현식expression)

### 1. 함수의 매개변수부터 반환값까지 전체를 함수 타입으로 선언하여 함수 표현식에 _재사용_ 할 수 있다는 장점이 있다.

```ts
type DiceRollFn = (sides: number) => number;
const rollDice: DiceRollFn = (sides) => {
  /* COMPRESS */ return 0; /* END */
};
```

### 2. 함수 타입의 선언은 불필요한 코드의 _반복을 줄인다_.

```ts
type BinaryFn = (a: number, b: number) => number;
const add: BinaryFn = (a, b) => a + b;
const sub: BinaryFn = (a, b) => a - b;
const mul: BinaryFn = (a, b) => a * b;
const div: BinaryFn = (a, b) => a / b;
```

### 3. 시그니처가 일치하는 다른 함수가 있을 때, 함수 표현식에 타입을 적용해보자

> 참고: [함수의 시그니처](#참고-함수-시그니처란)

#### 함수 매개 변수에 직접 타입 선언을 하는 것보다 함수 표현식 전체에 타입을 정의 하는 것이 코드도 간결하고 안전하다.

##### fetch 함수에 대한 정의

```ts
declare function fetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response>;
```

즉, fetch 함수의 시그니처는?
`fetch = (input: RequestInfo | URL, init: RequestInit | undefined) => Promise<Response>`

함수 표현식으로 작성하고 함수 전체에 타입을 적용하니까 input과 init의 타입을 타입스크립트가 자동적으로 추론

```ts
const checkedFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error("Request failed: " + response.status);
  }
  return response;
};
```

즉, checkedFetch 함수가 이미 자바스크립트에서 지원하는 내장 함수 fetch 함수의 타입(시그니처)를 참조하게 한 것

위와 같은 함수 표현식이 아닌 함수 표현식이었다면 매개변수에 각각 타입을 지정해줘야 한다.

```ts
async function checkedFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);
  if (!response.ok) {
    // Converted to a rejected Promise in an async function
    throw new Error("Request failed: " + response.status);
  }
  return response;
}
```

###### <참고> 함수 `문장(statement)`과 `표현식(expression)`

```ts
function rollDice1(sides: number): number {
  /* COMPRESS */ return 0; /* END */
} // Statement
const rollDice2 = function (sides: number): number {
  /* COMPRESS */ return 0; /* END */
}; // Expression
const rollDice3 = (sides: number): number => {
  /* COMPRESS */ return 0; /* END */
}; // Also expression
```

###### <참고> 함수 시그니처란?

함수 시그니처(Function Signature)는 함수의 타입을 의미한다. 즉, 함수 인자의 타입과 반환 값의 타입을 의미
`(x:number, y:number) => number`

<hr />

## 3줄 요약

#### 함수 선언식보다는 표현식을 쓰자!

#### 왜냐?

#### 코드가 간결하고 떠욱 안전해 진다!

## 질문
