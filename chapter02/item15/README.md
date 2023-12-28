# **아이템15. 동적 데이터에 인덱스 시그니처 사용하기**

<hr/>

## 인덱스 시그니처란?

아래와 같은 코드에서 `{[key: string]: number}`과 같이 객체의 key, value 타입을 정확하게 명시해주는 것을 의미한다.

```ts
let objSalary {
  bouns: 200,
  pay: 2000,
  allowance: 100,
  incentive: 100
}

function totalSalary(salary: 무슨 타입...? ) {
  let total = 0;
  for (const key in salary) {
    total += salary[key];
  }
  return total;
}

totalSalary(objSalary);
```

totalSalary() 함수의 인자 salary는 key가 string이고 value가 number 타입인 객체만 허용해야 한다. 즉, key가 string이 아니면 객체의 속성을 접근하는데 문제가 발생하고, value가 number 타입이 아닌 경우 총금액을 계산하는데 문제가 발생한다.

```ts
function totalSalary(salary: { [key: string]: number }) {
  let total = 0;
  for (const key in salary) {
    total += salary[key];
  }
  return total;
}
```

따라서 우리는 인덱스 시그니처를 사용하여 key 타입이 string이고 value 타입이 number인 객체 인자 salary의 타입을 선언한다.

### 인덱스 시그니처 특징 및 주의사항

#### 1. key 타입은 string, number, symbol, Template literal 타입만 가능

key 타입을 Template literal로 타입 선언하는 예시

```ts
type userInfoType = "name" | "age" | "address";

type userType = {
  [key in userInfoType]: string;
};

let user: userType = {
  name: "홍길동",
  age: "20",
  address: "서울",
};
```

**값의 타입은 어떤 것이든 가능**

#### 2. 존재하지 않는 속성에 접근하는 경우

아래 코드와 같이 인덱스 시그니처의 key 타입과 value 타입을 매핑할 때

```ts
type userType = {
  [key: string]: string;
};

let user: userType = {
  name: "홍길동",
  age: "20",
};

console.log(user.address);
// undefined
```

value 타입을 좀 더 정확하게 명시하고 안전한 접근을 위해 undefined 타입을 추가

```ts
type userType = {
  [key: string]: string | undefined;
};
```

#### 3. key의 이름은

[인덱스 시그니처](#인덱스-시그니처란) `{[key: string]: number}` 에서 key는 property(`{[property: string]: number}`) 등으로 바뀔 수 있다. 즉, 키의 위치만 표시하는 용도이며, 무시할 수 있는 참고 정보

이러한 인덱스 시그니처의 특성으로 인해

- 키는 잘못된 키를 허용
- 특정 키가 필요하지 않기 때문에 {}(빈 객체)도 유효하게 작용
- 키는 정의한 타입으로만 작성되어야 함
- 키는 무엇이든 가능하기 때문에, 키에 대한 자동 완성(ctrl + i) 기능 지원하지 않음

#### 우리는 늘 그렇듯 답을 찾는다.

#### 때에 따라 인터페이스로 객체를 정의한다.

아래의 경우, 자동완성, 이름바꾸기 정상 동작

```ts
interface Rocket {
  name: string;
  variant: string;
  thrust_kN: number;
}
const falconHeavy: Rocket = {
  name: "Falcon Heavy",
  variant: "v1",
  thrust_kN: 15_200,
};
```

15_200의 경우, 아래 링크를 참고
[proposal numeric separator](https://github.com/tc39/proposal-numeric-separator)

#### 4. 어떤 타입에 가능한 필드가 제한되어 있는 경우라면 인덱스 시그니처로 모델링하지 말아야 한다.

A,B,C,D 키가 오지만 얼마나 올지 불확실한 경우에는 아래와 같이 모델링하면 된다.

```ts
interface Row1 {
  [column: string]: number;
} // Too broad
interface Row2 {
  a: number;
  b?: number;
  c?: number;
  d?: number;
} // Better
type Row3 =
  | { a: number }
  | { a: number; b: number }
  | { a: number; b: number; c: number }
  | { a: number; b: number; c: number; d: number };
```

하지만, 사용하기 번거로운 문제가 있고, 인덱스 시그니처를 사용하자니, 너무 광범위한 문제가 있다.

##### 1. Record

```ts
type Vec3D = Record<"x" | "y" | "z", number>;
// Type Vec3D = {
//   x: number;
//   y: number;
//   z: number;
// }
```

```ts
type Record<K extends string | number | symbol, T> = { [P in K]: T };
```

##### 2. 매핑된 타입

```ts
type Vec3D = { [k in "x" | "y" | "z"]: number };
// Same as above
type ABC = { [k in "a" | "b" | "c"]: k extends "b" ? string : number };
// Type ABC = {
//   a: number;
//   b: string;
//   c: number;
// }
```

#### (결론) 인덱스 시그니처의 특성을 그대로 이용해서, key 이름이 무엇일지 미리 알 방법이 없을 때는(즉, 어떤 타입에 가능한 필드가 제한되어 있지 않은 경우나 런타임 때까지 객체의 속성을 알 수 없을 경우), 인덱스 시그니처를 사용한다.

#### 하지만, 가급적 인덱스 시그니처보다 정확한 타입(인터페이스, Record, 매핑된 타입)을 사용하는 것이 좋다.
