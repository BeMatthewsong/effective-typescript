# 타입스크립트와 자바스크립트의 관계 이해하기
---

## 빠르게 훝기

- **타입스크립트는 자바스크립트의 상위집합이다.**<br/> 
그렇기에 모든 자바스크립트 프로그램은 이미 타입스크립트 프로그램이다. 
(반대로는 성립할 수 없다.) <br/>
<br/>

- 타입스크립트는 자바스크립트 런타임 동작을 모델링하는 타입 시스템을 가지고 있기 때문에 **런타임 오류를 발생시키는 코드를 미리 찾아내려고 한다.** 
(단, 모든 오류를 찾아낼 거라는 기대를 하지 마라)
<br/>

- 타입스크립트는 의도와 다르게 동작하는 코드를 찾아내고 나름 훌륭한 해결책을 주지만 늘 정확하지는 않다
<br/>

- 자바스크립트의 런타임 동작을 모델링하는 것은 타입스크립트 타입 시스템의 기본 원칙이다.
---


## 타입스크립트는 자바스크립트이지만, 자바스크립트는 타입스크립트가 아니야

모든 자바스크립트 프로그램이 타입스크립트라는 명제는 참이지만, 그 반대는 성립하지 않는다. <br/>
왜냐하면, 타입스크립트에는 타입을 명시하는 추가적인 문법이 있기 때문이다. <br/>
그렇기에 `.js 파일`에 있는 코드를 타입스크립트라고 할 수 있다. <br/>

이러한 특징은 자바스크립트에서 타입스크립트로 마이그레이션할 때 엄청난 이점이다.



## 타입스크립트 컴파일러는 타입 구문이 없는 자바스크립트에서도 유용하다


타입스크립트 컴파일러는 타입스크립트뿐만 아니라 일반 자바스크립트 프로그램에도 유용하다. <br/>


아래와 같은 코드에는 타입 구문이 없지만 타입 체커는 문제점을 찾아낸다. 
```js
let city = 'new york city';
console.log(city.toUppercase());
// ~~~~~~~~~~~~~~ 'toUppercase' 속성이 'string' 형식에 없습니다.
//                'toUppercase'를 사용하시겠습니까?
```

**여기서 알 수 있는 점은 타입 시스템이 런타임에 오류를 발생시킬 코드를 미리 찾아낸다는 점이다.** <br/>

또 다른 예시로는 **타입스크립트 타입 체커는 의도한 코드가 맞는지 물어보고 해결책을 제시한다**.
```js
const states = {
  {name: 'Alabama', capital: 'Mongomery' },
  {name: 'Alaska', capital: 'Juneau' },
  {name: 'Arizona', capital: 'Phoenix' },
}

for (const state of states) {
  console.log(state.capitol);  // capital이 아닌 capitol로 쓴 상황
}
```

```js
// 콘솔 출력 결과 -- 런타임에는 아무런 문제가 없다.
undefined
undefined
undefined
```

여기서 타입 체커는 해결책을 제시합니다.
```js
const states = {
  {name: 'Alabama', capital: 'Mongomery' },
  {name: 'Alaska', capital: 'Juneau' },
  {name: 'Arizona', capital: 'Phoenix' },
}

for (const state of states) {
  console.log(state.capitol);  // capital이 아닌 capitol로 쓴 상황
                // ~~~~~~~~~~ 'capitol' 속성이 ... 형식에 없습니다.
                //            'capital' 을 사용하시겠습니까?
}
```

그래서 설계할 당시에 타입 설계를 체계적으로 하면 타입 체커는 좋은 해결책을 계속 제시할 것이다. 

```ts
interface State {
  name: string;
  capital: string;
} // 추가 코드

const states: State[] = {
  {name: 'Alabama', capital: 'Mongomery' },
  {name: 'Alaska', capital: 'Juneau' },
  {name: 'Arizona', capitol: 'Phoenix' },
                      // ~~~~~~~~ 'State' 형식에 'capitol'이 없습니다.
                      //          'capital'을 쓰려고 했습니까?  (Good)
}

for (const state of states) {
  console.log(state.capital); 
}
```

## 타입 시스템은 자바스크립트의 런타임 동작을 모델링하다

