# 아이템 20. 다른 타입에는 다른 변수 사용하기

## 요약

- 타입이 다른 값을 다룰 때에는 변수를 재사용하지 않도록 하자!

---

### 문제 상황

```tsx
let id = "12-34-56";
fetchProduct(id);

id = 123456; // Type 'number' is not assignable to type 'string'.
fetchProductBySerialNumber(id);
```

- 임의적 해결 방법

  ```tsx
  let id: string | number = "12-34-56";
  fetchProduct(id);
  id = 123456;
  fetchProductBySerialNumber(id);
  ```

  - But, id를 사용할 때마다 값이 어떤 타입인지 확인해야 함
  - 따라서, 분리하는 것이 BEST

- 해결방법

  - 별도의 변수 사용

    ```tsx
    const id = "12-34-56";
    fetchProduct(id);

    const serial = 123456;
    fetchProductBySerialNumber(serial);
    ```

  ### 변수를 분리 하는 이유

  - 변수명을 더 구체적으로 지을 수 있다.(명시적인 표현 가능)
  - 타입 추론을 향상시키고, 타입 구문이 불필요해진다.
  - 타입이 간결해진다.(ex. `string | number` -> `string` or `number`)
  - let 대신 const로 변수 선언 가능

## 잠깐 JavaScript

### variable shadowing?

- 동일한 변수 이름으로 인해 바깥쪽 변수가 안쪽 변수에 의해 가려지는 현상
- 많은 개발팀에서 린터 규칙을 통해 이런 변수 사용을 금지합니다.

  - https://typescript-eslint.io/rules/no-shadow/

  ```tsx
  const id = "12-34-56";
  fetchProduct(id);
  {
    const id = 123456; // 정상 - 지역변수가 우선순위가 높기 때문에 바깥의 id 변수는 해당 블록에서 고려하지 않음
    fetchProductBySerialNumber(id); // 정상
  }

  function fetchProduct(id: string) {
    console.log(id);
  }

  function fetchProductBySerialNumber(id: number) {
    console.log(id);
  }
  ```

### Illegal Shadowing (제한 사항)

```tsx
let fruit = "apple"; // Cannot redeclare block-scoped variable 'fruit'.
let hungry = true;

if (hungry) {
  var fruit = "orange";
  console.log(fruit);
}
console.log(fruit);
```

- 두 변수 모두 같은 scope(가동범위)를 가지고 있기 때문에 오류 발생
