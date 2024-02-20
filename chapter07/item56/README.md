# [아이템 56] 정보를 감추는 목적으로 private 사용하지 않기

### 요약

- public, protected, private 접근 제어자는 타입 시스템에서만 강제될 뿐이라 정보가 감춰지지 않아 감출 목적으로 사용할 필요가 없다.
- 데이터를 감추려면 `클로저`를 사용해라.

### 비공개 속성

#### 자바스크립트는 클래스에 비공개 속성을 만들 수 없습니다.

- `언더스코어(_)`를 접두사로 붙이는 것은 관례일 뿐!
  - 비공개라고 표시한 것일 뿐 일반적인 속성과 동일하게 클래스 외부로 공개되어 있다.

```js
class Foo {
  _private = "secret123";
}
```

### public, protected, private 같은 접근 제어자는 타입스크립트 키워드다.

- 따라서, 컴파일 후에는 제거된다.
- 컴파일 시점에만 오류를 표시할 뿐 런타임에서는 언더스코어(\_)와 마찬가지로 아무런 효력이 없습니다.

### 정보를 감추는 방법은?

#### 클로저의 사용

```tsx
declare function hash(text: string): number;

class PasswordChecker {
  checkPassword: (password: string) => boolean;
  constructor(passwordHash: number) {
    this.checkPassword = (password: string) => {
      return hash(password) === passwordHash;
    };
  }
}
```

### 추후 내용 추가하겠습니다....
