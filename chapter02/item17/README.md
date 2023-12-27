# 아이템 17. 변경 관련된 오류 방지를 위해 readonly 사용하기

### 요약

- readonly를 사용하여 타입을 명확하게 하고 발생 가능한 오류를 줄일 수 있다.
- 함수가 매개변수를 수정하지 않는다면 readonly를 사용하여 인터페이스를 명확하게 해주는 것이 좋다.
- readonly는 얕게 동작한다.

# readonly 동작 이해하기

readonly는 배열이나 튜플에만 할당 가능한 접근 제어자이다.

readonly를 사용하면

- 배열/튜플의 요소를 읽을 수는 있지만 쓸 수는 없다.
- 배열을 변경하는 메소드들을 사용할 수 없다. (pop, push, ...)
- 배열의 각 요소들을 변경할 수는 없지만 새로운 배열을 가르키도록 변경할 수는 있다.

```ts
let a: readonly number[] = [1, 2];

a[0] = 3; // 오류

// 새로운 배열 할당 -> 오류 X
a = [];
a = [3, 4];
```

## readonly는 얕게 동작한다

readonly를 사용할 때는 얕게 동작한다는 것을 유이해야한다. 아래 예시와 같이 객체의 readonly 배열이 있다면, 그 객체 자체는 readonly가 아니다.

```ts
interface Person {
  name: string;
}

const people: readonly Person[] = [{ name: 'Daniel' }];

// 오류
people[0] = { name: 'Evan' };
people.push({ name: 'Ethan' });

// 정상
people[0].name = 'Daniel Lim';
```

# 함수가 매개변수를 변경하지 않으면 readonly 사용하기

자바스크립트 및 타입스크립트에서는 명시적으로 언급하지 않는 한, 함수가 매개변수를 변경하지 않는다고 가정한다. 그러나 이러한 암묵적인 방법은 원하지 않는 함수의 동작을 불러 일으킬 수 있다. 따라서 함수가 매개변수를 변경하지 않는다면 readonly로 선언해야 한다.

매개변수를 readonly로 선언하면 타입스크립트가 함수 내에서 매개변수가 변경되는지 체크하고, 함수를 호출하는 쪽에서는 매개변수가 변경되지 않는다는 보장을 받게 된다.

```ts
function arraySum(arr: number[]) {
  let sum = 0,
    num;
  while ((num = arr.pop()) !== undefined) {
    sum += num;
  }
  return sum;
}

const num = [1, 2, 3];

console.log(arraySum(num));
console.log(num);
```
