# 아이템 07 타입이 값들의 집합이라고 생각하기
## 요약 
- 타입을 값의 집합으로 생각하자. 이 집합은 **유한**(ex. boolean)하거나 **무한**(ex. number or string)하다.
- 타입스크립트의 타입은 엄격한 상속 관계가 아니라 겹쳐지는 집합(벤 다이어그램)으로 표현된다. <br/>(두 타입은 서로 subtype이 아니면서도 겹쳐질 수 있다)
- 타입 연산은 집합의 범위에 적용된다.
- keyof을 이용한 인터섹션과 유니온 타입은 꼭 공식을 기억해야 한다.
```ts
keyof (A & B) = (keyof A) | (keyof B)
keyof (A | B) = (keyof A) & (keyof B)
```
## 용어 정리 
| TS 용어  | 집합 용어 |
| --- | --- |
| never | 공집합 |
| 리터럴 타입, 유닛 타입 | 원소가 1개인 집합 |
| 값이 T에 할당 가능 | 값 → T (값이 T1의 원소) |
| T1이 T2에 할당 가능 | T1 → T2 (T1이 T2의 부분 집합) |
| T1이 T2를 상속 | T1 → T2 (T1이 T2의 부분 집합) |
| T1 ㅣ T2 (T1과 T2의 유니온) | T1 U T2 (T1과 T2의 합집합) |
| T1 & T2 (T1와 T2의 인터섹션) | T1 ^ T2 (T1과 T2의 교집합) |
| unknown  | 전체(universal) 집합 |

# 주의할 점
- `null`과 `undefined`는 `strictNullCheck` 여부에 따라 다른 유형과 호환되도록 허용될 수도, 아닐 수도 있다. 
- 집합 관점에서 **타입 체커**의 주요 기능은 하나의 집합이 다른 집합의 부분 집합인지 검사하는 것이라고 볼 수 있다.<br/> (유효한 범위에 있는지 판별)

### 교집합 (Intersection)
- **구조적 타이핑**으로 어떠한 값이 조건에 만족한다면 다른 속성도 가질 수 있다는 점을 명시해야 한다. 
- **교집합**은 집합 관점으로 타입 영역이 좁혀지는 영역이므로 해당 프로퍼티가 다 존재해야 한다. <br/>(구조적 타이핑을 생각하면 프로퍼티가 많은 게 타입 영역이 작아진다.)
```ts
interface Person {
  name: string;
}

interface Lifesapn {
  birth: Date;
  death?: Date;
}

type PersonSpan = Person & Lifespan; // 교집합이므로 name, birth, death(?) 프로퍼티가 다 있어야 한다.
``` 
- 교집합에서 주의할 점은 같은 프로퍼티가 없어서 공집합이므로 never라고 생각하면 안 된다. 

