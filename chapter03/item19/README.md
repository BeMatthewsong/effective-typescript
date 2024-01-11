# **아이템19. 추론 가능한 타입을 사용해 장황한 코드 방지하기**

<hr/>

`TypeScript`에서 추론을 해준다면 명시적으로 타입을 넣는 것은 좋지 않습니다.
오히려 명시적으로 넣다가 실수할 수도 있습니다.
또한 `TypeScript`의 추론이 더 세밀하고 정확할 때도 많습니다.

## 1. 타입 추론이 된다면 명시적으로 작성하지 말기

```ts
// (1)
let age: number = 10;

// (2)
let age = 10;
```

(1), (2) 의 경우 모두 같은 타입으로 추론된다.

```ts
// (3)
const person = {
  name: "alice",
  age: 26,
  vision: {
    left: 0.3,
    right: 0.3,
  },
};

// (4)
const func = (...args: number[]) => args.reduce((acc, curr) => acc + curr);
```

(3)처럼 복잡한 객체의 경우에도 정확하게 추론을 해주고, (4)처럼 함수의 경우에도 아래와 같이 반환 값을 정확한 타입으로 추론해줍니다.
( (3)의 경우 일회용으로 타입을 정의하면 더 힘들고 귀찮은 작업이 되겠죠. )

(3): `const person: {
    name: string;
    age: number;
    vision: {
        left: number;
        right: number;
    };
}`
(4): `const func: (...args: number[]) => number`

```ts
// (5)
const z = 10;
```

일반적으로 (5)를 number라고 생각할 수 있지만, TypeScript는 10이라고 추론합니다.
생각해보면 const 원시 타입은 변경할 수 없으니 더 정확한 추론입니다.

```ts
type Product = {
  id: string;
  name: string;
  price: number;
};

const logProduct = (product: Product) => {
  // (6)
  const id: string = product.id;
  const name: string = product.name;
  const price: number = product.price;

  console.log(id, name, price);
};
```

(6)같은 경우도 명시적으로 타입을 적용하기 보다는 타입 추론을 믿고 그대로 사용하면 됩니다.
(6)처럼 작성했다가 나중에 Product가 바뀌게 되면 logProduct()의 내용도 바꿔야 합니다.
그리고 불필요한 타입 선언으로 인해 코드가 번잡해 집니다.

결론은 logProduct()의 매개변수처럼 타입 추론이 되지 않는 경우에만 명시적으로 작성(Product)하고, 타입 추론이 된다면 그대로 사용하는 것이 더 현명한 사용 방법입니다.

## 2. 명시적으로 타입을 작성해야 하는 경우

대부분의 경우 TypeScript에서 타입을 추론해서 정해줍니다.
하지만 명시적으로 타입을 작성해야 하는 경우 혹은 그냥 하면 좋은 경우가 있습니다.

#### 1) 명시적으로 타입을 작성해야 하는 경우

정보가 부족해서 타입스크립트가 스스로 타입을 판단하기 어려운 상황에는 명시적 타입 구문이 필요합니다.

#### 2) 타입 추론이 될 수 있음에도 여전히 타입을 명시하고 싶은 몇 가지 경우

1. 객체 리터럴을 정의 할 때

- 객체 리터럴의 정의에 타입을 명시하면, 잉여 속성 체크가 동작합니다.

2. 함수의 반환에도 타입을 명시하여 오류 방지

- 반환 타입을 함수에 대해 더욱 명확하게 알 수 있습니다.

```ts
// 위 예시(6)의 "logProduct()"를 쓴다고 가정

// (1)
const product = {
  id: 1,
  name: "keyboard",
  price: 200_000,
};

// (2) "logProduct()"에서 "id"의 타입이 맞지 않는다고 에러 발생
logProduct(product);
```

잘못적은 곳은 (1)지만 (2)에서 에러가 발생합니다.
`'{ id: number; name: string; price: number; }' 형식의 인수는 'Product' 형식의 매개 변수에 할당될 수 없습니다.
  'id' 속성의 형식이 호환되지 않습니다.
    'number' 형식은 'string' 형식에 할당할 수 없습니다.ts(2345)`

이런 경우 아래와 같이 작성하면 (3)에서 id 타입에 관한 에러가 먼저 발생합니다.
`'number' 형식은 'string' 형식에 할당할 수 없습니다.ts(2322)`

```ts
// (3)
const product: Product = {
  id: 1,
  name: "keyboard",
  price: 200_000,
};
```

즉, 객체를 사용한 곳이 아니라, 선언한 곳에서 에러를 발생시키기 위해서는 (잉여속성체크 하기 위해서는), 타입 구문을 제대로 명시해야 합니다. 타입에 관한 문제외에 오타같은 실수도 잡을 수 있습니다.

또한 함수의 반환 타입같은 경우도 확실하게 명시하는 게 좋은 경우가 많습니다.

```ts
const someThingFetch = () => {
  // 자유 변수
  const _cache: { [id: string]: string } = {};

  // 클로저
  const fetchUser = (id: string) => {
    if (id in _cache) return _cache[id];

    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((res) => res.json())
      .then((res) => {
        _cache[id] = res.name;

        return res.name;
      });
  };

  return { fetchUser };
};

const { fetchUser } = someThingFetch();

// (4) 'string | Promise<any>' 형식에 'then' 속성이 없습니다. 'string' 형식에 'then' 속성이 없습니다.ts(2339)
fetchUser("1").then((result) => {
  console.log(result);
});
fetchUser("2").then(console.log);
fetchUser("1").then(console.log);
```

위 예시의 경우 캐싱하는 기능을 만들어서 같은 요청이 있는 경우에는 다시 네트워크 요청을 하지 않도록 구현한 예시입니다.
코드만 읽어봤을 때는 문제가 없어보이지만 fetchUser()의 리턴 값의 타입이 동일하지 않은 문제가 있습니다.
이미 캐싱된 데이터는 string 그게 아니면 Promise<any>를 반환합니다.
따라서 (4)에서 string 경우에 .then()을 쓸 수 없으니 오류가 발생합니다.

```ts
const someThingFetch = () => {
  // 자유 변수
  const _cache: { [id: string]: string } = {};

  // 클로저
  const fetchUser = (id: string): Promise<any> => {
    // (5) Error 'string' 형식은 'Promise<any>' 형식에 할당할 수 없습니다.
    if (id in _cache) return _cache[id];

    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((res) => res.json())
      .then((res) => {
        _cache[id] = res.name;

        return res.name;
      });
  };

  return { fetchUser };
};
```

(5)처럼 반환 타입을 명시해주면 사용하는 부분이 아닌 반환하는 부분에서 타입체크를 해줍니다.
( 일반적으로 Promise를 반환한다면 async를 붙여주는 것이 좋습니다. )

실질적으로 이 오류를 해결하려면 아래와 같이 하면 됩니다.

```ts
const someThingFetch = () => {
  // 자유 변수
  const _cache: { [id: string]: string } = {};

  // 클로저
  const fetchUser = (id: string): Promise<string> => {
    if (id in _cache) return Promise.resolve(_cache[id]);

    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((res) => res.json())
      .then((res) => {
        _cache[id] = res.name;

        return res.name;
      });
  };

  return { fetchUser };
};
```

## ⭐️ 3줄 요약

### 1. 일반적으로 타입 추론이 되는 경우에는 명시적으로 타입을 작성하지 말기

### 2. 함수의 경우에는 함수 시그니처 타입을 사용하는 것이 좋음

### 3. 정해진 타입이 있는 특별한 경우에 명시적으로 타입을 정하기
