# 아이템 53 타입스크립트 기능보다는 ECMAScript 기능을 사용하기

### 요약
- 타입스크립트의 역할을 명확하게 하려면 **열거형, 매개변수 속성, 트리플 슬래시 임포트, 데코레이터**는 사용하지 않는 것이 좋다.

타입스크립트가 생겼을 당시 자바스크립트는 결함이 많고 개선해야할 부분이 많은 언어였다.
클래스, 데코레이터, 모듈 시스템 같은 기능이 없어서 프레임워크나 트랜스파일러로 보완하는 것이 일반적인 모습이라 타입스크립트도 초기 버전에서는 독립적으로 개발한 클래스, 열거형(enum), 모듈 시스템을 포함시킬수 밖에 없었다.

현재 타입스크립트는 자바스크립트의 신규  기능을 그대로 채택하고 타입스크립트 초기 버전과 호환성을 포기했다. 하지만 이미 사용되고 있는 몇가지 기능이 있는데 이 기능들은 타입 공간(타입스크립트)과 값 공간(자바스크립트)의 경계를 혼란스럽게 만들기 때문에 사용하지 않는 것이 좋다.

여기서 피해야할 기능을 소개한다.

### 열거형(enum)
```ts
enum Flavor {  
  VANILLA = 0,  
  CHOCOLATE = 1,  
  STRAWBERRY = 2  
}  
  
let flavor = Flavor.CHOCOLATE;  // 타입이 Flavor
Flavor[0]; // 타입이 string
```
열거형은 단순히 값을 나열하는 것보다 실수가 적고 명확하기 때문에 일반적으로 사용하는 것이 좋으나 타입스크립트의 열거형은 몇 가지 문제가 있다.
- 숫자 열거형에 0, 1, 2 외의 다른 숫자가 할당되면 매우 위험하다.(비트 플래그 구조를 표현하기 위해 설계됨)
- 상수 열거형은 보통의 열거형과 달리 런타임에 완전히 제거된다.
	- 위 예제를 `const enum Flavor`로 바꾸면, 컴파일러는 `Flavor.CHOCOLATE`을 0으로 바꾼다.
- preserveConstEnums 플래그를 설정한 상태의 상수 열거형은 보통의 열거형처럼 런타임 코드에 상수 열거형 정보를 유지한다.
- 문자열 열거형은 런타임의 타입 안전성과 투명성을 제공한다.
	- 타입스크립트의 다른 타입과 달리 구조적 타이핑이 아닌 명목적 타이핑을 사용한다.

타입스크립트의 일반적인 타입들이 할당 가능성을 체크하기 위해서 구조적 타이핑을 사용하는 반면, 문자열 열거형은 명목적 타이핑을 사용한다.
```ts
enum Flavor {  
  VANILLA = 'vanilla',  
  CHOCOLATE = "chocolate",  
  STRAWBERRY = 'strawberry'  
}  
  
let flavor = Flavor.CHOCOLATE;  
flavor = 'strawberry' // 타입 에러
```
명목적 타이핑은 라이브러리를 공개할 때 필요하다. 

Flavor를 매개변수로 받는 함수를 가정한다면
```ts
function scoop(flavor: Flavor) {...}
```
Flavor는 런타임 시점에는 문자열이기 때문에, 자바스크립트에서 다음처럼 호출할 수 있다.
```js
scoop('vanilla');
```
그러나 타입스크립트에서는 열거형을 임포트하고 문자열 대신 사용해야 한다.
```ts
scoop('vanilla'); // 타입 에러

import {Flavor} from 'ice-cream';

scoop(Flavor.VANILLA); // 정상
```
자바스크립트와 타입스크립트에서 동작이 다르기 때문에 문자열 열거형은 사용하지 않는 것이 좋다.
열거형 대신 리터럴 타입의 유니온을 사용하면 된다.
```ts
type Flavor = 'vanilla' | 'chocolate' | 'strawberry';  
  
let flavor: Flavor = 'chocolate';  
flavor = 'mint'; // 타입 에러
```

#### 결론
> 타입스크립트에서는 열거형 보다는 리터럴 타입의 유니온을 사용하자.

