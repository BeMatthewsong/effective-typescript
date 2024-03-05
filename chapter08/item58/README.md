# **아이템58. 모던 자바스크립트로 작성하기**

## ⭐️ 요약

- 타입스크립트의 개발 환경은 모던 자바스크립트도 실행할 수 있으므로 모던 자바스크립트의 최신 기능들을 적극적으로 사용해야합니다. 코드 품질을 향상 시킬 수 있고, 타입스크립트의 타입 추론도 더 나아집니다.

###

<hr/>

옛날 버전의 자바스크립트 코드를 타입스크립트 컴파일러에서 동작하게 만들면 이후로는 최신 버전의 자바스크립트 기능을 코드에 추가해도 문제가 없습니다. 즉, 옛날 버전의 자바스크립트 코드를 최신 버전의 자바스크립트로 바꾸는 작업은 타입스크립트로 전환하는 작업의 일부로 볼 수 있습니다. 혹시 마이그레이션을 어디서부터 시작해야할지 몰라서 막막하다면 옛날 버전의 자바스크립트 코드를 최신 버전의 자바스크립트로 바꾸는 작업부터 시작해봅시다. (타입스크립트는 자바스크립트의 상위집합이기 때문에 코드를 최신 버전으로 바꾸다 보면 타입스크립트의 일부를 저절로 익힐 수 있게 됩니다.)

- 모던 자바스크립트란? -> 최신버전의 자바스크립트로, 현재는 ES2015(ES6) 버전부터 모던 자바스크립트라고 부르고 있습니다.
- 타입스크립트를 도입할 때 가장 중요한 기능
  - ECMAScript 모듈
  - ES2015 클래스

아이템 58에서 소개하는 기능들은 모두 모던 자바스크립트(ES2015, 일명 ES6 version) 부터 도입된 주요 기능입니다.

## ECMAScript 모듈 사용하기

코드를 개별 모듈로 분할하는 방법에는 여러 개의 `<script>` 태그를 사용하기, 직접 갖다 붙이기(manual concatenation), Makefile 기법, NodeJS 스타일의 require 구문, AMD 스타일의 define 콜백까지 매우 다양하지만, ES2015부터는 import, export를 사용하는 ECMAScript 모듈이 표준이 되었습니다. 만약 마이그레이션 대상인 자바스크립트 코드가 단일 파일이거나 비표준 모듈 시스템을 사용 중이라면 ES 모듈로 전환하는 것이 좋습니다.

- CommonJS 모듈 시스템

```js
//CommonJS
//a.js
const b = require("./b");
console.log(b.name);

//b.js
const name = "Module B";
module.exports = { name };
```

- ES 모듈

```js
//ECMASCript module
//a.ts
import * as b from "./b";
console.log(b.name);

//b.ts
export const name = "Module B";
```

## 프로토타입 대신 클래스 사용하기

마이그레이션하려는 코드에서 단순한 객체를 다룰 때 프로토타입을 사용하고 있었다면 클래스로 바꾸는 것이 좋습니다. 왜냐하면, 프로토타입으로 구현한 Person 객체보다 클래스로 구현한 Person 객체가 문법이 간결하고 직관적이기 때문입니다.

- 객체를 프로토타입으로 구현

```js
function Person(first, last) {
  this.first = first;
  this.last = last;
}

Person.prototype.getName = function () {
  return this.first + "" + this.last;
};

const marie = new Person("Marie", "Curie");
const personName = marie.getName();
```

- 프로토타입 기반 객체를 클래스 기반 객체로 변경

```js
class Person {
  first: string;
  last: string;

  constructor(first: string, last: string) {
    this.first = first;
    this.last = last;
  }

  getName() {
    return this.first + " " + this.last;
  }
}

const marie = new Person("Marie", "Curie");
const personName = marie.getName();
```

## var 대신 let/const 사용하기

var 키워드의 스코프(scope) 규칙에 문제가 있다는 것은 널리 알려진 사실입니다. let과 const는 제대로 된 블록 스코프 규칙을 가지며, 개발자들이 일반적으로 기대하는 방식으로 동작합니다.
만약 var 키워드를 단순히 let이나 const로 변경하면, 일부 코드에서 타입스크립트가 오류를 표시할 수도 있습니다. 오류가 발생한 부분은 잠재적으로 스코프 문제가 존재하는 코드이기 때문에 수정해야 합니다.

