# 아이템 02. 타입스크립트 설정 이해하기
## 타입스크립트 설정
### `tsc --init`
 타입스크립트 설정 파일인 `ts.config`을 만드는 명령어. <br/>설정파일을 공유하고 재사용할 수 있으므로 **추천!!**
### `tsc --(설정옵션) program.ts`
 설정 파일 없이 터미널에서 타입스크립트 설정하는 명령어.
 
ex) `tsc --noImplicitAny program.ts` | `'a'는 암시적으로 'any' 형식이 포함됩니다.'`를 송출하게 하는 설정.<br/>`tsc --strictNullChecks program.ts` | <br> `'null' 형식은 'string' 형식에 할당할 수 없습니다.'` null, undefined 값이 다른 타입의 변수에 할당되지 못하게 검사합니다.

<br>

## 여기서 잠깐, strictNullChecks는 왜 설정할까요?
### `undefined is not Object.` 또는 `cannot read properties of undefined`
null과 undefined를 체크하지 않으면 날 수 있는 오류입니다.
```
function Component() {
  const ref = useRef();

  // StrickNullChecks 사용 전,
  // useRef는 Component가 마운트 될 때 ref.current에 input 태그를 할당되므로, 처음에는 null 입니다.
  // 따라서 이 코드는 런타임에러를 일으킵니다!
  // strictNullChecks를 사용하지 않으면 해당 오류를 런타임 실행 전 확인할 수 없습니다.
  console.log(ref.current.value)

  // strictNullChecks 사용 후,
  //이 상황에서는 타입 가드를 사용합니다.
  if (ref.current) {
    console.log(ref.current.value)
  }


  // 이 상황에서는 핸들러 함수가 호출되는 시점은 ref.current가 확실하게 있으므로, 타입 단언을 사용할 수 있습니다.
  // 그러나, 타입 단언은 개발자가 IDE보다 정보가 많을때 사용하는 문법이어서 타입체크를 고의로 무시하게 됩니다.
  // 또, 코드를 읽는 다른 사람들과의 정보 격차가 생깁니다.
  // 이 격차가 코드의 가독성, 그리고 유지보수에 영향을 주므로, **!!타입 단언을 사용하지마세요!!**
  const handleChange = () => {
    ref.current!.value
 }


  return <input ref={ref} />
}
```

<br/>

## 질문
차후 작성하겠습니다.
