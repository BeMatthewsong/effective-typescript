# 아이템 54 객체를 순회하는 노하우

### 요약

- 객체를 순회할 때, 키가 어떤 타입인지 정확히 파악하고 있다면 `let k: keyof T`와 `for-in loop`를 사용합시다.
- 객체를 순회하며 키와 값을 얻는 가장 일반적인 방법은 `Object.entries`입니다.

---

### 문제 상황

```tsx
const obj = {
  one: "uno",
  two: "dos",
  three: "tres",
};

for (const k in obj) {
  const v = obj[k]; // k의 타입은 string, obj에는 3개의 키만 존재하므로 추론에 오류가 발생
}
```

#### `Question`. k 타입을 **string**으로 추론하는 이유는 무엇일까??

#### `Answer`. one, two, three 외에 다른 속성이 존재 가능 --> 타입스크립트는 obj의 키를 string 타입으로 추론!

### 해결 방법

```tsx
// 방법 1. 구체적으로 명시(키가 정확히 어떤 타입인지 정확히 알고 있으면 쓰자!)
const obj = {
  one: "uno",
  two: "dos",
  three: "tres",
};

let k: keyof typeof obj;
for (k in obj) {
  const v = obj[k];
}
```

- 객체의 구조가 고정되어 있고, 명시적으로 정의된 타입을 사용해야 하는 경우 추천
- 객체의 속성이 변경되면 유지보수 측면에서 번거롭다.

```tsx
// 방법 2. entries를 이용하여 key와 value값 접근 가능
interface ABC {
  a: string;
  b: string;
  c: string;
}
function foo(abc: ABC) {
  for (const [k, v] of Object.entries(abc)) {
    console.log(k, v);
  }
}
```

- 객체의 구조가 동적으로 변할 수 있고, 유연한 코드가 필요할 때 추천
