# [아이템 11] 잉여 속성 체크의 한계 인지하기
## 교훈
- 객체를 선언하는 방식에는 (1)new 연산자를 통한 방식, (2) 객체 리터럴 방식, (3)생성자 함수 방식이 있다.
- (2) 객체 리터럴 방식에서만 잉여 속성 체크가 활성화 된다.
- (2) 객체 리터럴 방식에서는 선언한 값과 동일한 타입이 생긴다. 따라서 잉여 속성이 체크 된다.
- 잉여 속성 체크는 값과 타입의 일대일 대응이다. 할당하는 값은 할당되는 변수의 타입을 비추는 거울이 되어야 한다.
```ts
type A = {
  name: string;
};

const a: A = { name: "하늘", age: 27 };
// 개체 리터럴은 알려진 속성만 지정할 수 있으며 'A' 형식에 'age'이(가) 없습니다.


type B = [string];

const b: B = ["하늘", "좋아?"];
// '[string, string]' 형식은 'B' 형식에 할당할 수 없습니다.
  소스에 2개 요소가 있지만, 대상에서 1개만 허용합니다.
```

## 리액트에서의 예제 코드
```ts
const [id, setId] = useState({name: "", number: 0});

setId({name: "하늘", number: 3, sex: "male"})
// 개체 리터럴은 알려진 속성만 지정할 수 있으며 SetStateAction<{ name: string; number: number; }> 형식에 sex 이(가) 없습니다.

setId({name:"하늘", number: 1);
//OK

setId(prev => ({...prev, sex: "male"}))
//OK, 객체 리터럴이 아님! 함수의 리턴값임.
```
