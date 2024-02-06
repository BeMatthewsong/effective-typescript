# 아이템 45 devDependencies에 typescript에 @types 추가하기

### 요약
- 타입스크립트를 시스템 레벨로 설치하면 안된다.
	- 타입스크립트를 프로젝트의 devDependencies에 포함시키고 팀원 모두가 동일한 버전을 사용하도록 해야한다.
- `@types` 의존성은 dependencies가 아니라 devDependencies에 포함시켜야 한다.
	- 런타임에 `@types`가 필요한 경우라면 별도의 작업이 필요하다.

### npm의 세 가지 종류 의존성
- dependencies
현재 프로젝트를 실행하는 데 필수적인 라이브러리들이 포함된다.
프로젝트의 런타임에 lodash가 사용된다면 dependencies에 포함되어야 한다.
프로젝트를 npm에 공개하여 다른 사용자가 해당 프로젝트를 설치하면, dependencies에 들어 있는 라이브러리도 함께 설치된다.
-> 전이(transitive) 의존성이라고 한다.

- devDependencies
현재 프로젝트를 개발하고 테스트하는 데 사용되지만, 런타임에는 필요 없는 라이브러리들이 포함된다.
예를 들어, 프로젝트에서 사용 중인 테스트 프레임워크가 devDependencies에 포함될 수 있는 라이브러리이다.
프로젝트를 npm에 공개하여 다른 사용자가 해당 프로젝트를 설치한다면, devDependencies에 포함된 라이브러리들은 제외된다.

- peerDependencies
런타임에 필요하긴 하지만, 의존성을 직접 관리하지 않는 라이브러리들이 포함된다.
단적인 예로 플러그인을 들 수 있다.

이 세 가지 의존성 중에서는 dependencies와 devDependencies가 일반적으로 사용된다.
타입스크립트는 개발 도구일 뿐이고 타입 정보는 런타임에 존재하지 않기 때문에, 타입스크립트와 관련된 라이브러리는 일반적으로 devDependencies에 속한다.

### 타입스크립트 프로젝트에서 고려해야 할 의존성 두 가지
#### 1. 타입스크립트 자체 의존성을 고려해야 한다.
시스템 레벨로 설치할 수 있지만 추천하지 않는다.
- 팀원들 모두가 항상 동일한 버전을 설치한다는 보장이 없다.
- 프로젝트를 셋업할 때 별도의 단계가 추가된다.

타입스크립트를 시스템 레벨로 설치하기보다는 devDependencies에 넣는 것이 좋다.
devDependencies에 포함되어 있다면, npm install을 실행할 때 팀원들 모두 항상 정확한 버전의 타입스크립트를 설치할 수 있다.

커맨드 라인에 npx를 사용해서 devDendencies를 통해 설치된 타입스크립트 컴파일러를 실행할 수 있다.
```shell
npx tsc
```

#### 2. 타입 의존성(`@types`)을 고려해야 한다.
사용하려는 라이브러리에 타입 선언이 포함되어 있지 않더라도, DefinitelyTyped의 타입 정의들은 npm 레지스트리의 `@types` 스코프에 공개된다.
`@types`라이브러리는 타입 정보만 포함하고 있으며 구현체는 포함하지 않는다.

원본 라이브러리 자체가 dependencies에 있더라도 `@types` 의존성은 devDependencies에 있어야 한다.
예를 들어, 리액트의 타입 선언과 리액트를 의존성에 추가하려면 다음처럼 실행한다.
```shell
npm install 
npm install --save-dev @types/react
```

그러면 다음과 같은 `package.json` 파일이 생성된다.
```json
{  
  "devDependencies": {
    "@types/react": "^16.8.19",
    "typescript": "^3.5.3"
  },
  "dependencies": {  
    "@types/node": "^16.8.6"  
  }  
}
```
위 예시 코드의 의도는 런타임에 `@types/react`와 typescript에 의존하지 않겠다는 것이다.
