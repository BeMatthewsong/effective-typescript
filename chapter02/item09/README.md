# 아이템 9. 타입 단언보다는 타입 선언을 사용하기

### 1. 타입 단언은 오류를 발견하지 못함

```ts
interface Person {
  name: string;
}
const alice: Person = {}; // Property 'name' is missing in type '{}' but required in type 'Person'.
const bob = {} as Person; // 에러 발견 못함

const alice: Person = {
  name: "Alice",
  occupation: "TypeScript developer",
}; // Object literal may only specify known properties, and 'occupation' does not exist in type 'Person'.

const bob = {
  name: "Bob",
  occupation: "JavaScript developer",
} as Person; // 에러 발견 못함
```

### 2. 화살표 함수에서의 타입 명시

```ts
interface Person {
  name: string;
}
const people1 = ["alice", "bob", "jan"].map((name) => ({} as Person)); // 에러 발견 못함

const people2 = ["alice", "bob", "jan"].map((name): Person => ({ name })); // Type은 Person[]
```

- 함수 호출 체이닝이 연속된 부분은 `체이닝 시작(위의 예제에서 name)`에서부터 타입을 설정하여 정확한 곳에 오류를 표시 가능

### 3. 타입 단언이 꼭 필요한 경우

1. 타입 체커가 제시하는 타입보다 개발자가 지정하는 타입이 정확할 때

- Example) DOM Element에 접근할 때(이유: TS는 DOM에 접근 불가)

  ```ts
  document.querySelector("#myButton").addEventListener("click", (e) => {
    e.currentTarget; // 타입은 EventTarget

    // 타입은 HTMLButtonElement
    const button = e.currentTarget as HTMLButtonElement;
  });
  ```

2. `!` 문법을 사용하여 `null`이 아님을 단언할 때

   ```ts
   // 타입은 HTMLElement | null
   const elNull = document.getElementById("foo");

   // 타입은 HTMLElement
   const el = document.getElementById("foo")!;
   ```

   - 접미사로 쓰이는 `!`는 단언문이므로 컴파일 과정 중에 제거된다.
   - **`하지만!`** null이 서브타입으로 존재하지 않으면 사용할 수 없다.

   ```ts
   interface Person {
     name: string;
   }
   const body = document.body;
   const el = body as Person; // Error 발생 - Person과 HTMLElment는 서로의 서브타입이 아니기 때문에 변환 불가
   ```

   - 이런 경우는 어떻게 해결을 할까??
     #### unkown 사용
     - 모든 타입은 unknown의 서브타입이기 때문에 unknown이 포함된 단언문은 항상 동작
     - 하지만 unknown을 사용하는 것은 피하자!(위험한 동작이다)
     ```ts
     interface Person {
       name: string;
     }
     const el = document.body as unknown as Person; // 정상
     ```

## Qustions

### Q1.

    p.55 그러나 함수 호출 체이닝이 연속되는 곳에서 체이닝 시작에서부터 명명된 타입을 가져야 한다.

이 말에서 체이닝에 들어가는 콜백함수에서의 매개변수의 타입을 명시하라는 의미로 이해하면 되나요?

### A.

넵~ 화살표 함수에서 타입 추론이 좀 더 넓은 범위의 집합으로 추론될 때가 있어서,
명확하게 정의된 타입 또는 리터럴을 사용하여 범위를 한정시켜주는 게 타입 추론에 도움이 된다는 의미인 것 같습니다
