# [아이템 49] 콜백에서 this에 대한 타입 제공하기 (초안) ❓❓❓

# ⭐ 요약
- this 바인딩이 동작하는 원리를 이해해야 한다.
- 콜백 함수에서 this를 사용해야 한다면, 타입 정보를 명시해야 한다. >> this는 동적 스코프(호출된 방식에 따라 값이 달라진다)라 예상하기 어렵기 때문이다.

## 들어가기 전
### 정적 스코프와 동적 스코프
- **정적(렉시컬) 스코프**: 선언되는 시점에 스코프가 결정
- **동적(다이나믹) 스코프**: 호출되는 시점에 스코프가 결정

### this
`this`는 다이나믹 스코프이기 때문에 이는 '정의된' 방식이 아니라 '호출된'방식에 따라 달라진다.

### call vs apply vs bind
call 과 apply는 this를 바인딩하면서 함수를 호출하고, apply는 매개변수를 배열형태로 담는다.
bind는 this를 바인딩하지만 함수를 호출하지 않는다. 

# TypeScript에서는 콜백 함수를 사용할 때 'this'에 대한 타입을 명시하자
## 예시
```ts
// 콜백 함수 첫 번째 매개변수에 있는 this는 특별하게 처리 된다.
// -> 실제로 인자로 넣을 필요는 없다. this 바인딩 체크용이다.
// 콜백 함수의 매개변수에 this를 추가하면 this 바인딩을 체크할 수 있다.
function addKeyListener(
    el: HTMLElement,
    fn: (this: HTMLElement, e: KeyboardEvent) => void
) {
    el.addEventListener("keydown", (e) => {
        fn(el, e); //❌
        //1개의 인수가 필요한데 2개를 가져왔습니다.
    });
}

function addKeyListener2(
    el: HTMLElement,
    fn: (this: HTMLElement, e: KeyboardEvent) => void
) {
    el.addEventListener("keydown", (e) => {
        fn(e); //this 바인딩 체크해준다.
        //'void' 형식의 'this' 컨텍스트를 메서드의 'HTMLElement' 형식 'this'에 할당할 수 없습니다
    });
}

// 콜백 함수를 call로 호출해서 해결할 수 있다.
function addKeyListener3(
    el: HTMLElement,
    fn: (this: HTMLElement, e: KeyboardEvent) => void
) {
    el.addEventListener("keydown", (e) => fn.call(el, e));
}
```

## ChatGPT 예시
```ts
class MyClass {
    value: number;
    constructor(value: number) {
        this.value = value;
    }
    myMethod(callback: (this: MyClass, num: number) => void) {
        callback.call(this, this.value);
    }
}

const instance = new MyClass(10);
instance.myMethod(function(this: MyClass, num: number) {
    console.log(this.value + num);
});
```
이 예제에서 'myMethod'는 'callback' 함수를 인수로 받습니다. 콜백 함수의 'this'에 대한 타입은 (this: MyClass, num: number) => void로 정의되어 있습니다. 이렇게 함으로써 콜백 함수 내부에서 'this'가 항상 'MyClass'의 인스턴스임을 보장합니다.
