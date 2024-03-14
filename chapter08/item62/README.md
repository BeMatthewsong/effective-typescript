# [아이템 62] 마이그레이션의 완성을 위해 noImplicitAny 설정하기

## ⭐️ 요약
- noImplicitAny 설정은 마이그레이션 마지막 단계에서 진행해야 합니다.
- 로컬에서부터 타입 오류를 점진적으로 수정해야 합니다.


## noImplicitAny 설정을 하지 않으면, 타입 체크는 매우 허술해진다.
> noImplicitAny는 암묵적으로 any 타입을 가지는 것을 허락하지 않습니다.

프로젝트를 ts로 전환 후 마지막 단계로 noImplicitAny를 설정해줘야 합니다. noImplicitAny를 설정함으로써 타입 선언에서 비롯되는 실제 오류를 발견할 수 있기 때문입니다.

```ts
class Chart {
  indices: any;

  // ...
}
```
indices는 숫자 배열인 것으로 보여 number[] 타입으로 수정하고 오류가 사라진 것처럼 보입니다.
```ts
class Chart {
  indices: number[];

  // ...
}
```
실제로는 number[]는 잘못된 타입입니다. 아래와 같은 메소드가 있기 때문입니다.
```ts
getRanges() {
  for (const r of this.indices) {
    const low = r[0];    // 타입이 any
    const high = r[1];   // 타입이 any
		// ...
  }
}
```
해당 함수를 보면, indices는 `number[]` 타입이 아닌 `number[][]` 또는 `[number, number][]`의 타입임을 알 수 있습니다.

그러나, indices가 `number[]`로 선언되어 있기 때문에, r은 `number` 타입으로 추론됩니다.

r이 `number` 타입이지만 배열 인덱스 접근에 오류가 발생하지 않는다는 점이 중요합니다.

이처럼 noImplicitAny를 설정하지 않으면, 타입 체크가 허술해지는 모습을 볼 수 있습니다.

그래서 noImplicitAny를 설정하고 나면 다음과 같이 바뀝니다.

```ts
getRanges() {
  for (const r of this.indices) {
    const low = r[0];    // 'Number' 형식에 인덱스 시그니처가 없으므로 요소에 암시적으로 'any'형식이 있습니다.
    const high = r[1];   // 'Number' 형식에 인덱스 시그니처가 없으므로 요소에 암시적으로 'any'형식이 있습니다.
		// ...
  }
}
```

이처럼 noImplicitAny를 사용하면 타입선언과 관련된 실제 오류를 발견할 수 있으나, 처음 마이그레이션을 진행할 때는 noImplicitAny를 로컬에만 설정하고 작업하는 것이 좋습니다.

왜냐하면, 원격에도 동일하게 noImplicitAny를 설정하고 빌드하게 된다면, 빌드가 실패할 것이기 때문에, 로컬에서만 오류로 인식시키고 오류를 하나씩 수정함으로써, 점진적으로 마이그레이션을 할 수 있기 때문입니다.