### 매개변수 속성
일반적으로 클래스를 초기화할 때 속성을 할당하기 위해 생성자의 매개변수를 사용한다.
```ts
class Person {  
  name: string;  
  constructor(name: string) {  
    this.name = name;  
  }  
}
// 타입스크립트는 더 간결한 문법을 제공한다.
class Person {
  constructor(public name: string) {}
}
```
위 코드의 `public name`은 매개변수 속성이라고 불리며, 멤버 변수로 name을 선언한 이전 예제와 동일하게 동작한다.
하지만 매개변수 속성과 관련된 몇가지 문제점이 존재한다.
- 일반적으로 타입스크립트 컴파일은 타입 제거가 이루어지므로 코드가 줄어들지만, 매개변수 속성은 코드가 늘어나는 문법이다.
- 매개변수 속성이 런타임에는 실제로 사용되지만, 타입스크립트 관점에서는 사용되지 않는 것처럼 보인다.
- 매개변수 속성과 일반 속성을 섞어서 사용하면 클래스의 설계가 혼란스러워진다.

문제점 예시를 코드로 나타낸다면?
```ts
class Person {  
  first: string;  
  last: string;  
  constructor(public name: string) {  
    [this.first, this.last] = name.split(' ');  
  }  
}
```
Person 클래스에는 세 가지 속성(first, last, name)이 있지만, first와 last만 속성에 나열되어 있고 name은 매개변수 속성에 있어서 일관성이 없다.

클래스에 매개변수 속성만 존재한다면 클래스 대신 인터페이스로 만들고 객체 리터럴을 사용하는 것이 좋다.
```ts
class Person {  
  constructor(public name: string) {  
  }}  
  
const p: Person = {name: 'james bond'} // 정상
```

#### 결론
매개변수 속성을 사용하는 것이 좋은지에 대해서는 찬반 논란이 있다.
저자는 선호하지 않지만 어떤 사람은 코드양이 줄어 들어서 좋아하기도 한다.
하지만 매개변수 속성은 타입스크립트의 다른 패턴들과 이질적이고, 생소한 문법이라는 것을 기억해야한다.
-> 매개변수 속성과 일반 속성을 같이 사용하면 설계가 혼란스러워지기 때문에 한 가지만 사용하는 것이 좋다.

### 네임스페이스와 트리플 슬래스 임포트
ECMAScript 2015 이전에는 자바스크립트에 공식적인 모듈 시스템이 없었기 때문에 각 환경마다 자신만의 방식으로 모듈 시스템을 마련했다.

타입스크립트 역시 자체적으로 모듈 시스템을 구축했고, `module` 키워드와 트리플 슬래시 임포트를 사용했다.
ECMAScript 2015가 공식적으로 모듈 시스템을 도입한 이후, 타입스크립트는 충돌을 피하기 위해 `module`과 같은 기능을 하는 `namespace`키워드를 추가했다.
```ts
namespace foo {  
  function bar() {}  
}

// <reference path="other.ts"/>
foo.bar();
```

트리플 슬래시 임포트와 `module` 키워드는 호환성을 위해 남아 있을 뿐이며, 지금은 ECMA2015 스타일의 모듈(import, export)을 사용해야 한다.

### 데코레이터
데코레이터는 클래스, 메서드, 속성에 애너테이션을 붙이거나 기능을 추가하는 데 사용할 수 있다.
아래 코드는 클래스의 메서드가 호출될 때마다 로그를 남기는 `logged` 애너테이션을 정의한 것이다.
```ts
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  @logged
  greet() {
    return "Hello, " + this.greeting;
  }
}

function logged(target: any, name: string, descriptor: PropertyDescriptor) {
  const fn = target[name];
  descriptor.value = function() {
    console.log(`Calling ${name}`);
    return fn.apply(this, arguments);
  };
}

console.log(new Greeter('Dave').greet());
// Logs:
// Calling greet
// Hello, Dave
```
데코레이터는 처음에 앵귤러 프레임워크를 지원하기 위해 추가되었으며 `tsconfig.json`에 experimentalDecorators 속성을 설정하고 사용해야 한다.

#### 결론
현재까지도 표준화가 완료되지 않았기 때문에, 사용 중인 데코레이터가 비표준으로 바뀌거나 호환성이 깨질 가능성이 있다. 

앵귤러를 사용하거나 애너테이션이 필요한 프레임워크를 사용하고 있는게 아니라면, 데코레이터가 표준이 되기 전에는 타입스크립트에서 데코레이터를 사용하지 않는 게 좋다.