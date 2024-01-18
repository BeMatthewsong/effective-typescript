# 아이템 27. 함수형 기법과 라이브러리로 타입 흐름 유지하기

## 요약

- lodash와 같은 서드파티 라이브러리를 사용하면 코드 가독성을 높이고, 명시적인 타입 구문의 빈도 수를 줄일 수 있다.
- 타입스크립트에서는 함수형 프로그래밍이 절차형 프로그래밍보다 유리하다.

---

### 왜 함수형 프로그래밍이 유리할까?

```tsx
interface BasketballPlayer {
  name: string;
  team: string;
  salary: number;
}

declare const rosters: { [team: string]: BasketballPlayer[] };

// version 1. 절차형 프로그래밍
let allPlayers: BasketballPlayer[] = [];
for (const players of Object.values(rosters)) {
  allPlayers = allPlayers.concat(players);
}

// version 2. 함수형 프로그래밍
const allPlayers = Object.values(rosters).flat();
// flat 에서 에러가 날 수 있는데 flat method가 ES2019 버전 이후에 도입되었기 때문에 tsconfig의 타겟 라이브러리를 ES2019이상으로 설정해주어야 합니다.
```

- 훨씬 간결해지고 타입 구문도 필요없습니다.
- 또, allPlayers 변수가 변하지 않도록 const를 사용 가능해집니다.

---

### 왜 서드 파티 라이브러리를 추천할까?

- jQuery, UnderScore, Lodash, Ramda 같은 라이브러리들의 일부 기능(map, flatMap, filter, reduce)은 순수 자바스크립트로 구현되어 있다.

#### 그렇다면 내장된 method 대신 라이브러리를 왜??

```tsx
interface BasketballPlayer {
  name: string;
  team: string;
  salary: number;
}
declare const rosters: { [team: string]: BasketballPlayer[] };

const teamToPlayers: { [team: string]: BasketballPlayer[] } = {};
const allPlayers = Object.values(rosters).flat();

// 절차형
for (const player of allPlayers) {
  const { team } = player;
  teamToPlayers[team] = teamToPlayers[team] || [];
  teamToPlayers[team].push(player);
}

for (const players of Object.values(teamToPlayers)) {
  players.sort((a, b) => b.salary - a.salary);
}

const bestPaid = Object.values(teamToPlayers).map((players) => players[0]);
bestPaid.sort((playerA, playerB) => playerB.salary - playerA.salary);

// 함수형 & lodash
const bestPaid = _(allPlayers)
  .groupBy((player) => player.team)
  .mapValues((players) => _.maxBy(players, (p) => p.salary)!)
  .values()
  .sortBy((p) => -p.salary)
  .value(); // 타입이 BasketballPlayer[]
```

- 코드의 가독성이 높아지고 타입 정보가 잘 유지되어 타입 추론이 가능해집니다.

> **하지만**, 무작정 서드파티 라이브러리를 쓰는 것은 추천하지 않습니다.<br>
> 서드파티 라이브러리 기반으로 코드를 짧게 줄이는 데 시간이 많이 든다면 사용하지 않는 것이 좋다.<br>
> 만약, 같은 코드를 타입스크립트로 작성한다면 서드파티 라이브러리 기반으로 작업하는게 시간 효율이 좋다.
