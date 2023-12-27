# 아이템 16. number 인덱스 시그니처보다는 Array, 튜플, ArrayLink를 사용하기

## 요약

- number 인덱스 시그니처보다는 Array, 튜플, ArrayLike를 사용하자

## 용어집

- **`인덱스 시그니처`**: `[Key: T]: U` 형식으로 객체가 여러 Key를 가질 수 있으며, Key와 매핑되는 Value를 가지는 경우 사용

- **`튜플`**: 서로 다른 타입을 함께 가질 수 있는 배열
  ```tsx
  const person: [string, number] = ["kim", 23];
  const foods: [string, string] = ["pizza", "noodle"];
  ```

### JS는 number type 접근 불가

- JS에서의 객체는 `key-value` 형태를 가지고 있으며 `key`는 **string** or **Symbol** Type만 가능

  ```jsx
  const array = [1, 2, 3];

  array[0];
  array[1];
  array[2];
  ```

- 해당 코드가 오류가 나지 않는 이유는 JS 엔진에서 자동으로 string 타입으로 **형변환**함
- TypeScript는 JS의 타입 혼란을 바로잡기 위해 숫자 키를 허용하고, 문자열 키와 다른 것으로 인식함
- 하지만 런타임때는 문자열 키로 인식함. ⇒ 타입 체크 시점에서 오류를 잡음.

```tsx
function get<T>(array: T[], k: string): T {
  return array[k]; // 오류 발생 - Element implicitly has an 'any' type because index expression is not of type 'number'.
}

const xs = [1, 2, 3];
const xTest: string = "1";
const x0 = xs[0];
const x1 = xs["1"]; // 정상 작동.. 왜???
const x2 = xs[xTest]; // Element implicitly has an 'any' type because index expression is not of type 'number'.
```

### number 인덱스 시그니처를 말고 대체재는?

- Array, ArrayLike 사용

```tsx
const tupleLink: ArrayLike<string> = {
  "0": "A",
  "1": "B",
  length: 2,
}; // 정상
```