```js
function foo() {
  bar();
  function bar() {
    console.log("hello");
  }
}
```

## for(;;) 대신 for-of 또는 배열 메서드 사용하기

과거에는 자바스크립트에서 배열을 순회할 때 for루프를 사용했습니다.

```js
for (var i = 0; i < array.length; i++) {
  const el = array[i];
}
```

모던 자바스크립트에는 for-of 루프가 존재합니다. for-of 루프는 코드가 짧고 인덱스 변수를 사용하지 않기 때문에 실수를 줄일 수 있습니다.

```js
declare let array: number[];
for (const el of array) {
  // ...
}
```

index 변수가 필요한 경우엔 forEach 메서드를 사용합니다.

```js
declare let array: number[];
array.forEach((el, i) => {
  // ...
})
```

## 함수 표현식보다 화살표 함수 사용하기

this 키워드는 일반적인 변수들과는 다른 스코프 규칙을 가지기 때문에, 자바스크립트에서 가장 어려운 개념 중 하나입니다. 예상치 못한 결과가 나올 경우가 있으니, 화살표 함수를 사용하여 상위 스코프의 this를 유지할 수 있습니다.

```js
class Foo {
  method() {
    console.log(this);
    [1, 2].forEach(function (i) {
      console.log(this);
    });
  }
}

const f = new Foo();
f.method();

// strict 모드에서 Foo, undefined, undefined 출력
// non-strict 모드에서 Foo, window, window 를 출력
```

```js
class Foo {
  method() {
    console.log(this);
    [1, 2].forEach((i) => {
      console.log(this);
    });
  }
}

const f = new Foo();
f.method();
// 항상 Foo, Foo, Foo을 출력
```

## 단축 객체 표현과 구조 분해 할당 사용하기

아래와 같이 pt 객체를 생성하는 코드에서 변수와 객체 속성의 이름이 같을 때는 아래와 같이 간단하게 작성이 가능합니다. 코드가 더 간결해지고 중복된 이름을 생략하기 때문에 가독성이 좋고 실수가 적습니다.

```js
const x = 1,
  y = 2,
  z = 3;
const pt = {
  x: x,
  y: y,
  z: z,
};
```

```js
const x = 1,
  y = 2,
  z = 3;
const pt = { x, y, z };
```

## 함수 매개변수 기본값 사용하기

자바스크립트에서 함수의 모든 매개변수는 선택적이며, 매개변수를 지정하지 않으면 undefined로 간주합니다.

```js
function log2(a, b) {
  console.log(a, b);
}
log2();
// undefined, undefined
```

옛날 자바스크립트에서 매개변수의 기본값을 지정하고 싶을 때, 다음과 같이 구현하였습니다.

```js
function parseNum(str, base) {
  base = base || 10;
  return parseInt(str, base);
}
```

모던 자바스크립트에서는 매개변수의 기본값을 아래와 같이 지정합니다. 아래와 같이 지정할 경우, 코드가 간결해지고 base가 선택적 매개변수라는 것을 명확하게 나타내는 효과를 줄 수 있습니다. 또, 매개 변수에 타입 구문을 쓰지 않아도 됩니다.

```js
function parseNum(str, base = 10) {
  return parseInt(str, base);
}
```

## 프로미스나 콜백 대신 async/await 사용하기

async와 await를 사용하면 코드가 간결해져서 버그나 실수를 방지할 수 있고, 비동기 코드에 타입 정보가 전달되어 타입 추론을 가능하게 합니다.

```ts
async function getJSON(url: string) {
  const response = await fetch(url);
  return response.json();
}
```

## 연관 배열에 객체 대신 Map과 Set 사용하기

## 타입스크립트에 use strict 넣지 않기

타입 스크립트에서 수행되는 안정성 검사(sanity check)가 엄격 모드보다 훨씬 더 엄격한 체크를 하기 때문에, 타입스크립트 코드에서 'use strict'는 무의미합니다. 타입스크립트 코드에 'use strict'를 쓰지 않고, 대신 alwaysStrict 설정을 사용해야 합니다.
