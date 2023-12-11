# **아이템3. 코드 생성과 타입이 관계없음을 이해하기**

- [TypeScript의 2가지 역할](#typescript의-2가지-역할)

<hr/>

## 1. TypeScript의 2가지 역할

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

17분~

###### <참고> Transpile: 번역(translate) + 컴파일(compile)

소스코드를 동일한 동작을 하는 다른 형태의 소스코드(다른 버전, 다른 언어 등)로 변환하는 행위
