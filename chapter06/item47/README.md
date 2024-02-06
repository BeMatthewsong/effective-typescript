# 아이템 47 공개 API에 등장하는 모든 타입을 export하기

### 요약

- 사용하는 모든 타입은 export하기

---

```tsx
interface SecretName {
  first: string;
  last: string;
}

interface SecretSanta {
  name: SecretName;
  gift: string;
}

export function getGift(name: SecretName, gift: string): SecretSanta {}

// 타입 추출하기
type MySanta = ReturnType<typeof getGift>; //SecretSanta
type MyName = Parameters<typeof getGift>[0]; //SecretName
```

- SecretName과 SecretSanta는 직접 import 할 수 없고 getGift만 import 가능합니다.
- 하지만 export된 함수 시그니처에 등장하기 때문에 `Parameters` & `ReturnType` 제너릭 타입을 사용하여 추출이 가능합니다.

- [타입스크립트 유틸리티 타입들](https://www.typescriptlang.org/ko/docs/handbook/utility-types.html#returntypetype)

## 결론

### 굳이 숨기려 하지 말고 명시적으로 타입을 export 하는 것이 좋다

### export를 권장하는 이유가 명시적으로 타입을 export 하지 않더라도 접근이 가능하기 때문에 애초에 처음부터 모든 type을 export 하는 느낌으로 받아들여집니다
