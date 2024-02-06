# [아이템 44] 타입 커버리지를 추적하여 타입 안전성 유지하기
요약
1. 설계된 any 이외의 any를 잊지 않고 없애자!!
2. 명시적 any 중에서 any[]와 {[key: string]: any}의 경우에는 참조값을 통해 any가 퍼져나가므로, 주의!!
3. 라이브러리의 경우에 any보다는 타입 보강 augmentation을 이용하자!!

## type-coverage
npm에서 any를 찾아낼 수 있는 패키지

<img width="406" alt="image" src="https://github.com/code-itch/effective-typescript/assets/78120157/edca4af2-89cf-4587-80b3-6b58f5ac7538">

## declare 문법을 이용해서 똘똘한 타입 선언하기
- `declare`는 자바스크립트 환경에 있는 변수, 함수, 객체의 타입을 선언(declare)할 때 사용된다.
- 타입스크립트 파일에서 JS 값을 사용할 때 필요하다.
- 타입스크립트에게 JS 값에 대한 타입 맥락을 제공하는 문법이다. === JS로 트랜스파일링 되지 않는다!!
- 주의할 점은 `declare`는 전역으로 선언된다는 점이다.
```ts
// 파일명 index.js
const a = "haneul";

// 파일명 type.d.ts
// a라는 변수가 "readOnly number" 타입임을 타입스크립트에게 전달해준다.
declare const a: number;

console.log(a);
// "haneul"

a = "hi"
// error!
```
이렇게 `declare`를 이용하면 자바스크립트 값을 타입스크립트에서 사용할 때 타입 선언을 명시적으로 할 수 있다.

따라서, JS 라이브러리와 유틸 함수 등에 타입을 선언해 줄 수 있다.

## Global Module: 타입스크립트 파일들은 사실 서로 연결되어 있다.
타입스크립트 파일(ts, tsx)들은 서로 같은 스코프를 공유한다. 즉, 전역 모듈 스코프를 가진다.

사실 이러한 Global Module은 JS 파일들도 같다.
```ts
// page.ts
const a = 3;

// index.ts
const b = a + 3;
console.log(b)
// 6
```

## Local Module: 충돌하는 변수와 타입은 서로 이별하기
하지만 전역 변수와 전역 타입은 충돌, 잘못된 참조, 오버라이딩의 문제를 일으킨다.

따라서, 지역 변수와 지역 타입을 만들고 싶다면 `import` 또는 `export` 구문을 사용한다.

`import` / `export`가 하나라도 있으면 해당 ts,tsx 파일은 파일 단위 모듈 스코프를 가진다.

```ts
// 타입스크립트만 사용할 경우에는 다음과 같이 주로 사용한다.
// page.ts
export {}
declare let a: number;

// index.ts
a = 3
// reference Error: a is not defined.
```
React를 사용하는 경우, 훅의 import 또는 컴포넌트의 export 중 하나가 필수적이므로

위의 export {}가 어색할 것이다.
```ts
// page.tsx
export PageComponent
const helperFunction = () => {}

// index.tsx
helperFunction();
// reference Error: helperFunction is not defined.
```

## declare global: 로컬 모듈에서 전역, 필요해?
React에서는 Global Module를 경험하기도, 걱정하기도 어렵다.

웬만하면 local Module이 되기 때문이다.

그렇다면? local Module에서 전역 변수를 선언하는 방법은 무엇일까?

그것은 바로 `declare global`이다.
```ts
// page.ts
export {}
declare global {
  type Haneul = "haneul"
  let name: Haneul
  function isHaneul(name: Haneul):boolean
}

// index.ts
let name = 3
// number 형식은 "haneul" 형식에 할당할 수 없습니다.
```

## Ambient Module 1: declare namespace를 이용하여 필요한 타입 선언을 그룹화하여 하나의 객체처럼 다루기.
필요한 타입 선언을 하나의 모듈 단위 안에서 이용할 수 있다.

가장 좋은 예시는 "React" 라이브러리에서 제공하는 네임스페이스 React이다.
```ts
// index.d.ts  
declare namespace React {
  // ...
    interface MouseEvent<T = Element, E = NativeMouseEvent> extends UIEvent<T, E> {
        altKey: boolean;
        button: number;
        buttons: number;
        clientX: number;
        clientY: number;
        ctrlKey: boolean;
        getModifierState(key: ModifierKey): boolean;
        metaKey: boolean;
        movementX: number;
        movementY: number;
        pageX: number;
        pageY: number;
        relatedTarget: EventTarget | null;
        screenX: number;
        screenY: number;
        shiftKey: boolean;
    }
  // ...
  // 모든 리액트 문법에 대한 타입선언...
}

// page.tsx
const handleClick = (e: React.MouseEvent) => {}
```

## Ambient Moudle 2: declare module 이용하여 외부 라이브러리, 모듈의 타입 보강
아래는 가상의 라이브러리 예시이다. 캘린더를 렌더링하는 라이브러리에 날짜를 누를 때 호출되는 `onClick`함수의 타입을 정의하려고 한다.
이렇게 추가적으로 필요한 값에 대해서 타입을 추가해 주는 작업을 타입 보강(Augmentation)이라고 한다.
```ts
// calendar.d.ts
import "calendar"

declare module "calendar" {
  export function onClick(e:React.MouseEvent): void;
}

// page.tsx
import { onClick } from "calendar"

onClick();
// error! 1개의 인자가 필요한데, 0개를 가져왔습니다.
```

## Shorthand Ambient Module: declare module 이후의 {}를 생략하면... 모든 것이 any(anything is any)
대괄호 이후의 내용을 작성하지 않으면 any로 추론된다.

최악의 결말을 예고할 수 있다.
```ts
import "calendar"

declare module "calendar"

// page.tsx
import { onClick } from "calendar"

onClick();
// ok
```

## 요즘은 namespace를 선언하기보다, module import/export를 사용하는 것이 훨씬 모던하고 안전하다.
namespace는 타입스크립트 파일마다 어떤 파일의 namespace를 참조할 지를 선언해주어야 하므로 번거롭다.

그래서, declare module "name"을 이용해서 타입 보강을 하고, namespace가 아닌 실제 구현체(라이브러리의 객체, 함수, 변수 등의 값)을 이용하는 것이 모던하고 안전하다.
