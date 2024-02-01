### [아이템 41] any의 진화를 이해하기
요약
1. any는 noImplicitAny 설정이 되어있는 상태에서만 진화한다.
2. 명시적 타입이 있는 경우에는 any는 진화하지 않는다.
3. 리턴 타입을 이용하는 경우가 아니면, 함수 호출로 any는 진화하지 않는다.
(리턴 타입을 이용하는 경우는 map, filter 메서드와 같이 타입 맥락을 전달하는 함수를 이용)

#### 진화는 타입 좁히기와 다르다.
```ts
let any = [];

any.push(1)
any // number[]
any.push(Promise.resolve(1));
any // (number | Promise<number>)[]
```
위의 예시와 같이, any의 진화는 하나의 타입으로 좁혀지는 개념이 아니다.
오히려, 여러 타입이 유니온으로 확장될 수도 있다.
따라서, 특정 한 타입으로만 분화되는 것이 아니라 복잡하게 연산된 타입으로 분화할 수도 있는 것이다.

이를 이용하면, 다음의 코드와 같이 제네릭을 이용해 any를 마음껏 진화시킬 수 있다.
```ts
function evolve<T>(action: T): T {
  let out;
  out = action
  return out
}

evolve(["", 3]) // (string | number)[]
evolve({name: "하늘"}) // {name: string}
evolve(Math.random() > 0.5 ? "신기하지?" : 33) // "신기하지?" | 33 
```

하지만, 이렇게 any의 진화보다 처음부터 명시된 타입의 변수 활용이 좋다.
진화 자체가 동적 타입 변화를 의미하기 때문에, 정적 타입을 위해 사용하는 타입스크립트의 목적을 해친다.

#### 단순히 함수를 호출하는 경우에는 any가 진화하지 않는다.
```ts
const range = function (start: number, limit: number) {
  let i = start;
  let res = [];
  while (i < limit) {
    res.push(i);
    i++;
  }
  return res;
};
function makeSquares(start: number, limit: number) {
  let out;

  // any 진화 X
  range(start, limit).forEach(i => out.push(i*i));
  return out; // any[]

  // any 진화 O
  out = range(start, limit).map((i) => i * i);
  return out; // number[]
}
```
