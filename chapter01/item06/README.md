# 아이템 06. 편집기를 사용하여 타입 시스텝 탐색하기

## 편집기를 활용하여 타입스크립트의 타입 추론 이해하기

타입스크립트는 기본적으로 타입 추론을 굉장히 잘해주는데, 편집기를 활용하면 타입스크립트가 언제 타입 추론을 수행하는지에 대한 개념을 쉽게 익힐 수 있다.
대부분의 편집기의 경우 심벌 위에 마우스 커서를 올리면 타입스크립트가 해당 타입을 어떻게 판단하고 있는지 확인할 수 있다.

```typescript
let num = 10;
//  [let num: number]
```

이러한 기능을 이용하여 특정 시점에 타입스크립트가 값의 타입을 어떻게 이해하고 있는지 살펴봄으로써 타입 넓히기와 좁히기의 개념을 잡을 수 있다.

```typescript
function printMessage(message: string | null) {
  if (message) {
    console.log(message);
    // [(parameter) message: string]
  }
}

const foo = {
  x: [1, 2, 3],
  // [(property x: number[])]
  bar: {
    name: 'Daniel',
  },
};
```

## 타입스크립트의 타입 선언 파일 찾아보기

편집기는 `Go to Definition` 옵션을 제공한다. 이를 활용하여 타입스크립트가 타입들을 어떻게 선언하고 있는지 탐색할 수 있다.
<br/>
아래의 예시에서 `fetch` 함수에 대해 더 알아보고 싶다고 하자. 그럴 경우 `Go to Definition` 옵션을 통해 타입스크립트에 포함되어 있는 DOM 타입 선언인 `lib.dom.d.ts` 파일에서 `fetch` 함수에 대한 자세한 타입 선언을 확인할 수 있다. 추가적으로 탐색하고 싶을 경우 원하는 타입을 클릭하여 타입들이 어떻게 모델링 되어 있는지 직접 볼 수 있다.

```typescript
const response = fetch('...');


declare function fetch(
  input: RequestInfo, init?.RequestInit
): Promise<Response>;


type RequestINfo = Request | string;
```
