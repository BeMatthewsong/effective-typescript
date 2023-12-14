# 아이템 4. 구조적 타이핑에 익숙해지기

## 한마디로 말하자면,

- 타입스크립트는 구조적 타이핑을 통해 타입 호환성을 제공한다.

## 알아야할 용어들

### 덕 타이핑

![덕 타이핑](https://theburningmonk.com/wp-content/uploads/2015/04/cartoon_duck.jpg)  
`“if it looks like a duck and quacks like a duck, it’s a duck”`

- 객체가 어떤 타입에 부합하는 변수와 메소드를 가질 경우 객체를 해당 타입에 속하는 것으로 간주하는 방식
- **런타임에 타입을 체크**
- 사용 언어: JavaScript

### 구조적 타이핑(구조적 타입 시스템)

- 오직 멤버만으로 타입을 관계시키는 방법(**객체가 같은 프로퍼티를 모두 가지고, 동일한 형태를 가지면 같은 타입으로 판단**)
- **컴파일 타임에 타입을 체크**
- 사용 언어: TypeScript, Python 등

### 명목적 타이핑(명목적 타입 시스템)

- 명시적 선언이나 이름을 기반(**이름이 같아야지만 같은 타입으로 판단**)
- 사용 언어: Java, C# 등

## 내용

### 구조적 타이핑?

- 밑의 코드를 통해 구조적 타이핑과 명목적 타이핑의 흐름을 이해해보자!

  ```ts
  type Food = {
    name: string;
    calrories: number:
    price: number;
  }

  const printFoodName = (food: Food): void => {
    console.log(food.name);
  }

  // 명목적 타이핑
  const food1: Food = {
    name: 'pizza',
    calrories: 100,
    price: 10000,
  };

  printFoodName(food1);

  // 구조적 타이핑
  const food2 = {
    name: 'pizza',
    calrories: 100,
    price: 10000,
    isError: false
  };

  printFoodName(food2);

  ```

  - 명목적 타이핑 입장에서는 Food type을 사용해야 맞습니다.
  - 하지만, 구조적 타이핑 입장에서는 **Food의 속성에 해당하는 값들이 값을 넣는 타입에 속성으로 존재하는가**로 이해해야 합니다.
  - 조금 더 쉽게(?) 이해하자면, 구조적 타이핑은 명목적 타이핑과 같은 `명확한 상속 관계(A-B)`를 지향하기보다 `집합으로 포함`한다는 개념을 지향합니다.

### 타입은 열려있다?

- 타입스크립트는 타입의 확장에 열려있다
- 즉, `타입에 선언된 속성 외에 임의의 속성을 추가하더라도 오류 발생 X`

  ```ts
  type Vector3D = {
    x: number;
    y: number;
    z: number;
  };

  function calculateLengthL1(v: Vector3D) {
    let length = 0;
    for (const axis of Object.keys(v)) {
      // Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Vector3D'.
      // No index signature with a parameter of type 'string' was found on type 'Vector3D'.
      const coord = v[axis]; // 에러 발생
      length += Math.abs(coord);
    }
    return length;
  }
  ```

  #### 왜 에러가 발생할까?

  - v는 어떤 속성이든 가질 수 있기 때문에, axis의 타입은 string이 될 수도 있다.

    ```ts
    const vec3D = { x: 3, y: 4, z: 1, address: "123 Broadway" };
    console.log(calculateLengthL1(vec3D)); // NaN 출력
    ```

  - 따라서, 루프보다는 모든 속성을 각각 더하는 구현이 더 낫다고 합니다.
    ```ts
    function calculateLengthL1(v: Vector3D) {
      return Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z);
    }
    ```

### 클래스에서도 구조적 타이핑

```ts
class C {
  foo: string;
  constructor(foo: string) {
    this.foo = foo;
  }
}

const c = new C("instance of C"); // 원래 의도한 결과
const d: C = { foo: "object literal" }; // 정상!
```

- 구조적으로 필요한 속성(foo)과 생성자가 존재하기 때문에 문제가 없음

### 왜 구조적 타이핑을 사용할까?

```ts
function check(who) {
  if (who.appearance == "feathers" && typeof who.quack == "function") {
    who.quack("I look like a duck!\n");
    return true;
  }
  return false;
}
```

문제상황

- JavaScript에서는 프로퍼티의 존재 유무(`in`)와 그 것의 타입을 체크(`typeof`)를 런타임에서 수행할 수 있는 기능을 제공하며 그것들은 방어코드 구현을 위해 흔하게 사용합니다.
- 하지만, 각종 assertion과 예외처리 코드를 넣다 보면 배보다 배꼽이 더 커지는 상황도 발생한다.

해결

- JavaScript의 큰 단점으로 보이는 위 상황은 추가적인 방어 코드를 제거하고도 타입을 검사할 수 있다면 해결할 수 있을 것이다. TypeScript 컴파일러는 컴파일 시점에 Duck Typing과 같은 방식으로 타입을 검사하여 컴파일 에러를 내 준다. 이 것을 `Structural Typing(구조적 타이핑)`이라 한다.
- 명목적 타이핑이 아닌 구조적 타이핑을 지원하는 이유는...
  - 이름이 다르지만, 모든 프로퍼티를 포함하고 있어 런타임 상에서 정상적으로 동작하는 것을 타입오류라고 판단하기 보다는 유연하게 대응하여 타입 호환성을 지원하기 때문이다.

## 추가 설명

### 타입호환 예외조건: 신선도(Freshness)

```ts
type Food = {
  name: string;
  calrories: number;
  price: number;
};

const printFoodName = (food: Food) => {
  console.log(food.name);
};

const food2 = {
  name: "pizza",
  calrories: 100,
  price: 10000,
  useFork: true,
};

printFoodName(food2); // 정상 작동

// TypeError 발생
printFoodName({
  name: "pizza",
  calrories: 100,
  price: 10000,
  useFork: true,
});
```

#### 왜 오류가 발생할까?

- TS는 구조적 타이핑에 기반한 타입 호환의 예외 조건과 관련하여 신선도(Freshness)라는 개념을 제공
- 모든 object literal은 초기에 `fresh`하다고 간주, 타입 단언 or 타입 추론에 의해 object literal의 타입이 확장되면 `freshness`가 사라짐
- 함수에 인자로 object literal을 바로 전달할 경우 `fresh`한 상태로 전달
- 한편, [TypeScript Github PR(2015년 7월)의 논의](https://github.com/Microsoft/TypeScript/pull/3823)에 따르면, **fresh object인 경우 예외적으로 타입 호환을 허용하지 않기로 함!**

#### 왜 예외적으로 허용을 하지 않을까?

```ts
type Food = {
name: string;
calrories: number:
price: number;
}

const printFoodName = (food: Food) => {
console.log(food.name);
}

/*
부작용 1 - 코드를 읽는 다른 개발자가 printFoodName 함수가 burgerBrand를 사용한다고 오해할 수 있음
*/
printFoodName({
name: '햄버거',
calrories: 200,
price: 5600,
burgerBrand: '버거킹',
});

/*
부작용 2 - birgerBrand 라는 오타가 발생하더라도 excess property이기 때문에 호환에 의해 오류가 발견되지 않음
*/
printFoodName({
name: '햄버거',
calrories: 200,
price: 5600,
birgerBrand: '버거킹',
});
```

- fresh object를 함수에 인자로 전달한 경우, 어처피 해당 함수에서만 사용되고 다른 곳에서는 사용 X
- **결론**: 유연함에 대한 이점보다 부작용을 발생시킬 가능성이 더 크기 때문에 -> 굳이 구조적 타이핑을 지원해야할 이유가 없음

---

> **참조**

- [덕타이핑 & 구조적 타이핑에 대한 자세한 내용](https://vallista.kr/%EB%8D%95-%ED%83%80%EC%9D%B4%ED%95%91%EA%B3%BC-%EA%B5%AC%EC%A1%B0%EC%A0%81-%ED%83%80%EC%9D%B4%ED%95%91/)
- [구조적 타이핑 사용 이유](https://soopdop.github.io/2020/12/09/duck-typing/)
- [덕타이핑과 구조적 타이핑의 차이](https://medium.com/@baejae/ts-statically-typed-language%EC%9D%B8%EB%8D%B0-%EC%99%9C-duck-typing%EC%9D%B8%EB%8D%B0-5cc27929a8f4)
- [신선도 - 토스(명시적 선언을 할 수 있는 예시도 포함)](https://toss.tech/article/typescript-type-compatibility)
- [신선도 - 토스 글 요약](https://yiyb-blog.vercel.app/posts/typescript-type-compatibility)
- [타입스크립트 딥다이브](https://radlohead.gitbook.io/typescript-deep-dive/type-system/freshness)

## Qustions

### Q1.

```
해당 아이템의 제목에서 구조적 타이핑을 언급하고 본문에서도 구조적 타이핑이란 단어가 많이 쓰이지만, 덕 타이핑에 대해서만 초반에 설명 했을 뿐, 구조적 타이핑이 무엇인지는 명확히 설명이 잘 안되어 있는 것 같은데요.. (어렴풋이 덕 타이핑 == 구조적 타이핑 이라고 표면적인 이해만 되는 것 같습니다.) 혹시 구조적 타이핑이 어떤 의미인지 알려주실 수 있으실까요?
```

### A.

```
TypeScript는 런타임에 컴퓨터가 타입을 결정하는 덕 타이핑의 특징을 가진 JavaScript +  컴파일 시점에 타입을 검사하는 구조적 타이핑 이라고 할 수 있을 것 같습니다.

다시 말해, 구조적 타이핑은 컴파일 타임에 타입을 체크할 수 있다는 특징을 가지고 있습니다.

사실 더 깊이 들어가보자면,
duck typing은 객체의 실제 타입보다는 그 객체가 어떤 method와 속성을 가지고 있으며, 어떻게 사용되는지가 중점인 반면, structural typing은 객체를 그 객체의 구조, 객체가 가진 속성과 메서드에 따라 type을 나누는게 중점이여 보인다.

어떤 것에 중점을 두고 있는지에 대한 개념만 다르고 큰 차이는 없습니다.
```
