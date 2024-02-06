### [아이템 44] 타입 커버리지를 추적하여 타입 안전성 유지하기
요약
1. 설계된 any 이외의 any를 잊지 않고 없애자!!
2. 명시적 any 중에서 any[]와 {[key: string]: any}의 경우에는 참조값을 통해 any가 퍼져나가므로, 주의!!
3. 라이브러리의 경우에 any보다는 타입 보강 augmentation을 이용하자!!

#### type-coverage
npm에서 any를 찾아낼 수 있는 패키지.
<img width="406" alt="image" src="https://github.com/code-itch/effective-typescript/assets/78120157/edca4af2-89cf-4587-80b3-6b58f5ac7538">

