## [아이템 14] 타입 연산과 제너릭 사용으로 반복 줄이기
### 요약
>타입이 중복되지 않도록 type.ts 파일로 관리하기
>
>중복되는 타입은 변수로 지정하기
>
>유틸리티 타입으로 기존 타입, 자바스크립트 값 활용하기


## 1. 중복을 새로운 선언으로 해결하기
- [ ] 중복되는 타입 선언은 `type 타입명 = 내용`으로 줄이자.

### X
```ts
interface Props {
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  onTouchStart?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
```

### O
```ts
type Handler = () => void;

interface ProfileProps {
  onMouseOver?: Handler;
  onMouseOut?: Handler;
  onTouchStart?: Handler;
  onFocus?: Handler;
  onBlur?: Handler;
}
```
    
## 2. 중복을 기존의 타입을 이용해서 해결하기
- [ ] interface의 중복은 `extends`를 이용하자.
### X
```ts
interface Props {
  onMouseOver?: () => void;
  onMouseOut?: () => void;
}

interface newProps {
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  onTouchStart?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
```

### O
```ts
interface Props {
  onMouseOver?: () => void;
  onMouseOut?: () => void;
}

interface newProps extends Props {
  onTouchStart?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
```

- [ ] 객체 타입은 인덱싱을 이용하자.

     `{새로운 속성 타입 : 기존interface["재사용할 속성"]}`의 형태로 사용한다.

### O
```ts
interface Props {
  onMouseOver?: () => void;
  onMouseOut?: () => void;
}

type newProps {
  onTouchStart?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
```
   
- [ ] 타입 매핑을 이용하자.
   
     `{[k in {반복문을 실행할 유니온 타입}]: 기존interface[k]}`의 형태로 사용한다.

### X
```ts
type Handler = () => void;

interface ProfileProps {
  onMouseOver?: Handler;
  onMouseOut?: Handler;
  onTouchStart?: Handler;
  onFocus?: Handler;
  onBlur?: Handler;
}
```

### O
```ts
type Handler = () => void;

type HandlerName = "onMouseOver" | "onMouseOut" | "onTouchStart" | "onFocus" | "onBlur"

type Props = {
  [k in HandlerName ]: Handler;
}
```

- [ ] 유틸리티 타입을 이용하자.

     `pick`, `partial`

- [ ] keyof를 이용하자.

     `keyof 객체 타입`의 형태로 객체 타입의 속성만 유니온 타입으로 가져올 수 있다.

     `객체 타입[keyof 객체타입]`의 형태로 객체 타입의 값을 유니온 타입으로 가져올 수 있다.

## 3. 중복을 기존의 값을 이용해서 해결하기
- [ ] `typeof 값`으로 기존 값 형태를 타입으로 바꾸어 이용하자.

- [ ] `ReturnType<함수>`로 함수와 메서드의 리턴값을 이용하자.
  
