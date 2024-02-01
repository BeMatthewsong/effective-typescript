# [아이템 40] 함수 안으로 타입 단언문 감추기

## ⭐ 요약
- **타입 선언문**은 일반적으로 타입을 위험하게 만들지만, 상황에 따라 필요하기도 하고 현실적인 해결책이 되기도 한다.
- 정말 불가피하게 사용해야 한다면 **정확한 정의를 가지는 함수 안으로** 숨기도록 하자.
- 프로젝트 전반에 위험한 타입 단언문이 드러나 있는 것보다 **함수 내부에는 타입 단언을 사용하고, 함수 외부로 드러나는 타입 정의를 정확히 명시하는 정도**가 낫다. 

## 난 단언문을 쓰기로 결심했다
불필요한 예외 상황까지 타입 정보까지 고려할 수 없어서 무슨 타입인지 확실히 아는 데이터이기에 타입 단언문을 써야 하는 상황이 있다.

### 예시 (두 개 배열을 비교하는 함수)

```ts
declare function shallowEqual(a: any, b: any): boolean;
function shallowObjectEqual<T extends object>(a: T, b: T): boolean {
  for (const [key, aVal] of Object.entries(a)) {
      if (!(key in b) || aVal !== b[key]) { // 오류 발생 
          return false
      }
  }
}
```
if 구문의 `key in b` 체크로 b 객체에 key 속성이 있다는 것을 확인했지만 b[key] 부분에서 오류가 발생한다. <br/>
타입스크립트의 문맥 활용 능력이 부족하여 `aVal !== b[key]`에서 오류가 발생한 거다. <br/>
타입 체크로 통해 실제 오류가 아니라는 것을 알고 있기에 any로 단언하기로 했다. 

> `Object.entries()`는 주어진 객체 자체의 열거 가능한 문자열 키 속성 키-값 쌍의 배열을 반환합니다. <br/>
> ex) <br/>
> const obj = { foo: "bar", baz: 42 }; <br/>
> console.log(Object.entries(obj)); // [ ['foo', 'bar'], ['baz', 42] ]

---
## 타입 선언문을 이왕 쓴다면 타입이 잘 정의된 함수 내부로 숨기는 게 좋다
```ts
function shallowObjectEqual<T extends object>(a: T, b: T): boolean {
  for (const [key, aVal] of Object.entries(a)) {
      if (!(key in b) || aVal !== (b as any)[key]) { // b를 any로 단언
          return false
      }
  }
  return Object.keys(a).length === Object.keys(b).length;
}
```
`b as any`는 타입 단언문은 `key in b` 체크를 했으므로 안전하다. <br/>
그리고 함수를 호출하는 쪽에서는 any로 사용됐는지 알지 모른다. <br/>
객체가 같은지 체크하기 위해 객체 순회와 단언문이 코드에 직접 들어가는 것보다, 위 코드처럼 **별도의 함수**로 분리해내는 것이 훨씬 좋은 설계입니다.
