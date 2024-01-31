# [아이템 42] 모르는 타입의 값에는 any 대신 unknown을 사용하기

> 값의 타입을 모르는 경우에는 any 대신 unknown을 사용하는 것이 더 안전하다.

## unknown vs. any

`unknown이` `any`보다 안전한 이유에 대해 알려면 `any`가 타입 시스템에서 어떻게 동작하는지 알아야 한다. `any`가 강력하고 위험한 이유는 다음 두 가지 특징에서 비롯된다.

1. 어떠한 타입이든 `any` 타입에 할당 가능하다.
2. `any` 타입은 어떠한 타입으로도 할당 가능하다.

그러나 이러한 특징들은 타입스크립트의 타입은 값의 집합이라는 정의에서 어긋난다. 어떠한 집합이 모든 집합의 상위집합이면서 부분집합일 수 없기에 `any`는 타입 체커를 무용지물로 만드는 강력하고 위험한 타입이다.

반면 unknown은 `any`와 비슷하면서 타입 시스템에 부합하는 타입이다. unknown 타입은 위에서 언급한 첫 번째 속성은 만족하지만 두 번째 속성은 만족하지 않는다. 즉 타입 체커가 올바르게 동작하므로 `any` 보다 위험성이 낮다고 할 수 있다.

## 여러가지 상황에서의 unknown

### 함수의 반환값과 관련된 unknown

```ts
function parse(body: string): any {
  ...
}

const book = parse(`
  book: Effective Typescript
  author: O'Reilly
`)

console.log(book.title); // 오류 X, 런타임에 경고
book('read'); // 오류 X, 런타임에 예외 발생


function safeParse(body: string): unknown {
  ...
}

const book = safeParse(`
  book: Effective Typescript
  author: O'Reilly
`)

console.log(book.title);
//          ~~~~ 개체가 'unknown' 형식입니다.
book('read');
// ~~~~~~~~~ 개체가 'unknown' 형식입니다.
```

### 변수 선언과 관련된 unknown

값이 있지만 타입을 모를 때 `unknown을` 사용한다. 이때 타입 단언문 또는 타입 가드를 활용하여 원하는 타입으로 변환할 수 있다.

```ts
function f1(val: unknown) {
  if (val instanceof Date) {
    val; // 타입이 Date
  }
}
```

### 단언문과 관련된 unknown

이중 단언문에서 `unknown`을 사용할 수 있다.

아래 예시에서 `barAny`와 `barUnk`는 기능적으로 동이하지만, 두 개의 단언문을 분리하는 방향으로 코드를 수정할 경우 `any`는 그 영향이 다른 코드로도 번지게 된다. 그러나 `unknown`은 바로 오류를 발생시키기에 더 안전하다.

```ts
declare const foo: Foo;
let barAny = foo as any as Bar;
let barUnk = foo as unknown as Bar;
```

## {}, object, unknown

- {}: `null`과 `undefined`을 제외한 모든 값
- object: 모든 비기본형 타입 (객체 또는 배열)

`unknown` 타입이 나오기 전에는 `{}`가 일반적으로 사용되었지만, 최근에는 `{}` 대신 `unknown`을 주로 사용한다.
