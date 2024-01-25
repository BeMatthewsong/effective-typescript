# 아이템 33: string 타입보다 더 구체적인 타입 사용하기

## 요약
- 모든 문자열을 담는 string 타입보다는 **더 구체적인 타입**을 사용하자
- 더 구체적인 타입으로는 **리터럴 타입의 유니온**을 사용하면 된다 (ex. "송민혁" | "천재" | "바보" )
- **객체의 속성 이름을 함수 매개변수로 받을 때**는 string보다 **keyof**를 사용해서 받자

## 혹시 타입을 string으로 남발하고 있나요?
```ts
interface Album {
  artist: string;
  title: string;
  releaseDate: string; // YYYY-MM-DD
  recordingType: string; // "live" 또는 "studio"
}
```
여기만 봤을 때는 타입 체커가 통과하고 문제가 없어보인다. (_잘한 거 아닌가?_)

## 타입을 문자열로만 했을 때 뭐가 문제인데?
만약에 releaseDate에 'August 17th, 1959' 같은 다른 날짜 형식이라면? <br/>
만약에 recordingType에 live가 아닌 Live와 같은 대문자 오타라면? <br/>
만약에 artist랑 title의 입력순서를 헷갈린다면? <br/>

위와 같은 타입 설계자의 의도와 다르게 짤 경우가 계속 늘어간다면 우리는 타입스크립트 초기 설계를 잘못했다고 할 수 있다.

## string보다 더 좁게
```ts
// 위 예시를 바꾼 경우
type RecordingType = "studio" | "live";
interface Album {
  artist: string;
  title: string;
  releaseDate: Date;
  recordingType: RecordingType;
}
```

```ts
type AdminRole = string; // 안 좋은 경우
type AdminRole = "manager" | "director" | "staff"; // 구체적인 경우
```

위 두 예시를 통하여 '리터럴 타입의 유니온 타입'을 사용하는 게 좁게 만들 수 있는 적합한 방법임을 알 수 있다.

## string 타입보다 좁으면 뭐가 좋나요?
- 타입을 명시적으로 정의함으로써 다른 곳으로 값이 전달되어도 타입 정보가 유지됩니다. - (1)
- 타입을 명시적으로 정의하고 해당 타입의 의미를 설명하는 주석을 넣을 수 있습니다 (문맥 파악을 용이하게 할 수 있다) - (2)
- keyof 연산자로 더욱 세밀하게 객체의 속성 체크가 가능해집니다. - (3)

(1) 예시
```ts
function getAlbumsOfType(recordingType: string) {}
getAlbumOfType(""); // 함수를 호출하는 곳에서 매개변수의 별다른 타입 정보를 얻을 수 없다.

// 개선 코드
type RecordingType = "live" | "studio";

function getAlbumsOfType(recordingType: RecordingType) {}
getAlbumOfType("live"); // 함수를 호출하는 곳에서 매개변수의 타입 정보를 확인할 수 있다.
```

(2) 예시
```ts
// 이 녹음이 어떤 환경에서 이루어졌는지?
type RecordingType = "live" | "studio";
```

(3) 예시
```ts
// keyof Album ("artist" | "title" | "releaseDate" | "recordingType")

// key에 string 대신에 keyof T를 사용하자
// keyof를 통해 객체 프로퍼티가 들어가는 매개변수의 타입을 더 정밀하게 알 수 있다
function pluck<T, K extends keyof T>(record: T[], key: K): T[K][] {
  return record.map(r => r[key])
}

pluck(albums, "artist"); // type : string[], 아티스트 목록
pluck(albums, "releaseDate"); // type: Date[], 발매 날짜 목록
```
