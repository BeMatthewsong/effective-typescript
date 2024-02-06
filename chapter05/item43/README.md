# [아이템 43] 몽키 패치보다는 안전한 타입을 사용하기

> - 내장 타입에 데이터를 저장하는 경우, 안전한 타입 접근법을 사용하자
> - 몽키 패치를 남용하지 말자

## 몽키 패치란?

몽키 패치는 이미 있던 코드에 추가 기능을 위해 코드 기본 동작을 변경하는 것을 의미한다.

예시로 `console.log`를 확징하여 타임스탬프를 찍도록 만드는 것을 들 수 있다.

그러나 몽키 패치의 경우 기존 코드와의 충돌이 있을 수 있기에 위험한 기술로 간주된다.
또한 타입스크립트에서는 기본 내장 속성 이외에 임의로 추가한 속성에 대해 알지 못하기에 타입 체커가 오류를 발생시킨다.

```ts
document.monkey = 'Daniel';
//      ~~~~~~~~ "Document" 유형에 "monkey" 속성이 업습니다.

(document as any).monkey = 'Daniel'; // 타입 체커는 통과하지만 타입 안정성을 상실하게 됨
```

## 안전한 타입 접근법

### 보강 (augmentation)

interface의 특수 기능인 보강을 사용하면 다음과 같은 장점들이 있다.

- 타입체커가 활성화 되어 더 안전한 타입이 된다.
- 속성에 주석을 붙일 수 있다.
- 속성에 자동완성을 사용할 수 있다.
- 몽키 패치가 어느 부분에 사용되는지 정확한 기록이 남게 된다.

이때 모듈의 관점에서 제대로 동작하기 위해서는 global 선언을 추가해아 한다.

```ts
declare global {
  interface Document {
    /** 몽키 패치로 추가한 monkey 속성 */
    monkey: string;
  }
}

document.monkey = 'Daniel';
```

### 구체적인 타입 단언문 사용

다음과 같이 구체적인 타입 단언문을 사용하면 Document 타입을 건드리지 않고 새로운 타입을 확장하여 사용하기에 모듈 영역 문제가 해결된다.

```ts
interface MonkeyDocument extends Document {
  /** 몽키 패치로 추가한 monkey 속성 */
  monkey: string;
}

(document as MoneyDocument).money = 'Daniel';
```
