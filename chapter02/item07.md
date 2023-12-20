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
