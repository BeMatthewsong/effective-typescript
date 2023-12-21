# 아이템 10 객체 래퍼 타입 피하기
요약
- 타입스크립트에서 타입을 선언할 경우 자바스크립트 기본형 타입의 래퍼타입을 사용하지 말 것
- 래퍼타입으로도 타입을 선언할 수 있지만 매개변수로 다시 사용할 경우 타입에러가 발생한다.

자바스크립트에는 객체 이외에도 기본형 값들에 대한 일곱 가지 타입(string, number, boolean, null, undefined, symbol, bigint)이 있다.

기본형들은 불변(immutable)이며 메서드를 가지지 않는다는 점에서 객체와 구분된다.
그런데 기본형인 string의 경우 메서드를 가지고 있는 것처럼 보인다.
```ts
'primitive'.charAt(3); // m
```

chatAt은 string의 메서드가 아니며, string을 사용할 때 자바스크립트 내부적으로 많은 동작이 일어난다.
string '기본형'에는 메서드가 없지만, 자바스크립트에는 메서드를 가지는 String '객체' 타입이 정의되어 있다.

자바스크립트는 기본형을 String 객체로 래핑하고, 메서드를 호출하고, 마지막에 래핑한 객체를 버린다.
메서드 내의 this는 string 기본형이 아닌 String 객체 래퍼이다. String 객체를 직접 생성할 수도 있으며, string 기본형처럼 동작한다.

그러나 string 기본형과 String 객체 래퍼가 항상 동일하게 동작하는 것은 아니다.
다음 코드는 String 객체는 오직 자기 자신하고만 동일하다.
```ts
"hello" === new String("hello"); // false  
new String("hello") === new String("hello"); // false
```

객체 래퍼 타입의 자동 변환 때문에 원하지 않는 동작을 보일 때가 있다.
예를 들어 어떤 속성을 기본형에 할당한다면 그 속성이 사라진다.
```ts
x = "hello";
x.language = 'English'; // English
x.language // undefined
```

실제로는 x가 String 객체로 변환된 후 language 속성이 추가되었고, language 속성이 추가된 객체는 버려진 것이다. 
다른 기본형에도 동일하게 객체 래퍼 타입이 존재한다. (null과 undefined에는 객체 래퍼가 없다.)

이 래퍼 타입들 덕분에 기본형 값에 메서드를 사용할 수 있고, 정적 메서드(String.fromCharCode 등)도 사용할 수 있다. 그러나 보통은 래퍼 객체를 직접 생성할 필요가 없다.

타입스크립트는 기본형과 객체 래퍼 타입을 별도로 모델링한다.
- string / String
- number / Number
- boolean / Boolean
- symbol / Symbol
- bigint / BigInt

string을 사용할 때는 유의해야 한다. 다음처럼 잘 동작하는 것처럼 보일 수도 있다.
```ts
function getStringLen(foo: String) {  
  return foo.length;  
}  
  
getStringLen('hello');  
getStringLen(new String("hello"));
// 둘다 정상
```

그러나 string을 매개변수로 받는 메서드에 String 객체를 전달하는 순간 문제가 발생한다.
```ts
function isGreeting(phrase: String) {  
  return [  
    'hello',  
    'good day'  
  ].includes(phrase);  // 타입 에러 래퍼 타입이라 에러가 발생
}
```

string은 String에 할당할 수 있지만 String은 string에 할당할 수 없다.
타입스크립트가 제공하는 타입 선언은 전부 기본형 타입으로 되어있다.

래퍼 객체는 타입 구문의 첫 글자를 대문자로 표기하는 방법으로도 사용할 수 있다.
```ts
const s: String = "primitive";  
const n: Number = 12;  
const b: Boolean = true;
```
기본형 타입은 객체 래퍼에 할당할 수 있기 때문에 타입스크립트는 기본형 타입을 객체 래퍼에 할당하는 선언을 허용한다. 그러나 기본형 타입을 객체 래퍼에 할당하는 구문은 오해하기 쉽고, 굳이 그렇게 할 필요는 없다.

그냥 기본형 타입을 사용하는 것이 낫다.
그런데 new 없이 BigInt와 Symbol을 호출하는 경우는 기본형을 생성하기 때문에 사용해도 좋다.
```ts
typeof BigInt(1234); // bigint
typeof Symbol('sym'); // symbol
```
