## [아이템 26] 타입 추론에 문맥이 어떻게 사용되는지 이해하기
요약
1. 값을 변수 또는 상수에 저장하여 재사용하면, 값 할당 시 설정된 타입이 전달된다.
2. 변수를 사용하는 방식은 신선도가 떨어지므로, 정확한 타입 구문을 명시하거나, `as const`를 이용한다.

### 리터럴 타입을 사용할 때의 주의점
: 리터럴 타입으로 타입을 제한하는 경우, 변수에 값을 할당할 때 `const` 또는 `타입 구문 명시`
```ts
function sayHi(name: "하늘") {
  console.log(`환영합니다. ${name}님`)
}

sayHi("하늘")
// OK

let user = "하늘"

sayHi(user)
// "string" 형식은 "하늘"형식에 할당할 수 없습니다.

const newUser: "하늘" = "민혁"
// "민혁"은 "하늘"에 할당할 수 없습니다.

const nextUser = "하늘"

sayHi(nextUser)
//OK 
```

### 튜플 타입을 사용할 때의 주의점
: 값을 재사용하지 않는 경우에는 리터럴 방식 []으로 작성
: `as const`보다는 튜플 타입 구문 명시가 유지보수 및 타입 추적에 용이함
```ts
function sayTwo(people: [string, string]) {
  const [one, two] = people;
  console.log(`안녕히 가세요. ${one}님 ${two}님`)
}

sayTwo(["하늘", "상희"])
// OK

const arr: [string, string] = ["민혁", "규경"]

sayTwo(arr)
// OK

arr.pop();
sayTwo(arr)
// OK, but.... two is undefined
// 그러나, React에서는 보통 배열을 pop, push로 수정하는 일이 드묾.
```

### 객체 타입 사용 시 주의점
: 리터럴 방식으로 신선도를 올리거나, `as const`를 적극 활용하기!
```ts
const obj = {
  name: "하늘"
}

sayHi(obj.name)
// string 형식은 "하늘" 형식에 할당할 수 없습니다.

const newObj = {
  name: "하늘"
} as const

sayHi(newObj.name)
// OK
```

### 콜백 함수 사용 시 주의점
: 콜백 함수 === 함수의 파라미터, 즉 파라미터의 타입을 잘 정의할수록 콜백 함수 타입 체크가 정확
: 함수는 화살표 함수를 이용하여, 정의된 타입을 재사용하는 것이 좋다.
```ts
type CallBack = (n1: number, n2: number) => void;

function callRandom(fn: CallBack ) {
  fn(Math.random(), Math.random())
}

callRamdom((a:number, b:number) => console.log(a*b))
//OK

const newFn: CallBack = (a, b) => console.log(a+b);

callRandom(newFn)
//OK
```

함수에서는 타입을 명시할수록 사용성이 좋아집니다!
![image](https://github.com/code-itch/effective-typescript/assets/78120157/d2ee7660-6f15-4f64-bfdf-43ba30ec4fb8)


