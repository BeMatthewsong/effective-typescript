# [아이템 32] 유니온의 인터페이스보다는 인터페이스의 유니온을 사용하기

## 요약

- ### Interface 구현 시 속성간의 관계를 분명히 하자

- ### 태그된 유니온은 타입스크립트와 매우 잘 맞기 때문에 자주 볼 수 있는 패턴이기 때문에 사용하자

---

### 문제 상황

- 하나의 인터페이스 안에서 유니온을 사용한 경우
  ```tsx
  interface Layer {
    layout: FillLayout | LineLayout | PointLayout;
    paint: FillPaint | LinePaint | PointPaint;
  }
  ```
  - 개발자가 Fill, Line, Point 단위로 사용하려고 하는 경우 `FillLayout, PointPaint` 값이 들어가면 오류가 나지만 Layer Interface에서는 **속성 간의 관계가 명확하지 않기 떄문에 오류를 방지하기 어렵다**

### 해결방안

#### 태그된 유니온(구분된 유니온) 사용

- 특정 속성을 통해 값이 속하는 interface를 식별할 수 있는 경우를 일컫는 말

```tsx
// 각각의 interface들이 분리되어 있다
interface FillLayer {
  layout: FillLayout;
  paint: FillPaint;
}

interface LineLayer {
  layout: LineLayout;
  paint: LinePaint;
}

interface PointLayer {
  layout: PointLayout;
  paint: PointPaint;
}

type Layer = FillLayer | LineLayer | PointLayer;
```

```tsx
interface FillLayer {
  type: "fill"; // type이라는 속성을 통해 interface 식별 가능
  layout: FillLayout;
  paint: FillPaint;
}

interface LineLayer {
  type: "line";
  layout: LineLayout;
  paint: LinePaint;
}

interface PointLayer {
  type: "point";
  layout: PointLayout;
  paint: PointPaint;
}

type Layer = FillLayer | LineLayer | PointLayer;

// switch case 문을 통한 타입 범위 좁히기
function drawLayer(layer: Layer) {
  switch (layer.type) {
    case "fill":
      const { paint } = layer; // Type: FillPaint
      const { layout } = layer; // Type: FillLayout
      break;
    case "line":
      const { paint } = layer; // Type: LinePaint
      const { layout } = layer; // Type: LineLayout
    case "point":
      break;
    default:
      break;
  }
}
```

---

### 문제 상황

- 주석에 적혀져 있는 상황을 의도했지만 한 개만 들어있어도 작동이 되는 문제

  ```tsx
  interface Person {
    name: string;
    // 둘 다 동시에 있거나 동시에 없음
    placeOfBirth?: string;
    dateOfBirth?: Date;
  }
  ```

  👍 더 좋은 설계방법

  ```tsx
  interface Person {
    name: string;
    birth?: {
      place: string;
      date: Date;
    };
  }
  ```

- 타입 구조에 손대지 못할 때도 인터페이스 유니온을 사용해서 속성간의 관계를 정의 가능

  ```tsx
  interface Name {
    name: string;
  }

  interface PersonWithBirth extends Name {
    placeOfBirth: string;
    dateOfBirth: Date;
  }

  type Person = Name | PersonWithBirth;
  ```
