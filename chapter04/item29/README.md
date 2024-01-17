# 아이템 29: 사용할 때는 너그럽게, 생성할 때는 엄격하게

## 결론
- **함수의 매개변수는 타입의 범위가 넓어도 되지만, 결과를 반환할 때는 일반적으로 타입의 범위가 더 구체적이여야 합니다.**

###### 왜 이렇게 하나요?
- 매개변수와 반환 타입의 재사용을 위해서 기본 형태(반환 타입)와 느슨한 형태(매개변수 타입)를 도입하는 것이 좋다.

## 본론
포스텔의 법칙 
> "자신의 출력은 엄격하게 (strict) 검증하되, 다른 사람의 입력은 관대하게 (liberal) 받아들이라"

이는 인터넷 프로토콜을 설계하고 구현하는 방식에 대한 기본 지침으로, 이로 인해 다양한 프로토콜과 시스템이 호환성을 유지하면서 효과적으로 동작할 수 있게 됩니다.

### 타입스크립트에서 바라보는 포스텔의 법칙
이는 함수 시그니처의 타입에도 적용되는 말이다. <br/>
함수의 매개변수는 타입의 범위가 넓어도 괜찮지만, 결과를 반환할 때는 일반적으로 타입의 범위가 구체적이어야 한다.

### 매개변수는 어떻게 느슨하게 해? 어떻게 범위를 넓혀?
- 옵셔널 프로퍼티
- 유니온 타입

```ts
interface LngLat {
  lng: number // 경도
  lat: number // 위도
}

// 느슨한 타입으로 만들기 (유니온 타입)
type LngLatLike = LngLat | { lon: number; lat: number } | [number, number]
```

### 반환 타입은 어떻게 엄격하게 해?
엄격 => 느슨하게 하지 마!
(유니온 타입, 옵셔널 프로퍼티를 자제하자.)

```ts
interface Camera {
  center: LngLat
  zoom: number
  bearing: number
  pitch: number
}
```

### 예제 합쳐서 다시 살펴보기
```ts
interface LngLat {
  lng: number
  lat: number
}
// 느슨한 타입 (매개변수)
type LngLatLike = LngLat | { lon: number; lat: number } | [number, number]

// 엄격한 타입 (반환값)
interface Camera {
  center: LngLat
  zoom: number
  bearing: number
  pitch: number
}

// 카메라 옵션은 선택적이다. 이 중, center 속성은 느슨한 타입을 적용 (매개변수)
interface CameraOptions extends Omit<Partial<Camera>, 'center'> {
  center?: LngLatLike
}

// 위도경도 범위 (매개변수)
type LngLatBounds =
  | { northeast: LngLatLike; southwest: LngLatLike }
  | [LngLatLike, LngLatLike]
  | [number, number, number, number]

declare function setCamera(camera: CameraOptions): void

// 매개변수는 느슨하지만 반환 타입은 Camera로 범위가 좁다.
declare function viewportForBounds(bounds: LngLatBounds): Camera
```
