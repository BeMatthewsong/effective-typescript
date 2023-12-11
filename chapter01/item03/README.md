# **아이템3. 코드 생성과 타입이 관계없음을 이해하기**

- [타입 오류가 있는 코드도 컴파일이 가능하다.](#1-타입-오류가-있는-코드도-컴파일이-가능하다)
- [런타임에는 타입 체크가 불가능하다.](#2-런타임에는-타입-체크가-불가능하다)
- [타입 연산은 런타임에 영향을 주지 않는다.](#3-타입-연산은-런타임에-영향을-주지-않는다)
- [런타임 타입은 선언된 타입과 다를 수 있다.](#4-런타임-타입은-선언된-타입과-다를-수-있다)
- [타입스크립트 타입으로는 함수를 오버로드할 수 없다.](#5-타입스크립트-타입으로는-함수를-오버로드할-수-없다)
- [타입스크립트 타입은 런타임 성능에 영향을 주지 않는다.](#6-타입스크립트-타입은-런타임-성능에-영향을-주지-않는다)

<hr/>

## TypeScript의 2가지 역할

> 1. 최신 타입스크립트/자바스크립트를 브라우저에서 동작할 수 있도록 구버전의 자바스크립트로 트랜스파일([transpile](#transpile-번역translate--컴파일compile))
> 2. 코드의 타입 오류를 체크
>    > **이 두 가지는 서로 완벽히 독립적**

### 1) 타입 오류가 있는 코드도 컴파일이 가능하다.

만약 오류가 있을 때 컴파일하지 않으려면, tsconfig.json에 `noEmitOnError`를 설정하거나 빌드 도구에 동일하게 적용
_(보통 웹팩에 이렇게 많이 설정됨. 아예 빌드가 되지 않도록)_

### 2) 런타임에는 타입 체크가 불가능하다.

#### 아래와 같은 코드가 있다고 가정

```ts
interface Square {
  width: number;
}
interface Rectangle extends Square {
  height: number;
}
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape instanceof Rectangle) {
    // ~~~~~~~~~ 'Rectangle' only refers to a type,
    //           but is being used as a value here
    return shape.width * shape.height;
    //         ~~~~~~ Property 'height' does not exist
    //                on type 'Shape'
  } else {
    return shape.width * shape.width;
  }
}
```

JavaScript로 compile 했을 때 아래와 같이 될 것이다. Shape 타입은 생략이 되었지만, Rectangle은 문 안에 들어가있어서 생략되지 않았다. 따라서, JavaScript 런타임에는 에러가 날 것이다.
원래 instanceof 뒤에 오는 녀석도 class 여야 한다. instanceof는 JS에 있는 녀석이라 코드 개입이 일어나지 않은 것.

```js
function calculateArea(shape) {
  if (shape instanceof Rectangle) {
  // (Error) Rectangle이 지워지지 않고 들어가긴 함
  // 하지만 Rectangle의 이름을 찾을 수 없음
```

#### 우리는 런타임에도 타입정보를 유지하는 방법이 필요

height 속성이 존재하는지 체크해보는 것

```ts
function calculateArea(shape: Shape) {
  if ("height" in shape) {
    shape; // Type is Rectangle
    return shape.width * shape.height;
  } else {
    shape; // Type is Square
    return shape.width * shape.width;
  }
}
```

#### 런타임에 타입 정보를 손쉽게 유지가능한 아래 형태도 흔하게 볼 수 있다.

여기서 Shape 타입은 `태그된 유니온(tagged union)`의 한 예

```ts
interface Square {
  kind: "square";
  width: number;
}
interface Rectangle {
  kind: "rectangle";
  height: number;
  width: number;
}
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape.kind === "rectangle") {
    shape; // Type is Rectangle
    return shape.width * shape.height;
  } else {
    shape; // Type is Square
    return shape.width * shape.width;
  }
}
```

#### 타입과 값을 둘 다 사용하기 위해서는 타입을 클래스로 만드면 된다.

이렇게 하게되면 [처음](#아래와-같은-코드가-있다고-가정)과 같이 사용 가능, **class는 자바스크립트의 구현되어 있는 실제 값이기도 하면서, 타입스크립트의 interface처럼 타입으로도 존재 가능**

```ts
class Square {
  constructor(public width: number) {}
}
class Rectangle extends Square {
  constructor(public width: number, public height: number) {
    super(width);
  }
}
type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape instanceof Rectangle) {
    shape;  // Type is Rectangle
    return shape.width * shape.height;
  } else {
    shape;  // Type is Square
    return shape.width * shape.width;  // OK
  }
```

즉, shape은 아래와 같이 Square나 Rectangle의 인스턴스여야 한다.

```ts
calculateArea(new Square(19));
```

### 3) 타입 연산은 런타임에 영향을 주지 않는다.

#### 아래의 코드는 코드에 아무런 정제 과정이 없다.

```ts
function asNumber(val: number | string): number {
  return val as number;
}
```

위의 코드를 tsc하면? val 넘긴걸 val return. `as number`는 타입 연산이고 런타임 동작에는 아무런 영향을 미치지 않기 때문.

```js
function asNumber(val) {
  return val;
}
```

#### 값을 정제하기 위해서는 런타임의 타입을 체크해야 한다.

자바스크립트 연산을 통해 변환을 수행해야 한다.

```ts
function asNumber(val: number | string): number {
  return typeof val === "string" ? Number(val) : val;
}
```

### 4) 런타임 타입은 선언된 타입과 다를 수 있다.

#### 아래와 같이 네트워크 호출로부터 받아온 값의 경우, 그 결과로 선언한 LightApiResponse 타입과 같이 오지 않고 문자열이 올 수도 있다.

#### 즉, 타입스크립트에서는 믿고 작성한 코드가, 서버에서 실제 오는 코드가 해당 타입으로 오지 않을 수도 있다는 것이다.

이런 이유로 아래의 코드에서 런타임에 console.log가 호출될 가능성도 분명 존재한다.

```ts
function turnLightOn() {}
function turnLightOff() {}
function setLightSwitch(value: boolean) {
  switch (value) {
    case true:
      turnLightOn();
      break;
    case false:
      turnLightOff();
      break;
    default:
      console.log(`I'm afraid I can't do that.`);
  }
}
interface LightApiResponse {
  lightSwitchValue: boolean;
}
async function setLight() {
  const response = await fetch("/light");
  const result: LightApiResponse = await response.json();
  setLightSwitch(result.lightSwitchValue);
}
```

### 5) 타입스크립트 타입으로는 함수를 오버로드할 수 없다.

#### 오버로딩이란?

C++ 같은 언어에서 동일한 이름에 매개변수만 다른 여러 버전의 함수를 허용 하는 것. 타입스크립트도 함수 오버로딩을 지원함. (타입으로써만)

> 타입은 자바스크립트 컴파일시에 제거 됩니다. 동일한 이름을 가진 여러 자바스크립트 함수를 사용하면 문제가 발생합니다. 따라서 타입스크립트에서 함수를 오버로드하기 위해 여러 함수를 정의하지만 구현은 하나만 합니다.

```ts
// tsConfig: {"noImplicitAny":false}

function add(a: number, b: number): number;
function add(a: string, b: string): string;

function add(a, b) {
  return a + b;
}

const three = add(1, 2); // Type is number
const twelve = add("1", "2"); // Type is string
```

또 다른 예

```ts
function getFruit(name: string): string[];
function getFruit(name: boolean): string[];
// 오버로드 시그니처

// 구현 함수는 하나만
function getFruit(fruitProperty: any): string[] {
  if (typeof fruitProperty === "string") {
    // do something
  } else if (typeof fruitProperty === "boolean") {
    // do something
  }

  return [""];
}
```

위의 예시에서 any 가 싫다면 `string | boolean`으로 해도 된다.
~~**오버로딩... 굳이 쓰진 않을 듯???**~~

### 6) 타입스크립트 타입은 런타임 성능에 영향을 주지 않는다.

- `런타임` 오버헤드가 없는 대신, `빌드타임` 오버헤드가 있다. 오버헤드가 너무 크다 싶으면, 빌드도구에서 `트랜스파일만(transpile only)`을 설정하여 타입 체크를 건너뛸 수 있다.

###### <참고> Transpile: 번역(translate) + 컴파일(compile)

###### 소스코드를 동일한 동작을 하는 다른 형태의 소스코드(다른 버전, 다른 언어 등)로 변환하는 행위

<hr />

## 질문

### 1. p20 에서 두 번째 불렛(타입스크립트가 컴파일하는 코드는 ~)이 한 번에 와닿지 않는데 추가적인 설명을 해주실 수 있을까요?

> https://poiemaweb.com/es6-generator
> 제너레이터 함수는 ES6에 도입되었고 이터러블을 생성하는 함수입니다.

```ts
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
    }
}
```

우리는 tsconfig에서 위와 같은 설정을 마주하는데, es5로 셋팅해놓으면 es5 버전 자바스크립트로 컴파일 해줍니다. 신버전을 원하면, es2016, esnext 이런 것도 입력이 가능합니다.
그래서 어느정도 호환성을 고려한다면 es5, commonjs가 국룰인데, 제너레이터나 bigint 타입 등을 쓰려면 esnext 등으로 버전을 올려줘야 합니다.

`"target": "es5"` 으로 두고 만약 제너레이터 함수를 컴파일 한다면? 타입스크립트 컴파일러는 컴파일을 위해 특정 헬퍼 코드를 추가한다고 합니다. **따라서, `"target": "es5"` 을 가져가며 호환성을 놓치 못하는 대신, 특정 헬퍼 코드로 인해 오버헤드가 증가한다는 말을 합니다.**
만약 런타임 환경과의 호환성을 포기하고, 성능에 초점을 맞춘 `"target": "esnext"`(네이티브 구현체)를 선택하면 컴파일러 성능은 빨라질 수 있지만, 일부 오래된 런타임 환경에서는 동작하지 않을 수도...?
