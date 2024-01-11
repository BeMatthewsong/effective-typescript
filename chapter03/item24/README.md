# 아이템 24: 일관성 있는 별칭 사용하기

## 요약 
- 별칭(= 지역 변수)은 타입 좁히기를 방해한다 (_타입 별칭과 헷갈리지 말자_)
- 변수에 별칭을 사용할 때는 일관되게 사용해야 한다. (런타임에서 문제없어도 타입 범위가 달라질 수 있다.)
- 일관성 있게 별칭 사용하는 방법은 **객체 비구조화**이다.
- 함수의 호출이 객체 속성의 타입 정제(타입 좁히기 등)을 무효화할 수 있다는 점을 주의해야 합니다. 문제를 최소화 하기 위해서 객체나 속성을 사용하기 보다는 지역변수(별칭)을 사용하는 것이 좋습니다.


## 별칭을 수정하면 원본 객체도 수정된다

###### 자바스크립트 별칭 예제
```ts
const borough = {name: 'Brooklyn', location: [40.688, -73.979]};
// 별칭 생성
const loc = borough.location;
// 별칭의 값을 변경하면 원본도 바뀜
loc[0] = 0;

console.log(loc); // [0, -73.979] 
```

이렇게 별칭을 많이 사용하게 되면 기존의 데이터 값의 흐름을 분석하는 데 어려움이 생긴다!


## 타입스크립트에서도 마찬가지로 별칭을 신중하게 쓰자!

###### 다음과 같은 타입 정의가 있다 하자

```ts
// Coordinate (좌표계)
interface Coordinate {
	x: number;
	y: number;
}

// BoundingBox (다각형을 감싸는 가장 작은 직사각형 영역 = x, y 범위)
interface BoundingBox {
	x: [number, number];
	y: [number, number];
}

// Polygon (다각형)
interface Polygon {
	exterior: Coordinate[]; // 외부
	holes: Coordinate[][]; // 다각형 내에 비어있는 부분
	bbox?: BoundingBox; // 해당 영역
}
```

### 문제 상황 발생

###### polygon.bbox를 별도의 box로 별칭했고, 제어 흐름 분석을 방해하고 있다
```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
	const box = polygon.bbox; // 별칭 사용
	if (polygon.bbox) {
		if (pt.x < box.x[0] || pt.x > box.x[1] ||
		//         ~~~~~~~~           ~~~~~~~ 객체가 'undefined'일 수 있습니다. (타입 좁히기 안 됨)
			pt.y < box.y[0] || pt.y > box.y[1]) {
		//       ~~~~~~~~           ~~~~~~~ 객체가 'undefined'일 수 있습니다. (타입 좁히기 안 됨)
		return false;
	}
}

// ...
}
// strictNullChecks를 활성화했다고 가정
```

###### 별칭으로 인해 꼬인 제어 흐름 살펴보기
```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
   polygon.bbox // BoundingBox | undefined
   const box = polygon.bbox;
   box // BoundingBox | undefined
  if (polygon.bbox) {
      polygon.bbox // undefined 정제됨, BoundingBox 타입만 가짐
      box // undefined 정제 안됨, BoundingBox | undefined 타입 가짐 
  }
}
```
box는 polygon.bbox와 다르게 if를 통해 타입이 좁혀지지 않았다! 그래서 별칭은 타입 좁히기를 방해한다는 사실을 알 수 있다.

### 해결책: 별칭을 일관성 있게 사용하자
#### 일관성 있는 방식은? 바로 객체 비구조화 !
###### 객체 비구조화로 간결한 문법으로 일관된 이름의 규칙을 얻을 수 있다. (결론: 이상한 이름으로 별칭하지 말자!)
```ts
function isPointInPolygon(polygon: Polygon, pt: Coordinate) {
  const {bbox} = polygon; // Look at this!
  if (bbox) {
    const { x, y } = bbox;
	  if (pt.x < x[0] || pt.x < x[1] ||
				pt.y < y[0] || pt.y < y[1]) {
					return false;
    }
  }
	// ...
}
```

## 함수의 호출이 객체 속성의 타입 좁히기를 무효화할 수 있다는 점을 주의해야 한다.

```ts
function fn(p: Polygon) { /* ... */ }

// 타입이 달라질 수 있음 (주의)
polygon.bbox  // Type is BoundingBox | undefined
if (polygon.bbox) {
  polygon.bbox  // Type is BoundingBox
  fn(polygon); // 함수 호출 
  polygon.bbox  // Type is still BoundingBox
}
```

polygon.bbox 대신에 bbox 라는 지역 변수로 뽑아내서 사용하면 bbox의 타입은 정확히 유지될 수 있다.
반면에 polygon.bbox의 값은 같게 유지되지 않을 수 있다.

```ts
function fn(p: Polygon) { /* ... */ }

const {bbox} = polygon  // Type is BoundingBox | undefined 
if (bbox) {
  bbox  // Type is BoundingBox
  fn(polygon); // 함수 호출 
  bbox  // Type is BoundingBox
}
```
