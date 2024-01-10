# [아이템 22] 타입 좁히기

> - 편집기에서 타입스크립트가 타입을 어떻게 좁히는기에 대해 조사하여 타입 추론에 대한 개념을 잡을 수 있다.
> - 태그된 유니온과 사용자 정의 타입 가드를 사용하여 타입을 좁힐 수 있다.

## 타입을 좁히는 여러가지 방법

타입스크립트는 일반적으로 조건문 등에서 타입 좁히기를 매우 잘해준다. 가장 대표적인 타입 좁히기는 `null` 체크이다.

```ts
const el = document.getElementById('foo'); // 타입: HTMLElement | null
if (el) {
  el; // 타입: HTMLElement
} else {
  el; // 타입: null
}
```

이 외에도 여러 방식들로 타입을 좁힐 수 있다.

### instanceof, Array.isArray

`instanceof` 또는 `Array.isArray`를 이용해서 타입을 좁힐 수 있다.

```ts
function instanceofFn(text: string | RegExp) {
  if (text instanceof RegExp) {
    text; // 타입: RegExp
    return;
  }
  text; // 타입: string
  return;
}

function isArrayFn(text: string | string[]) {
  const newText = Array.isArray(text) ? text : [text];
  newText; // 타입: string[]
}
```

### 태그된 유니온

명시적 태그를 붙이는 태그된 유니온 기법을 통해 타입을 좁힐 수도 있다.

```ts
interface UploadEvent {
  type: 'upload';
  filename: string;
  contents: string;
}

interface DownloadEvent {
  type: 'download';
  filename: string;
}

function handleEvent(e: AppEvent) {
  switch (e.type) {
    case 'upload':
      e; // 타입: UploadEvent
      break;
    case 'download':
      e; // 타입: DownloadEvent
      break;
  }
}
```

### 사용자 정의 타입 가드 (type predicate)

`is` 키워드를 활용하여 타입 가드를 만들어 타입 체커에게 매개변수의 타입을 좁힐 수 있다고 알려줄 수도 있다.

아래 예시에서 `is` 키워드는 `isInputElement()` 함수를 거쳐서 `return` 값이 `true` 라면 함수가 호출된 범위 내에서는 `el`을 `HTMLInputElement` 타입으로 보라는 뜻을 가진다.

```ts
function isInputElement(el: HTMLElement): el is HTMLInputElement {
  return 'value' in el;
}

function getElementContent(el: HTMLElement) {
  if (isInputElement(el)) {
    el; // 타입: HTMLInputElement
    return el.value;
  }
  el; // 타입: HTMLElement
  return el.textContent;
}
```

아래 예시에서는 `filter` 함수를 사용해도 `undefined` 타입이 걸러지지 않는다. 이때 타입 가드를 활용하여 타입을 좁힐 수 있다.

```ts
const asConst = ['김하늘', '김종민', '손상희', '송규경', '송민혁', '임건우'];

const members = ['김하늘', '김종민'].map((member) =>
  asConst.find((n) => n === member)
); // 타입: (string | undefined)[]

const filterMembers = members.filter((who) => who !== undefined); // 타입: (string | undefined)[]

function isDefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

const typeGuardMembers = members.filter(isDefined); // 타입: string[]
```

## 잘못된 타입 좁히기

타입 좁히기를 할 때는 타입이 정해지는 명확한 기준을 알고 있어야 합니다.

다음은 잘못된 타입 좁히기의 예시들입니다.

```ts
const el = document.getElementById('foo');
if (typeof el === 'object') {
  el; // null도 object 이기에 타입이 HTMLElement | null 이 된다.
}

function check(x?: number | string | null) {
  if (!x); // '' 과 0 이 false 이기에 타입이 string | number | null | undefined 가 된다
}
```