아래 같은 코드를 보면 도대체 어느 장단에 북을 치고 장구를 쳐야 할지에 대한 고민이 깊어질 것이다.
```ts
const x = 2 + '3'; // 정상, string 타입입니다.
const y = '2' + 3; // 정상, string 타입입니다.

const a = null + 7 // 자바스크립트에서는 a = 7, 타입스크립트는 '+' 연산자를 ... 형식에 적용할 수 없습니다 라는 오류 제시한다.
const b = [] + 12 // 자바스크립트에서는 b = 12, 타입스크립트는 '+' 연산자를 ... 형식에 적용할 수 없습니다 라는 오류 제시한다.
```

**이와 같이 등장한 오류들이 발생하는 근본 원인은 타입스크립트가 이해하는 값의 타입과 실제 값에 차이가 있기 때문이다.** <br/>
타입 시스템이 정적 타입의 정확성을 보장해줄 것 같지만 사실은 그렇지 않다. 

---
## 소견
타입스크립트는 프로그램 설계 당시 개발자가 의도를 정하고 그 의도에 맞게 코드를 작성해주고, 타입에 맞는 코드를 유도하고, 런타임 이전에 오류를 미리 잡아주기 위해 사용한다고 생각합니다.  

- 타입스크립트의 자동완성 : 오타나 각 데이터에 필요한 값인지 확인할 수 있다.
- 타입스크립트의 타입 체커 : 각 타입에 맞는 메소드, 매개변수, 리턴값인지 계속 확인한다.
- 타입스크립트의 컴파일 : 런타임하기 이전에 오류를 잡아낸다. 

---
## 질문 1 : 컴파일 단계에서 알 수 없고 런타임 되어야 알 수 있는 에러를 확인하는 방법 
```js
const names = ['alice', 'bob'];
console.log(names[2].toUpperCase());

// TypeError: Cannot read properties of undefined (reading 'toUpperCase')
```
질문)
> kses1010 : 실제로 컴파일 단계에서는 알 수 없고 런타임을 돌려야 알 수 있습니다. 이와 반대로 정적 언어인 자바에서는 해당 warning이라도 뜨는데 타입스크립트에서는 바로 확인하는 방법은 없을까요?

팀원 답변)
> han-kimm : 타입스크립트는 배열의 경우, item의 자료형을 바탕으로 타입을 추론합니다. <br/>
따라서 개수까지 타입으로 한정하고 싶다면, `const names = ['alice', 'bob'] as const` 에서 `as const`를 이용해서 readonly 타입로 만들어주어야 합니다.
이와 비슷한 용례로, `const obj = { a: "alice", b:"bob" }` 의 예시가 있는데요.
`obj.a` 의 타입 추론이 `string`이 됩니다. <br/>
만약 `"alice"`라는 특정값을 리터럴 타입으로 사용하고 싶다면
`const obj = { a: "alice", b:"bob" } as const`로 선언하세요.

추가 답변)
타입 시스템 상으로 오류가 아니기 때문에 컴파일 단계에서는 통과됩니다. 
- `as const`라고 해서 리터럴 타입으로 명시해서 배열의 요소의 개수를 제한하는 방법이 있습니다.
- 혹은 튜플로 개수 제한을 줄 수 있습니다.

## 질문 2 : Reason이나 Elm언어가 어떤 방식으로 정확성을 보여주는지 궁금해요

답변) 잘 모르는 내용이라 예시 코드만 제시하도록 하겠습니다.

### Reason 예시 코드
```reason
/* 간단한 덧셈 함수 예시 */
let add = (a, b) => {
  a + b;
};

/* 리스트 매핑 예시 */
let numbers = [1, 2, 3, 4, 5];
let doubledNumbers = List.map((x) => x * 2, numbers);

/* 레코드(Record) 예시 */
type person = {
  name: string,
  age: int,
  email: string,
};

let user: person = {
  name: "John",
  age: 25,
  email: "john@example.com",
};
```

### Elm 예시 코드
```Elm
- 모듈 선언
module Main exposing (..)

-- 모델 정의
type Model = 
    { message : String }

-- 초기 모델
init : Model
init = 
    { message = "안녕하세요, Elm!" }

-- 메시지 타입 정의
type Msg
    = ChangeMessage String

-- 업데이트 함수
update : Msg -> Model -> Model
update msg model =
    case msg of
        ChangeMessage newMessage ->
            { model | message = newMessage }

-- 뷰 함수
view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text model.message ]
        , input [ onInput ChangeMessage ] []
        ]

-- Elm 프로그램 시작
main =
    Browser.sandbox { init = init, update = update, view = view }
```
