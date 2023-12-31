# 아이템 18 매핑된 타입을 사용하여 값을 동기화하기
### 요약
- 실패에 열린 방법 / 닫힌 방법을 선택할 것.
- 매핑을 통해 또 다른 객체와 정확히 같은 속성을 가지게 하는 것이 이상적이다.

다음은 산점도를 가르키기 위한 UI 컴포넌트다.
```ts
interface ScatterProps {  
  //The data  
  xs: number[];  
  ys: number[];  
  // Display  
  xRange: [number, number];  
  yRange: [number, number];  
  color: string;  
  // Events  
  onClick: (x: number, y: number, index: number) => void;  
}
```

불필요한 작업을 피하기 위해, 필요할 때에만 차트를 다시 그릴 수 있다.
데이터나 디스플레이 속성이 변경되면 다시 그려야 하지만, 이벤트 핸들러가 변경되면 다시 그릴 필요가 없다.

이런 종류의 최적화는 리액트 컴포넌트에서는 일반적인 일인데, 렌더링할 때마다 이벤트 핸들러 Prop이 새 화살표 함수로 설정된다.

최적화하는 방법은 다음과 같다.
### 첫번째
```ts
function shouldUpdate(oldProps: ScatterProps, newProps: ScatterProps) {  
  let k: keyof ScatterProps;  
  for (k in oldProps) {  
    if (oldProps[k] !== newProps[k]) {  
      if (k !== 'onClick') return true;  
    }  
  }  
  return false;  
}
```
만약 새로운 속성이 추가되면 shouldUpdate 함수는 값이 변경될 때마다 차트를 다시 그린다.
-> 보수적 접근법 or 실패에 닫힌 접근법 이라 한다.
이 접근법을 이용하면 차트가 정확하지만 너무 자주 그려질 가능성이 있다.

### 두번째
실패에 열린 접근법이다.
```ts
function shouldUpdate(oldProps: ScatterProps, newProps: ScatterProps) {  
  return (
      oldProps.xs !== newProps.xs ||  
      oldProps.ys !== newProps.ys ||  
      oldProps.xRange !== newProps.xRange ||  
      oldProps.yRange !== newProps.yRange ||  
      oldProps.color !== newProps.color  
    // (no check for onClick)  
  )  
}
```
위 코드는 차트를 불필요하게 다시 그리는 단점을 해결했다.
하지만 실제로 차트를 다시 그려야 할 경우에 누락되는 일이 생길 수 있다.

만약 보안과 관련된 곳이라면 실패에 닫힌 접근법
기능에 무리가 없고 사용성이 중요한 곳이라면 실패에 열린 방법을 사용한다.

그러나 두 가지 최적화 방법 모두 이상적이지 않다. 새로운 속성이 추가될 때 직접 shouldUpdate를 고치도록 하는 게 낫다.
```ts
interface ScatterProps {  
  //The data  
  xs: number[];  
  ys: number[];  
  
  // Display  
  xRange: [number, number];  
  yRange: [number, number];  
  color: string;  
  
  // Events  
  onClick: (x: number, y: number, index: number) => void;  

  // 참고: 여기에 속성을 추가하려면, shouldUpdate를 고치세요!
}
```
이 방법도 최선이 아니며, 타입 체커가 대신할 수 있게 하는 것이 좋다.

### 타입 체커가 동작하도록 개선한 코드
> 핵심은 매핑된 타입과 객체를 사용하는 것

```ts
const REQUIRES_UPDATE: {[k in keyof ScatterProps]: boolean} = {  
  xs: true,  
  ys: true,  
  xRange: true,  
  yRange: true,  
  color: true,  
  onClick: false
}  
  
function shouldUpdate(oldProps: ScatterProps, newProps: ScatterProps) {  
  let k: keyof ScatterProps;  
  for (k in oldProps) {  
    if (oldProps[k] !== newProps[k] && REQUIRES_UPDATE[k]) {  
      return true;  
    }  
  }  
  return false;
}
```

`[k in keyof ScatterProps]`은 타입 체커에게 `REQUIRES_UPDATE`가 ScatterProps과 동일한 속성을 가져야 한다는 정보를 제공한다.
나중에 ScatterProps에 새로운 속성을 추가하는 경우 다음 코드와 같은 형태가 된다.
```ts
interface ScatterProps {  
  // ...
  // 새로운 이벤트 추가
  onDoubleClick: () => void;  
}  
  
const REQUIRES_UPDATE: {[k in keyof ScatterProps]: boolean} = {  // 타입 에러
  xs: true,  
  ys: true,  
  xRange: true,  
  yRange: true,  
  color: true,  
  onClick: false,  
}
```
속성을 삭제하거나 이름을 바꾸어도 비슷한 오류가 발생한다.
여기서 boolean 값을 가진 객체를 사용했다는 점이 중요하다. 

실제 사용 예시이다.
```ts
// 사용자 계정 정보를 표현하는 인터페이스 타입  
interface UserAccount {  
  email: string;  
  nickName : string;  
  password: string;  
  age : number;  
  readonly signInDate : Date;  
  info: string;  
}  
  
// 유저 정보 수정 매핑
// 특정 property를 업데이트 하기 위한, 업데이트 flag
const USER_ACCOUNT_UPDATE: { [k in keyof UserAccount]: boolean } = {  
  email: false,  
  nickName : true,  
  password: true,  
  age : false,  
  signInDate : false,  
  info: false,
}

// 유저 정보 수정 예시 코드
function updateUserInfo(oldInfo: UserAccount, newInfo: UserAccount) {
  let p: keyof UserAccount;
  for (p in oldInfo) {
    if (oldInfo[p] !== newInfo[p] && USER_ACCOUNT_UPDATE[p]) {
      return true;
    }
  }
  return false;
}
```

배열을 사용했다면 다음과 같은 코드가 된다.
```ts
const PROPS_REQUIRING_UPDATE: (keyof ScatterProps[]) = [  
  'xs',  
  'ys',  
  // ...
]
```

최적화 예제처럼 실패에 열린 방법을 선택할지, 닫힌 방법을 선택할지 정해야 한다.
매핑된 타입은 한 객체가 또 다른 객체와 정확히 같은 속성을 가지게 할 때 이상적이다.
매핑된 타입을 사용해 타입스크립트가 코드에 제약을 강제하도록 할 수 있다.
