# 아이템 38 any 타입은 가능한 한 좁은 범위에서만 사용하기

### 요약
- any를 사용한다면 가능하다면 any의 사용 범위를 최소한으로 좁히자
- 함수의 반환 타입이 any인 경우 타입 안정성이 나빠진다. 반드시 any 타입을 반환하지 말자
- 강제로 타입 오류를 제거하려면 any 대신 `@ts-ignore`를 사용하자.
	- 그러나 좋은 패턴은 아니므로 지양하자.

다음은 함수와 관련된 any의 사용법이다.
```ts
function processBar(b: Bar) {  
  //  
}  
  
function f() {  
  const x = expressionReturningFoo();  
  processBar(x);  
  // expressionReturningFoo 형식의 인수는 'Bar' 형식의 매개변수에 할당할 수 없다.
}
```

문맥상으로 x라는 변수가 동시에 Foo 타입과 Bar 타입에 할당 가능하다면, 오류를 제거하는 방법은 두가지이다.
```ts
function f1() {
  const x: any = expressionReturningFoo();  // 지양하기
  processBar(x);  
}

function f2() {
  const x = expressionReturningFoo();  
  processBar(x as any);  // 이게 훨씬 낫다.
}
```
두번째 방법인 `as any` 형태가 권장되는 이유는 any 타입이 processBar 함수의 매개변수에서만 사용된 표현식이므로 다른 코드에는 영향을 미치지 않기 때문이다.

f1에서는 함수의 마지막까지 x의 타입이 any인 반면, f2에서는 processBar 호출 이후에 x가 그대로 Foo 타입으로 인정된다.
만약 f1 함수가 x를 반환한다면 어떤문제가 발생할까?

```ts
function f1() {
  const x: any = expressionReturningFoo();  
  processBar(x);
  return x;
}

function g() {
  const foo = f1(); // foo타입은 any
  foo.fooMethod(); // 이 함수 호출은 체크되지 않는다.
}
```

g함수 내에서 f1이 사용되므로 f1의 반환 타입인 any 타입이 foo의 타입에 영향을 미친다.
반면 any의 사용 범위를 좁게 제한하는 f2 함수를 사용한다면 any 타입이 함수 바깥으로 영향을 미치지 않는다.

> TS가 함수의 반환 타입을 추론할 수 있으면 반환 타입을 명시하자

### `@ts-ignore`
f1 함수에서 `@ts-ignore`를 사용하면 any를 사용하지 않고 오류를 제거할 수 있다.
```ts
function f1() {
  const x = expressionReturningFoo();  
  // @ts-ignore
  processBar(x);
  return x;
}
```
`@ts-ignore`를 사용한 다음 다음 줄의 오류가 무시된다. 하지만 근본적인 원인을 해결한 것이 아니기 때문에 다른 곳에서 더 큰 문제가 발생할 수도 있다.

타입 체커가 알려 주는 오류는 문제가 될 가능성이 높은 부분이므로 근본적인 원인을 찾아 적극적으로 대처하는 것이 바람직하다.

### 객체와 any
다음 코드는 어떤 큰 객체 안의 한 개 속성이 타입 오류를 가지는 상황이다.
```ts
const config: Config = {  
  a: 1,  
  b: 2,  
  c: {  
    key: value  // 타입 에러
  }  
}
```
여기서 `as any`를 사용해서 타입 에러를 제거 할 수 있다.
```ts
const config: Config = {  
  a: 1,  
  b: 2,  
  c: {  
    key: value
  }  
} as any // 하지만 안티패턴
```
위 코드처럼 객체 전체를 any로 단언하면 다른 속성들(a, b) 역시 타입 체크가 되지 않는 부작용이 생긴다.
그러므로 다음 코드처럼 최소한의 범위에만 any를 사용하는 것이 좋다.
```ts
const config: Config = {  
  a: 1,  
  b: 2,  
  c: {  
    key: value as any
  }  
}
```
