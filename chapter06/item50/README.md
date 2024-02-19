# 아이템 50 오버로딩 타입보다는 조건부 타입을 사용하기

### 요약
- 오버로딩 타입보다 조건부 타입을 사용하는 것이 좋다.
- 조건부 타입은 추가적인 오버로딩 없이 유니온 타입을 지원할 수 있다.

```ts
function double(x) {  
  return x + x;  
}
```
위 코드의 double 함수는 string 또는 number 타입의 매개변수가 들어올 수 있다.
그래서 유니온 타입을 추가한다면
```ts
function double(x: number|string): number|string;
function double(x: any) {
 return x + x;
}
```
선언이 틀린 것은 아니지만, 모호한 부분이 있다.
```ts
const num = double(12);  // string | number
const str = double('12'); // string | number
```
double에 number 타입을 넣으면 number 타입을, string 타입을 넣으면 string 타입을 반환한다.

그러나 선언문에는 number 타입을 매개변수로 넣고 string 타입을 반환하는 경우도 포함되어 있다.
이를 막기위해선 다음과 같은 방어코드가 필요하다.

### 제네릭으로 타입 모델링
```ts
function double<T extends number|string>(x: T): T;  
function double(x: any) {  
  return x + x;  
}  
  
const num = double(12);  // 12
const str = double('12'); // "12"
```

제네릭으로 타입을 모델링할 경우 타입이 너무 구체적으로 변한다.

string 타입을 매개변수가 넣으면 string을 number 타입을 넣으면 number 타입이 나오도록 해야 한다.

### 여러 가지 타입 선언
타입스크립트에서 함수의 구현체는 하나지만, 타입 선언은 몇 개든지 만들 수 있다.
```ts
function double(x: number): number;  
function double(x: string): string;  
function double(x: any) {  
  return x + x;  
}  
  
const num = double(12);  // number
const str = double('12'); // string
```
좀 더 명확했지만 버그는 여전히 남아있다. string이나 number 타입의 값으로는 잘 동작하지만, 유니온 타입 관련해서는 문제가 발생한다.

```ts 
function f(x: number | string) {  
  return double(x);  // 타입 에러: 'string' 형식의 매개변수는 할당할 수 없다.
}
```
위 예제에서 double 함수의 호출은 정상적이며 `string | number` 타입이 반환되기를 기대하나 타입스크립트는 오버로딩 타입 중에서 일치하는 타입을 찾을 때까지 순차적으로 검색한다.

그래서 오버로딩 타입의 마지막 선언(string 버전)까지 검색했을 때, `string|number` 타입은 string에 할당할 수 없기 때문에 오류가 발생한다.

### 가장 좋은 해결책은 조건부 타입(conditional type)을 사용하기
```ts
function double<T extends number | string>(x: T): T extends string ? string : number;  
function double(x: any) {  
  return x + x;  
}  
  
const num = double(12);  // number
const str = double('12');  // string

function f(x: number | string) {  
  return double(x);  
}
```
반환 타입이 더 정교하게 사용한 코드다.

조건부 타입을 적용하면, 조건부 타입의 유니온으로 분리되기 때문에 `string | number`의 경우에도 동작한다.

오버로딩 타입이 작성하기는 쉽지만, 조건부 타입은 개별 타입의 유니온으로 일반화하기 때문에 타입이 더 정확해진다. 타입 오버로딩이 필요한 경우에 가끔 조건부 타입이 필요한 상황이 발생한다.

오버로딩 타입은 독립적으로 처리되지만,
조건부 타입은 타입 체커가 단일 표현식으로 받아들이기 때문에 유니온 문제를 해결할 수 있다.

### 질문 
```ts
function double<T extends number | string>(x:T): T extends string ? string : number;
function double(x: any) { return x + x };
```

코드를 보다가 만약 타입이 2개가 아니라 더 늘어나게 된다면 가독성이 떨어질 것 같다는 생각이 들었습니다.  
만약 삼항연산자를 사용하지 않고 조건부 타입을 사용하는 방법이 있다면 예시를 보여주실 수 있을까요? 아니면 타입이 많다면 다른 함수로 만드는 방법이 좋을까요??

#### 답변
Typescript 2.8부터 타입을 선택하게 하는 조건부 타입이 도입되었으며, 삼항연산자를 사용한 타입 선언이 조건부타입이라고 부릅니다.
```ts
T extends U ? X : Y
```
검사된 타입이 벗겨진 (naked) 타입 매개변수인 조건부 타입을 분산 조건부 타입이라고 부릅니다.
좀더 이해하기 쉽게 타입이 2개가 아닌 여러개 즉, 유니온으로 타입을 제네릭으로 할당한다면 분산 조건부 타입이 됩니다.
```ts
type T1 = (1 | 3 | 5 | 7) extends number ? 'yes' : 'no'; 
// naked 타입이 아니라서 분산이 되지 않는다.
type T2<T> = T extends number ? T[] : 'no'; 
// 제네릭 T는 naked 타입이라 분산이 된다.
type T3<T> = T[] extends number ? 'yes' : T[]; 
// 제네릭이지만 T[] 와 같이 변형된 타입 파라미터는 naked 타입이 아니라서 분산이 일어나지 않는다.

type T4 = T1; // "yes"
type T5 = T2<(1 | 3 | 5 | 7)>; // 1[] | 3[] | 5[] | 7[]
type T6 = T3<(1 | 3 | 5 | 7)>; // (1 | 3 | 5 | 7)[]
```
조건부 타입에서 (naked) type parameter 가 사용된 경우에만 분산 방식으로 동작합니다.

여기서 naked type parameter를 정의하기를 다음과 같이 정의합니다.

>(naked) type parameter는 제네릭 T 와 같이 의미가 없는 타입 파라미터를 말하는 것이며, 만일 직접 리터럴 타입을 명시하거나 혹은 제네릭 T[] 와 같이 변횐된 타입 파라미터이면, naked 가 아니게 된다.

### 출처
- [타입스크립트 조건부 타입 완벽 이해하기](https://inpa.tistory.com/entry/TS-%F0%9F%93%98-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%A1%B0%EA%B1%B4%EB%B6%80-%ED%83%80%EC%9E%85-%EC%99%84%EB%B2%BD-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0)
- [고급 타입](https://typescript-kr.github.io/pages/advanced-types.html)