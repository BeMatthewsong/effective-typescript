# 아이템 08. 타입 공간과 값 공간의 심벌 구분하기

## 요약

- 타입스크립트 코드에서는 타입 공간과 값 공간에 이름이 같은 심볼이 각각 존재할 수 있다. 따라서 현재 사용하는 심볼이 어떠한 공간의 심볼을 나타내는지 구분을 할 수 있어야 한다.
- 여러 연산자 및 키워드들이 타입 공간과 값 공간에서 다른 목적으로 사용된다.

## 타입 공간과 값 공간 구분하기

타입스크립트에서는 심볼이 타입 공간이나 값 공간 중 한 곳에 존재한다.

다음과 같이 `Person` 이라는 심볼을 선언하고 있을 때, 첫 번째 심볼은 타입 공간에 존재하게 되고, 두 번째 심볼은 값 공간에 존재하게 된다.

```ts
interface Person {
  // 타입 공간
  name: string;
  age: number;
}

const Person = (name: string) => name;
```

두 개의 심볼은 서로 아무런 관련이 없으나 이름이 같기 때문에 각 심볼을 사용할 때의 공간에 따라 나타내는 것이 달라지게 된다.

아래 예시에서는 `instanceof`를 통해 `p`가 `Person` 타입인지 체크하려고 한다. 그러나 `instanceof`는 자바스크립트 런타임 연산자이기에 값 공간에 있는 Person에 대해 연산을 한다. 따라서 여기서 `Person`은 객체를 참조하게 된다.

```ts
function isPerson(p) {
  if (p instanceof Person) {
    ...
  }
}
```

따라서 의도하지 않은 코드 동작을 방지하기 위해서는 심볼이 타입 공간 또는 값 공간에 속하는지 구분할 수 있어야 한다.

일반적으로 `type` 또는 `interface` 다음에 나오는 심볼은 타입인 반면, `const` 나 `let` 선언에 쓰이는 것은 값이다.

```ts
// 타입
type t1 = 'Daniel';
interface t2 {
  name: string;
}

// 값
let v1 = 'Daniel';
const v2 = (name: string) => name;
```

`class`와 `enum`은 상황에 따라 타입과 값 두 가지 모두 가능하다.

따라서 이전 예시를 `class`로 바꿔주면 `Person` 클래스 타입으로 적용이 된다.

```ts
class Person {
  name = 'Daniel';
  age = 21;
}


function isPerson(p) {
  if (p instanceof Person) {
    ...
  }
}
```

또한 `class`와 `enum`은 타입 및 값 공간에 모두 속할 수 있기 때문에 다음과 같이 중복해서 선언해줄 수 없다.

```ts
class Person {
  name = 'Daniel';
  age = 21;
}

interface Person {
  // 에러
  name: string;
  age: number;
}

const Person = (name: string) => name; // 에러
```

## 공간에 따라 다른 기능을 하는 연산자

### typeof

`typeof` 연산자는 타입 공간에서는 타입스크립트 타입을 반환하고, 값 공간에서는 자바스크립트 타입을 반환한다.

```ts
interface Person {
  name: string;
}

const daniel: Person = { name: 'Daniel' };

type t = typeof daniel; // Person 타입

const v = typeof daniel; // 'object' 값
```

## QnA

> 심벌이라는 말이 어색한데 이해하기 좋은 말로 치환할 수 있을까요?

해당 아이템에서는 타입 공간과 값 공간에서 선언되는 것들을 구분하기 위해 `심볼`이라는 단어를 사용하고 있는 것 같습니다. 두 공간에서 사용되는 키워드들이 상이하기에 정확하게 치환할 수는 없겠으나, 단지 이해만을 위해 사용한다면 `선언명`라고 생각하셔도 될 것 같습니다.
