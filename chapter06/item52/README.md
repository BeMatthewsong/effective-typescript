# [아이템 52] 테스팅 타입의 함정에 주의하기
요약
- 타입 선언도 테스트를 통해 정확한 추론이 이루어지는 지 점검해야 함.
- dtslint를 이용하여 타입 테스팅을 하는 것을 추천함.
- 런타임뿐만 아니라, 실행 시점의 타입추론을 검증해야 함.

 ## 할당을 이용하여 타입을 체크하기
 ```ts
declare function map<U, V>(array: U[], fn: (u: U) => V): V[];
const lengths: number[] = map(['ff'], str => str.length);
```
**단점**
- 미사용 변수 할당이 필요함. 린트 설정을 일부 무시해야함.

## 헬퍼 함수를 정의하여 타입을 체크하기
```ts
function assertType<T>(x: T) {}
assertType<number[]>(map(['ff'], str=> str.length))
```

**단점**
- 서브 타입을 검증하기 어려움
- 타입에 정의된 함수보다 파라미터가 적은 경우에도 할당이 가능함

## 함수의 경우, 매개변수와 반환값을 분리해서 테스트하기
```ts
const double = (x: number) => x * 2;

let p: Parameters<typeof double> = null!;
assertType<[number]>(p);

let r: ReturnType<typeof double> = null!;
assertType<number>(r);
```

## 콜백함수의 경우 내부에서의 타입추론까지 검증하기
```ts
const beatles = ['john']
declare function map<U, V>(array: U[], fn: (this: U[], u: U, i: number, array:U[]) => V)
assertType<number[]>(map(beatles, function(name, i,array) {
 assertType<string>(name);
 assertType<number>(i),
 assertType<string[]>(array);
 assertType<string[]>(this);
  return name.length
}))
```
**this의 타입을 명시하는 경우 함수의 첫번째 인자에서 선언해주어야 한다.**