### 부분집합 (extends)
- 타입이 집합이라는 관점에서 `extends`의 의미는 '~에 할당 가능한'라는 의미로 받아질 수 있다. (서브 타입: 부분집합)
```tsx
interface Vector1D { x: number; }
interface Vector2D extends Vector1D { y: number; }
interface Vector3D extends Vector2D { z: number; }

// extends 없이 나타내기
interface Vector1D { x: number; }
interface Vector2D { x: number; y: number; }
interface Vector3D { x: number; y: number; z:number; }
```
![image](https://github.com/code-itch/effective-typescript/assets/98685266/7aa11a81-25ed-4dd3-aeae-9c2d435155f5)

집합의 관점으로 벤다이어그램으로 생각하는 게 이해가 더 빠르다.

### keyof - union, intersection 알아보기
_여기서 인지적 대환장 파티가 일어납니다._
인터섹션 타입의 값은 각 타입 내의 속성을 모두 포함하는 것이 일반적이지만 유니온 타입은 그렇지 않습니다.

```tsx
interface Person {
	name: string;
}
interface Lifespan {
	birth: Date;
	death: Date;
}
```
![image](https://github.com/code-itch/effective-typescript/assets/98685266/b545a92b-2e95-46ca-a75f-9639726000a2)

```tsx
type K = keyof (Person | Lifespan); // type -> never, Person이거나 Lifespan가 될 수 있는 속성은 없습니다. 
```
데이터가 하나도 할당되지 않은 상태에서 keyof Union을 하면 확실히 결정할 수 있는 타입은 여기서는 없기 때문에 never입니다.


keyof와 대수 타입을 고려했을 때 아래 공식을 명심하자. 
```tsx
keyof (A & B) = (keyof A) | (keyof B) // 모든 프로퍼티 다 있음
keyof (A | B) = (keyof A) & (keyof B) // 공통적인 프로퍼티만 남음
```
---
## 질문
> 타입들을 집합으로 비유했을 때, 아무 값도 포함하지 않는 never타입은 공집합이라고 할 수 있다고 책에 적혀있습니다.
혹시 never 타입이 필요한 이유와 쓰이는 상황은 어떤 것들이 있을지 설명 가능하실까요?

## 답변
@han-kimm의 답변 <br/>
### Never의 쓰임 1. 함수 호출을 막기
never타입에 값이 할당이 안되는 걸 이용하면 특정 메소드를 오버라이딩, 즉 덮어쓰기를 해서 함수 파라미터의 타입을 never로 바꾸어 readonly 객체로 만들 수 있습니다.

### Never의 쓰임 2. A | B 의 유니온 타입에서 A타입 또는 B타입으로 가드하기
never은 공집합이므로 유니온 타입에서 항상 병합 된다는 걸 이용합니다. never | string 은 string이죠.
이것은 Exclude의 정의에서 응용된 것과 같습니다. type Exclude<T, U> = T extends U ? never : T;에서, T가 U의 부분집합에 해당하면 never로 타입변환을 하여 공집합, 즉 소거해버리는 것이죠.

```ts
type VariantA = {
    a: string
    b?: never
}

type VariantB = {
    b: number
    a?: never
}

declare function fn(arg: VariantA | VariantB): void


const input = {a: 'foo', b: 123 }
fn(input) // 타입스크립트 에러, b는 undefined | never 에서 undefined 입니다.
```

---
@Bematthewsong의 답변 <br/>
never 타입은 불가능을 의미하는 타입입니다. 
하늘님께서 좋은 사용예시를 알려주셔서 거기에 제가 알고 있는 예시를 덧붙여서 설명드리자면 아래 내용과 같습니다.
### 1. 무한루프
무한 루프는 아무런 값도 반환하지 않기 때문에 반환값 타입에 never를 명시합니다. 
```ts
function func(): never {
  while (true) {}
}
```
### 2. 오류 발생
의도적으로 오류를 발생시키는 함수도 아무런 값을 반환하지 않아 반환값 타입에 never를 명시합니다.
```ts
function func(): never {
  throw new Error();
}
```
### 3. any를 담을 수 없게 하기  (값을 포함할 수 없는 빈 타입 - never)
변수의 타입을 never로 정의하면, any를 포함해 그 어떠한 타입의 값도 이 변수에 담을 수 없게 됩니다. 

---
참고링크
- https://ui.toast.com/posts/ko_20220323
- https://ts.winterlood.com/2fc094af-7fe4-46d4-8c24-bb0596172b2e

---
## 질문
```ts
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;
```
Exclude에 대한 정의입니다.

```ts
type T = Exclude<string|Date, string|number>;  // Type is Date
```
>해당 예제에서 string|Date과 string|number는 p.44 벤 다이어그램에 나와있듯이 서로 상속되는 개념이 아니기 때문에 정의에 의하면 T가 그대로 나와서 타입이 string|Date가 되어야 할 것 같아서 여쭤봅니다. 정의를 그대로 따라가면 이해하기가 참 모호한 것 같지만, 어쨌든 Exclude라는 용어에 의해서는 왜 결과가 Date로 나왔는지는 어렴풋이 이해가 됩니다. 혹시 해당 정의에 따라 설명이 가능하신 분 계실까요? T extends U 가 성립이 안되는 것 같은데 말입니다...

## 답변
@han-kimm의 답변 <br/>
Exclude에 대해서 정의에 따라 설명을 하자면 `type Exclude<T, U> = T extends U ? never : T;`와 `type S = Exclude<string|Date, string|number>;`에서 제네릭 T에 해당하는 `string | Date `는 string 또는 Date입니다. T가 string일 경우에는 제네릭 U의 `string | number` 집합의 부분집합이 되므로 never, T가 Date인 경우에는 부분집합이 되지 않으므로 Date가 됩니다. 따라서 |는 "합친다"는 개념보다는 "또는"으로 보면 이해가 더 빠를 것 같습니다.
