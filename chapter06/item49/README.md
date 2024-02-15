# [아이템 49] 콜백에서 this에 대한 타입 제공하기

# ⭐ 요약
- this 바인딩이 동작하는 원리를 이해해야 한다.
- 콜백 함수에서 this를 사용해야 한다면, 타입 정보를 명시해야 한다. >> this는 동적 스코프(호출된 방식에 따라 값이 달라진다)라 예상하기 어렵기 때문이다.

## 들어가기 전
### 정적 스코프와 동적 스코프
- **정적(렉시컬) 스코프**: 선언되는 시점에 스코프가 결정
- **동적(다이나믹) 스코프**: 호출되는 시점에 스코프가 결정

### this
- `this`는 다이나믹 스코프이기 때문에 이는 '정의된' 방식이 아니라 '호출된'방식에 따라 달라진다.
- 일반 함수는 `function` 키워드로 선언되며, 함수 내에서 this 키워드를 사용하면 현재 실행 중인 메서드나 함수가 속한 객체를 참조하게된다.
- 화살표 함수는 함수가 선언된 위치에서 상위 스코프로부터 this가 정해진다.

### 바인딩
this 바인딩은 함수가 어떤 객체를 참조하는지를 결정하는 중요한 개념이다.
(=> 화면에 보이는 데이터와 브라우저 메모리에 있는 데이터(여러 개의 JavaScript 객체)를 일치시키는(묶는) 것을 말한다.)

### call vs apply vs bind
`call`과 `apply`는 this를 바인딩하면서 함수를 호출하고, `apply`는 매개변수를 배열 형태로 담는다.
`bind`는 this를 바인딩하지만 함수를 호출하지 않는다. 

# TypeScript에서는 콜백 함수를 사용할 때 'this'에 대한 타입을 명시하자
## 우리는 왜 콜백 함수에 this를 바인딩해야 할까?
- **콜백 함수 내에서 객체의 메서드를 호출할 때**: 콜백 함수가 객체의 메서드로 사용될 경우, 해당 객체의 속성에 접근하거나 메서드를 호출해야 할 때가 있습니다. 이 때 this를 사용하여 현재 객체를 참조할 수 있습니다.

- **함수 컨텍스트 유지**: 콜백 함수는 다른 함수 내에서 호출되므로, 원래의 함수 컨텍스트를 유지해야 할 때가 있습니다. this를 사용하여 해당 함수의 컨텍스트를 유지할 수 있습니다.

- **이벤트 핸들러**: 웹 개발에서 이벤트 핸들러에 콜백 함수를 사용하는 경우가 많습니다. 예를 들어, 버튼 클릭 시 실행되는 함수가 콜백 함수입니다. 이때 이벤트가 발생한 요소에 대한 참조를 유지하기 위해 this를 사용합니다.

## TS에서 콜백함수에 this 바인딩하기 위한 방법 
1. 콜백함수의 꼭 첫 번째 매개변수에 this를 넣자. (this 바인딩 체크 - 실수 방지)
2. this에 대한 타입을 명시하자. (this 타입에 대한 안정성)
3. call로 바인딩하기
   
```ts
// 콜백 함수 첫 번째 매개변수에 있는 this는 특별하게 처리 된다. -> this 바인딩 체크용이다.
// 즉, 콜백 함수의 매개변수에 this를 추가하면 this 바인딩을 체크할 수 있다.
function addKeyListener(
    el: HTMLElement,
    fn: (this: HTMLElement, e: KeyboardEvent) => void
) {
    el.addEventListener("keydown", (e) => {
        fn(el, e); //❌
        //  1개의 인수가 필요한데 2개를 가져왔다.
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
