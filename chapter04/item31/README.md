# [아이템31] 타입 주변에 null 값 배치하기

## 요약
1. 여러 개의 변수가 서로 연관되어 있다면, 암시적 추론보다는 각각의 타입을 명시하는 것이 좋다.
2. 여러 변수의 타입 명시에는 객체([], {})를 사용하는 것이 좋다.
3. falsy값에 주의하면서 값을 체크하자.

## 여러 변수의 타입 명시 - React Hook
리액트 훅을 사용할 때 반환하는 값이 왜 배열인지 생각해 보았는가?
안전하게 타입까지 반환하기 위함이다.
```ts
const [state, setState] = useState("")
```

커스텀 훅에서는 튜플타입 대신, 객체를 사용해서 훅을 사용할 때 변수 구조분해의 편의성과 타입추론을 함께 할 수 있다.
```ts
const useInfScroll = () => {
  // 보여지고 있는지를 나타내는 state
  const [isVisible, setIsVisible] = useState(false);
  const myRef = useRef<HTMLParagraphElement>(null);

  // new IntersectionObserver()로 생성한 인스턴스가 observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // entries는 인스턴스의 배열
      // 얼마만큼의 비율을 가졌을 때 실행시킬지
      // 관찰 대상을 지정하고, 관찰될 때 어떤 작동을 할지
      const entry = entries[0];
      // isIntersecting은 교차 되고 있는지를 알려주는 boolean 값
      setIsVisible(entry.isIntersecting);
    });

    if (myRef.current) {
      // 관찰할 대상 등록
      observer.observe(myRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [isVisible, myRef.current]);

  return {
    isVisible,
    setIsVisible,
    myRef,
  };
};
```

## 초기화 과정이 있다면 null 명시가 필요함!
리액트에서는 useRef로 DOM 접근을 할 때,
처음에는 ref.current === undefined로 초기화되지만,
Mount 과정에서 ref 값이 Element Instance로 설정됨.
Mount 이전 ref를 사용할 경우의 오류를 막기 위해서 null을 명시.
```ts
const inputRef = useRef<HTMLElement>(null)
```

## 데이터 fetching 완료 전, 해당 변수를 사용하는 경우
```ts
const data = useData();
// 통신 완료 전 렌더링 시작되면 오류 가능성이 높아짐
```
SSR 또는 React-Query
혹은 React 18의 <Suspense/> 기능을 이용하기

혹시 시간이 null null 하신가요? 질문 드립니다.
## Q. 이것은 왜 일까요...
```ts
const [a, setA] = useState({a: null, b: null})

setA(prev => ({...prev, a: ""}))
// 'string' 형식은 'null' 형식에 할당할 수 없습니다.

const what = Math.random() > 0.5 ? "a" : "b"
setA(prev => ({...prev, [what]: ""}))
// OK
```
