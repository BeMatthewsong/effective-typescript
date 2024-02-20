# [아이템 55] DOM 계층 구조 이해하기

### 요약
- DOM에는 타입 계층 구조가 있다. DOM 타입은 타입스크립트에서 중요한 정보이다.
- Node, Element, HTMLElement, EventTarget 간의 차이점, 그리고 Event와 MouseEvent 등의 구체적 이벤트의 차이점을 알아야 한다.
- DOM 엘리먼트와 이벤트에는 충분히 구체적인 타입 정보를 사용하거나, 타입스크립트가 추론할 수 있도록 문맥 정보를 활용해야 한다.

### DOM 계층
DOM 계층은 웹브라우저에서 자바스크립트를 실행할 때 어디에서나 존재한다.
엘리먼트를 이용할 때 `document.getElementById`, `document.createElement` 등을 사용한다.

타입스크립트에서는 DOM 엘리먼트의 계층 구조를 파악하기 용이하다.
Element와 EventTarget에 달려 있는 Node의 구체적인 타입을 안다면 타입 오류를 디버깅할 수 있고, 언제 타입 단언을 사용해야 할 지 알 수 있다. 그리고 대다수의 브라우저 API가 DOM을 기반으로 하기 때문에, 리액트나 d3 같은 프레임워크도 DOM을 사용한다.

다음 예제를 보면 타입스크립트에서 많은 오류를 볼 수 있다.
```ts
function handleDrag(eDown: Event) {
  const targetEl = eDown.currentTarget;
  targetEl.classList.add('dragging');
// ~~~~~~~           Object is possibly 'null'.
//         ~~~~~~~~~ Property 'classList' does not exist on type 'EventTarget'
  const dragStart = [
     eDown.clientX, eDown.clientY];
        // ~~~~~~~                Property 'clientX' does not exist on 'Event'
        //                ~~~~~~~ Property 'clientY' does not exist on 'Event'
  const handleUp = (eUp: Event) => {
    targetEl.classList.remove('dragging');
//  ~~~~~~~~           Object is possibly 'null'.
//           ~~~~~~~~~ Property 'classList' does not exist on type 'EventTarget'
    targetEl.removeEventListener('mouseup', handleUp);
//  ~~~~~~~~ Object is possibly 'null'
    const dragEnd = [
       eUp.clientX, eUp.clientY];
        // ~~~~~~~                Property 'clientX' does not exist on 'Event'
        //              ~~~~~~~   Property 'clientY' does not exist on 'Event'
    console.log('dx, dy = ', [0, 1].map(i => dragEnd[i] - dragStart[i]));
  }
  targetEl.addEventListener('mouseup', handleUp);
// ~~~~~~~ Object is possibly 'null'
}

const div = document.getElementById('surface');
div.addEventListener('mousedown', handleDrag);
// ~~~ Object is possibly 'null'
```


### DOM 계층의 타입들
- 계층 구조에 따른 타입의 몇가지 예시

| 타입              | 예시                         |
| ----------------- | ---------------------------- |
| EventTarget       | window, XMLHttpRequest       |
| Node              | document, Text, Comment      |
| Element           | HTMLElement, SVGElement 포함 |
| HTMLElement       | `<i>`, `<b>`                 |
| HTMLButtonElement | `<button>`                   |

#### 타입 단언문 사용
보통은 HTML 태그 값에 해당하는 'button' 같은 리터럴 값을 사용하여 DOM에 대한 정확한 타입을 얻을 수 있다. 예시는 다음과 같다.
```ts
document.getElementsByTagName('p')[0]; // HTMLParagraphElement
document.createElement('button'); // HTMLButtonElement
document.querySelector('div'); // HTMLDivElement
```

그러나 항상 정확한 타입을 얻을 수 있는 것은 아니다. 
특히 `document.getElementById`에서 문제가 발생한다.
```ts
document.getElementById('my-div'); // HTMLElement
```
일반적으로 타입 단언문은 지양해야 하지만, DOM 관련해서는 타입스크립트보다 개발자가 더 정확히 알고 있는 경우이므로 단언문을 사용해도 좋다.
```ts
document.getElementById('my-div') as HTMLDivElement; 
```
`strictNullChecks`가 설정된 상태라면, `document.getElementById`가 null인 경우를 체크해야한다.
실제 코드에서 `document.getElementById`가 null일 가능성이 있다면 if 분기문을 추가해야 한다.

### Event 타입에서 별도의 계층 구조
Event는 가장 추상화된 이벤트이다. 더 구체적인 타입들은 다음과 같다.
- UIEvent: 모든 종류의 사용자 인터페이스 이벤트
- MouseEvent: 클릭처럼 마우스로부터 발생되는 이벤트
- TouchEvent: 모바일 기기의 터치 이벤트
- WheelEvent: 스크롤 휠을 돌려서 발생되는 이벤트
- KeyboardEvent: 키 누름 이벤트


DOM에 대한 타입 추론은 문맥 정보를 폭넓게 활용한다. 그래서 구체적 이벤트 핸들러를 인라인 함수로 만들면 타입스크립트는 더 많은 문맥 정보를 사용하게 되고, 대부분의 오류를 제거할 수 있다.
```ts
function addDragHandler(el: HTMLElement) {
  el.addEventListener('mousedown', eDown => {
    const dragStart = [eDown.clientX, eDown.clientY];
    const handleUp = (eUp: MouseEvent) => {
      el.classList.remove('dragging');
      el.removeEventListener('mouseup', handleUp);
      const dragEnd = [eUp.clientX, eUp.clientY];
      console.log('dx, dy = ', [0, 1].map(i => dragEnd[i] - dragStart[i]));
    }
    el.addEventListener('mouseup', handleUp);
  });
}

const div = document.getElementById('surface');
if (div) {
  addDragHandler(div);
}
```
