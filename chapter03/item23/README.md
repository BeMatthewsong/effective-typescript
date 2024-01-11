# 아이템 23 한꺼번에 객체 생성하기
### 요약
- 속성을 각자 따로 추가하지 말고 한꺼번에 객체로 만드는게 좋다.
- 속성을 추가하고 싶다면 스프레드문법(`...`)을 활용하자.


타입스크립트의 타입은 일반적으로 변경되지 않는다.
이러한 특성 덕분에 일부 자바스크립트 패턴을 타입스크립트로 모델링하는게 쉬워진다.
-> 객체를 생성할 때는 속성을 하나씩 추가하기보다는 여러 속성을 포함해서 한꺼번에 생성해야 타입 추론이 유리하다.

다음 코드는 자바스크립트에서 2차원 점을 표현하는 객체를 생성하는 방법이다.
```js
const pt = {};  
pt.x = 3;  
pt.y = 4;
```
타입스크립트에서는 각 할당문에 오류가 발생한다.
```ts
const pt = {};  
pt.x = 3; // {} 형식에 'x' 속성이 없습니다.
pt.y = 4; // {} 형식에 'y' 속성이 없습니다.
```
첫 번째 줄의 pt 타입은 `{}` 값을 기준으로 추론되기 때문이다. 존재하지 않는 속성을 추가할 수는 없다.

만약 Point 인터페이스를 정의한다면 오류가 다음처럼 바뀐다.
```ts
interface Point {  
  x: number;  
  y: number;  
}  
const pt: Point = {}; // {} 형식에 'Point' 형식의 x, y 속성이 없습니다.
pt.x = 3;  
pt.y = 4;
```
위 코드들의 문제들은 객체를 한번에 정의하면 해결할 수 있다.
```ts
interface Point {  
  x: number;  
  y: number;  
}  
const pt: Point = {  
  x: 3,  
  y: 4  
}; // 정상
```

객체를 반드시 제각각 나눠서 만들어야 한다면, 타입 단언문(as)을 사용해 타입 체커를 통과하게 할 수 있다.
```ts
interface Point {  
  x: number;  
  y: number;  
}  
const pt= {} as Point;  
pt.x = 3;  
pt.y = 4;
```


### 객체 전개 연산자 (`...`)
작은 객체들을 조합해서 큰 객체를 만들어야 하는 경우에도 여러 단계를 거치는 것은 좋은 생각은 아니다.
```ts
const pt = {x: 3, y: 4};  
const id = {name: 'Pythagoras'};  
const namedPoint = {};  
Object.assign(namedPoint, pt, id);  
namedPoint.name; // {} 형식에 'name' 속성이 없다.
```

다음과 같이 객체 전개 연산자`...` 를 사용하면 큰 객체를 한꺼번에 만들어 낼 수 있다.
```ts
const pt = {x: 3, y: 4};  
const id = {name: 'Pythagoras'};  
const namedPoint = {...pt, ...id};  
namedPoint.name;
```

객체 전개 연산자를 사용하면 타입 걱정 없이 필드 단위로 객체를 생성할 수도 있다.
이때 모든 업데이트마다 새 변수를 사용하여 각각 새로운 타입을 얻도록 하는게 중요하다.
```ts
const pt0 = {};  
const pt1 = {...pt0, x: 3};  
const pt: Point = {...pt1, y: 4};
```
이 방법은 간단한 객체를 만들기 위해 우회하기는 했지만(객체 복사), 객체에 속성을 추가하고 타입스크립트가 새로운 타입을 추론할 수 있게 해 유용하다.

타입에 안전한 방식으로 조건부 속성을 추가하려면, 속성을 추가하지 않는 `null` or `{}`으로 객체 전개를 사용하면 된다.
```ts
declare let hasMiddle: boolean;  
const firstLast = {first: 'Harry', last: 'Truman'};  
const president = {...firstLast, ...(hasMiddle ? {middle: 'S'} : {})};

// president의 타입
interface president: {
  middle?: string;
  first: string;
  last: string;
}
```
전개 연산자로 한꺼번에 여러 속성을 추가할 수도 있다.
```ts
declare let hasDates: boolean;  
const nameTitle = {name: 'Khufu', title: 'Pharaoh'};  
const pharaoh = {  
  ...nameTitle,  
  ...(hasDates ? {start: -2589, end: -2566} : {})  
};

// pharaoh의 타입
const pharaoh: {
  start?: number | undefined,
  end?: number | undefined,
  name: string,
  title: string
} // 책에서는 4.0.5 기준이고 최근 버전에서는 이렇게 타입이 제공된다.
```

- 가끔 객체나 배열을 변환해서 새로운 객체나 배열을 생성하고 싶다면?
루프 대신 내장된 함수형 기법 또는 `Lodash` 같은 유틸리티 라이브러리를 사용하는 것이 좋다.
