# 아이템 13 타입과 인터페이스의 차이점 알기

# 요약

## 타입 별칭과 인터페이스의 공통점
- 추가 속성으로 인한 오류 발생
- 인덱스 시그니처 가능
- 함수 타입 가능
- 제네릭 가능
- 확장 가능
   
## 타입 별칭과 인터페이스의 차이점
- 인터페이스는 선언 병합(보강 기법)이 가능하다.
- 인터페이스끼리의 유니온 타입이 불가능하다.
- 인터페이스는 복잡한 타입을 만들어 낼 수 없다.

## 언제? 무엇을?

- **복잡한 타입**
   - **타입 별칭**을 써라
     
- **간단한 객체 타입**
  - 사용하고 있는 것을 우선으로 사용해라 (for 일관성, 보강)
  - 어떤 API에 대한 타입 선언을 작성해야 한다면 **인터페이스**를 사용해라 (병합 가능성 고려)
  - 프로젝트 내부적으로 사용되는 타입에 선언 병합이 발생하는 것은 잘못된 설계이므로 이럴 땐 **타입 별칭**을 사용해라

---
### 들어가기 전
- 타입 별칭 사용
```ts
// 할당 연산자 有
type TState = {
  name: string,
  capital: string,
};
```

- 인터페이스 사용
```ts
// 할당 연산자 無
interface IState {
  name: string;
  capital: string;
}
```
+ ) 인터페이스 대신에 **클래스**를 사용할 수 있지만, 클래스는 값 공간에 클래스는 해당하기에 주의할 필요가 있다. (클래스는 런타임에 영향을 준다)

---
## 타입 별칭과 인터페이스의 공통점
### 추가 속성과 함께 할당한다면 동일한 오류가 발생할 것
 _이건 솔직히 이해 안됩니다. 구조적 타이핑이라는 개념으로 인해서 충분히 가능하다고 생각하는데 왜 여기서는 추가 속성으로 인한 오류가 발생할까요?_
```ts
const wyoming: TState = {
	name: "wyoming";
	capital: "Cheyenne";
	population: 500_000; /// 에러 발생
}
```
### 인덱스 시그니처를 type과 interface에서 사용할 수 있다
> [key : string] : string 은 인덱스 시그니쳐 문법으로 이 객체 타입에는 key가 string 타입이고 value가 string 타입인 모든 프로퍼티를 포함된다 라는 의미입니다.

```ts
type TDict = { [key: string]: string };
interface IDict {
  [key: string]: string;
}
```

### 함수 타입 인터페이스나 타입으로 정의 가능 
> 함수 타입을 타입 별칭과 함께 별도로 정의할 수 있습니다. 이를 함수 타입 표현식(Function Type Expression)이라고 부릅니다.

> 호출 시그니쳐(Call Signature)는 함수 타입 표현식과 동일하게 함수의 타입을 별도로 정의하는 방식입니다.
```ts
type TFn = (x: number) => string; // 함수 타입 표현식

interface IFn {
  (x: number): string; // 호출 시그니처 
}
```

### 타입 별칭과 인터페이스 모두 제너릭 가능
```ts
type TPair<T> = {
  first: T,
  second: T,
};

interface IPair<T> {
  first: T;
  second: T;
}
```

### 확장 가능
**인터페이스는 타입을, 타입은 인터페이스를 확장할 수 있다.** <br/>
> 참고로 타입 별칭끼리도 & 연산자로 확장가능하고, 인터페이스끼리도 extends 키워드로 확장이 가능하다.

```ts
 // 인터페이스는 extends로 확장
interface IStateWithPop extends TState { 
  population: number;
}

// 타입 별칭은 & 기호로 확장
type TtateWithPop = IState & { population: number }; 

// 인터페이스끼리 extends로 확장 
interface Animal {
  name: string;
  color: string;
}

interface Dog extends Animal {
  breed: string;
}

// 타입 별칭끼리 &로 확장
type test1 = { name: string };

type test2 = test1 & { age: number };
```

---
## 타입 별칭과 인터페이스의 차이점

### 선언 병합
추가적인 보강이 필요한 경우에는 **인터페이스**를 쓰자!
```ts
interface IState {
  name: string;
  capital: string;
}
interface IState {
  population: number;
}
// IState는 name, capital, population를 갖게 된
```

### 유니온 타입
type에는 유니온 타입이 있지만, interface에는 유니온 인터페이스가 없다.
```ts
type TypeAorB = "a" | "b" // 🟢

interfaceA | interfaceB // ❌
```

### 복잡한 타입
interface는 복잡한 타입을 만들어 낼 수 없다. <br/>
type 키워드는 일반적으로 interface보다 쓰임새가 많다. type은 유니온이 될 수 있고 매핑된 파입 또는 조건부 타입 같은 고급 기능에 활용 되기도 한다

튜플 예시) <br/>
type 키워드를 이용하면 튜플과 배열 타입도 간결하게 표현할 수 있다.
interface를 사용하게 되면 유사하게 만들 수 있으나 튜플의 프로토타입 체인 상에 있는 메서드들을 사용할 수 없다.

```ts
// 타입 별칭 - Array 메서드들을 사용 가능
type Tuple = [number, number];
type StringList = string[];

const tuple: Tuple = [0, 1];

// Interface를 이용하여 만든 유사 트리플 타입.
interface Triple {
  0: number;
  1: number;
  2: number;
  length: 3;
}

const triple: Triple = [0, 1, 2];
```
