# [아이템 39] any를 구체적으로 변형해서 사용하기

## 요약

- ### any 타입을 사용해야 하는지 확인
- ### any를 사용해야 한다면 더 정확하게 모델링할 수 있도록 `any[]` 또는 `{[id: string]: any}` 또는 `() => any` 처럼 구체적인 형태를 사용하자

## 배열 구체화

```tsx
const getLengthBad = (arr: any) => arr.length;
const getLengthGood = (arr: any[]) => arr.length;

getLengthBad(/123/); // 에러 탐지 불가
getLengthGood(/123/); // Argument of type 'RegExp' is not assignable to parameter of type 'any[]'.
```

- 매개변수가 배열인지 체크
- 함수의 arr.length 의 타입이 number로 추론됨

## 객체 구체화

```tsx
const hasTwelveLetterKey = (o: object) => {
  for (const key in o) {
    if (key.length === 12) {
      console.log(key, o[key]); // object 타입은 속성에 접근 불가
      return key;
    }
  }
  return false;
};
```

- 타입스크립트 객체의 속성에 대한 타입을 추론을 못하기 때문에 `index signature`를 사용한다.

  ```tsx
  // 객체 형태로 추론한다.
  interface KeyedObject {
    [key: string]: any;
  }

  const hasTwelveLetterKey = (o: KeyedObject) => {
    for (const key in o) {
      if (key.length === 12) {
        console.log(key, o[key]);
        return key;
      }
    }
    return false;
  };
  ```

## 함수 구체화

```tsx
type FnAny = any; // 추천 X

type Fn0 = () => any; // 매개변수 없이 호출 가능한 함수
type Fn1 = (arg: any) => any; // 매개변수가 1개 필요한 함수
type FnN = (...args: any[]) => any; // 모든 개수의 매개 변수
```
