# [아이템 59] 타입스크립트 도입 전에 @ts-check와 JSDoc으로 시험해보기

> - 자바스크립트에서도 @ts-check와 JSDoc을 사용하여 타입 체크 및 타입 추론을 할 수 있다.
> - 최종 목표는 .ts로 된 타입스크립트 파일로 마이그레이션 하는 것이기에 JSDoc에 너무 많은 공을 들이지 말자.

## @ts-check를 이용한 타입 체크

타입스크립트로 마이그레션을 진행하기 전에 `@ts-check`를 통해 미리 타입 체크를 해보고 어떤 문제가 발생하는지 시험해볼 수 있다. 이때 `@ts-check`는 noImplicitAny를 해제한 것보다 느슨하게 타입 체크를 수행하므로, 이 점을 유의해야 한다.

```js
// @ts-check
const person = { first: 'Daniel', last: 'Lim' };
let a = 2 * person.first;
//          ~~~~~~~~~~~~ 산술 연산 오른쪽은 'any', 'number',
//                     'bigint' 또는 열거형 형식이어야 합니다.
```

### 선언되지 않은 전역 변수

자바스크립트 파일에서 어딘가에 숨어있는 변수 (ex. HTML 파일 내의 `<script>` 태그)라면 변수를 제대로 인식할 수 있게 별도의 파입 선언 파일을 만들어야 한다.

```js
// @ts-check
console.log(user.first);
//          ~~~~ 'user' 이름을 찾을 수 없습니다.
```

```ts
interface UserData {
  first: string;
  last: string;
}
declare let user: UserData;
```

만약에 타입 선언 파일을 찾지 못하는 경우에는 트리플 슬래시 참조를 사용하여 명시적으로 임포트해주면 된다.

```js
// @ts-check
/// <reference path="./types.d.ts" />
console.log(user.first);
```

### 라이브러리 타입

서드파티 라이브러리를 사용하는 경우, `@ts-check`를 사용하면 오류가 발생하게 된다. 이를 해결하기 위해서는 서드파티 라이브러리의 타입 선언을 설치해줘야 한다.

제이쿼리의 경우에는 다음과 같이 설치한다.

```
$ npm install --D @types/jquery
```

## JSDoc을 이용한 타입 단언 및 타입 추론

`@ts-check`를 사용하면서 타입 단언이 필요한 경우에는 다음과 같이 JSDoc을 통해 타입을 단언해주면 된다.

```js
// @ts-check
const ageEl = document.getElementById('age');
age.value = '12';
//  ~~~~~ 'HTMLElement" 유형에 'value' 속성이 없습니다.

// >>> JSDoc을 이용한 타입 단언
// @ts-check
const ageEl = /** @type {HTMLInputElement} */ (document.getElementById('age'));
age.value = '12';
```

그러나 이러한 주석은 코드 분량을 늘려서 가독성을 떨어트릴 수 있기에 장기간 사용하는 것은 권장되지 않는다. 마이그레이션의 궁극적 목표는 모든 코드가 타입스크립트 기반으로 전환되는 것이므로 `@ts-check`는 기존 코드에 타입 체커를 간단하게만 실험해보는 용도로 사용하는 것이 좋다.
