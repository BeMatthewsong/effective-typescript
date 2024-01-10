 # [아이템 22] 타입 좁히기

- 타입스크립트의 타입 추론은 최대한 넓은 범위의 추론을 지향하고 있으며, 이를 타입 넓히기라고 한다.
- 타입 넓히기로 인해서 원치 않는 범위까지 타입이 확장되므로, 이를 줄이는 과정을 타입 좁히기라고 한다.
- 타입 좁히기는 조건문과 함수를 이용할 수 있다.

 ## [조건문 타입 가드] null, undefined 제외하기
### 타입 좁히기는 성공했으나... 혹시...타입이 babo?
 ```ts
function Component() {
const inputRef = useRef<HTMLInputElement>(null);

const what = inputRef.current
// HTMLInputElement | null

if (!what) return;

what
// HTMLInputElemnt

return <input ref={inputRef} />
}
```


## [조건문 타입 가드] typeof 이용하기
### api 경로를 만드는 함수에서 타입가드를 해보자.
```ts
const CONSTANT = {
  cards: "/api/cards",
  card: (id: number) => `/api/card?cardId=${id}`
} as const

const pathFinder = (key: keyof typeof CONSTANT, id?: number) => {
    // key: "cards" | "card";

    const result = CONSTANT[key]

    if (typeof result === "string") {
      // key: "cards" 
      return result;
      // result: "/api/cards"
    }

    if (typeof result === "function" && id) {
      // key: "card"
      return result(id);
      // result: (id: number) => string
    }

    throw new Error("id를 입력해주세요.") 
  };
```


## [조건문 타입 가드] instanceof 이용하기
### useAsync 훅의 try catch... 문에서 사용하기
```ts
  const catchError =
    async <T extends (...arg:any) => any>(asyncFunc: T, ...arg: Parameters<T>) => {
      try {
        return await asyncFunc(arg);
      } catch (e) {
      // e: unknown
        if (e instanceof Error) {
          console.error(e);
        }
      }
    }
```


## [조건문 타입 가드] 객체의 속성 체크
### in 연산자 이용하기
```ts
interface person {
  name: "하늘"
}

interface money {
  amount: 500
}

function isPerson(something: person | money) {
  if ("name" in something) {
    something
    // something: person
  }
}
```


### 타입 좁히기를 위한 속성인 태그 이용하기
```ts
interface UserData {
  type: "user";
  users: User[];
  ...
  ...
  ...
}

interface CardData {
  type: "card";
  cards: Card[];
  ...
  ...
  ...
}

function filter(data: UserData | CardData) {
  if (data.type === "user") {
    data
    // data: UserData
  }
}
```

## [함수 타입 가드] is 연산자를 이용하기
### is는 리턴값이 true이고, 이 리턴값을 조건문에서 사용할 때만 타입 가드로 작동한다.
```ts
function isX(str:string): str is "X" {
  return str === "X"
}

const test1 = "X";
// test1: "X"
const result1 = isX(test1)
// result1: boolean

function xyz(str: "X" | "Y" | "Z") {
  if (isX(str)) {
    str
    // str: "X"
  }
}
```
