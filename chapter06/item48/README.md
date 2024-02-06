# [아이템 48] API 주석에 TSDoc 사용하기

## ⭐ 요약
- 익스포트된 함수, 클래스, 타입에 주석을 달 때는 JSDoc/TSDoc 형태를 사용하자.
- JSDoc/TSDoc 형태에 @param, @returns, 마크다운을 사용할 수 있다.
- 타입스크립트에서는 타입 정보가 코드에 있기 때문에 TSDoc에서는 타입 정보를 명시하면 안 된다. (= 주석에 타입 정보를 포함하지 말자)
- 훌륭한 주석은 간단히 요점만 언급한 것을 말한다.


## 주석보다는 JSDoc
함수에 대한 설명을 **주석**과 **JSDoc 형태**로 나타내보자. <br/>


### 주석
```js
// 인사말을 생성합니다. 결과는 보기 좋게 꾸며집니다.
function greetFullTSDoc(name: string, title: string) {
  return `Hello ${title} ${name}`;
}
```
물론 주석으로 함수에 대한 설명을 알 수 있지만 사용자를 위한 문서라면 주석보다는 JSDoc을 사용하자.

### JSDoc 형식
사용법은 아래와 입력하면 된다. 
```js
/** ... */
```

**JSDoc 형식**은 함수 부분 위에다가 함수에 대한 설명을 쓰고 `@param`으로 매개변수를 설명하고, `@returns`으로 어떤 값을 리턴하는지를 설명하면 됩니다.

```js
/**
 *  인사말을 생성합니다.
 *  @param name 인사할 사람의 이름
 *  @param title 그 사람의 칭호
 *  @returns 사람이 보기 좋은 형태의 인사말
 */
function greetFullTSDoc(name: string, title: string) {
  return `Hello ${title} ${name}`;
}
```

타입스크립트에서 JSDoc 형식을 지원해준다. 그래서 사용방법은 똑같다. <br/>
다만 타입스크립트 관점에서 JSDoc를 `TSDoc`이라고 부를뿐이다.

## TSDoc
위에서는 함수에 대한 설명을 JSDoc/TSDoc으로 쓸 수 있다는 걸 알았고, TSDoc은 타입 정의에서도 사용할 수 있다.
각 필드에 마우스를 올려보면 TSDoc을 볼 수 있다. <br/>

다만 TSDoc에서 타입을 쓰려고 한다면 멈추길 바란다. 
타입스크립트에서 타입 정보를 알아서 담아주기 때문이다. 


```ts
/** 특정 시간과 장소에서 수행된 측정 */
interface Measurement {
  /** 어디에서 측정되었나 */
  position: Vector3D;
  /** 언제 측정되었나? epoch에서부터 초 단위로 */
  time: number;
  /** 측정된 운동량 */
  momentum: Vector3D;
}
```

JSDoc/TSDoc에서는 마크다운 형식을 사용할 수 있다. 

```ts
/**
* This _interface_ has **three** properties:
* 1. x
* 2. y
* 3. z
*/
```

JSDoc/TSDoc은 너무 수필처럼 쓰지 말고 알잘딱깔센으로 요점만 딱 쓰는 게 제일 좋은 방식이다.
