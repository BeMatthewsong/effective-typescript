# 아이템 25 비동기 코드에는 콜백 대신 async 함수 사용하기

### 요약
- 콜백보다는 프로미스를
- 프로미스를 생성하기보다는 `async/await`를 사용하기
- 어떤 함수가 프로미스를 반환한다면 `async`로 선언하기

자바스크립트에서는 비동기 동작을 모델링하기 위해 콜백을 사용했다.
중첩된 콜백 코드는 직관적으로 이해하기 어렵다.

ES2015는 콜백 지옥을 극복하기 위해 프로미스(promise) 개념을 도입했다.
```js
const page1Promise = fetch(url);  
page1Promise.then(response1 => {  
  return fetch(url2);  
}).then(response2 => {  
  return fetch(url3);  
}).then(response3 => {  
  return fetch(url3);  
})
```

ES2017에서는 async와 await 키워드를 도입하여 콜백 지옥을 더욱 간단하게 처리할 수 있게 되었다.
```js
async function fetchPages() {  
  const response1 = await fetch(url1);  
  const response2 = await fetch(url2);  
  const response3 = await fetch(url3);  
}
```

await 키워드는 각각의 프로미스가 처리(resolve)될 때까지 fetchPages 함수의 실행을 멈춘다.
async 함수 내에서 await 중인 프로미스가 거절(reject)되면 예외를 던진다.
-> `try/catch`구문을 사용 할 수 있다.

```ts
async function fetchPages() {  
  try {  
    const response1 = await fetch(url1);  
    const response2 = await fetch(url2);  
    const response3 = await fetch(url3);  
  } catch (e) {  
    throw new Error(e);  
  }  
}
```

타입스크립트 컴파일러는 async와 await가 동작하도록 정교한 변환을 수행한다.
타입스크립트는 런타임에 관계없이 async/await를 사용할 수 있다.

### 콜백보다는 프로미스나 async/await
- 콜백보다는 프로미스가 코드를 작성하기 쉽다.
- 콜백보다는 프로미스가 타입을 추론하기 쉽다.

예를 들어, 병렬로 페이지를 로드할때는 `Promise.all`을 사용해서 프로미스를 조합하면 된다.
```ts
async function fetchPages() {  
  const [response1, response2, response3] = await Promise.all([  
    fetch(url1), fetch(url2), fetch(url3),  
  ]);  
}
```

이 경우는 await와 구조 분해 할당이 좋다.
타입스크립트는 세 가지 response 변수 각각의 타입을 Response로 추론한다.
만약 프로미스들 중 첫 번째가 처리될 때 완료되는 `Promise.race`를 사용하여 타입 추론이 가능하다.
```ts
function timeout(millis: number): Promise<never> {  
  return new Promise((resolve, reject) => {  
    setTimeout(() => reject('timeout'), millis);  
  });  
}  
  
async function fetchWithTimeout(url: string, ms: number) {  
  return Promise.race([fetch(url), timeout(ms)]);  
}
```

### 프로미스 직접 생성시 프로미스보다는 async/await
프로미스를 직접 생성해야 할 때, 특히 setTimeout과 같은 콜백 API를 래핑할 경우가 있다.
이 경우는 프로미스보다는 `async/await`를 사용해야한다. 그 이유는 다음과 같다.
- 일반적으로 더 간결하고 직관적인 코드가 된다.
- `async` 함수는 항상 프로미스를 반환하도록 강제된다.
```ts
// 전부 타입이 () => Promise<number>
async function getNumber() {  
  return 42;  
}  
  
// async 화살표 함수  
const getNumber2 = async () => 42;  
  
// 프로미스  
const getNumber3 = () => Promise.resolve(42);
```

즉시 사용 가능한 값에도 프로미스를 반환하는 것이 어색할 수 있지만 실제로는 비동기 함수로 통일하도록 강제하는 게 도움이 된다.
함수는 항상 동기 또는 항상 비동기로 실행되어야 하며 절대 혼용해서는 안된다.

다음은 `fetchURL` 함수에 캐시를 추가하기 위해 만든 코드다.
`async`를 두 함수에 모두 사용하면 일관적인 동작을 강제하게 된다.
```ts
const _cache: { [url: string]: string } = {};  
async function fetchWithCache(url: string) {  
  if (url in _cache) {  
    return _cache[url];  
  }  
  const response = await fetch(url);  
  const text = await response.text();  
  _cache[url] = text;  
  return text;  
}  
  
let requestStatus: 'loading' | 'success' | 'error';  
  
async function getUser(userId: string) {  
  requestStatus = 'loading';  
  const profile = await fetchWithCache(`/user/${userId}`);  
  requestStatus = 'success';  
}
```
이렇게 사용할 경우 requestStatus가 'success'로 끝나는 것이 명백해진다. 콜백이나 프로미스를 사용하면 실수로 반(half)동기 코드를 작성할 수 있지만, async를 사용하면 항상 비동기 코드를 작성하게 된다.

async 함수에는 프로미스를 반환하면 또 다른 프로미스로 래핑되지 않는다.
반환 타입은 `Promise<Promise<T>>`가 아닌 `Promise<T>`가 된다. 타입스크립트를 사용하면 타입 정보가 명확히 드러나기 때문에 비동기 코드의 개념을 잡는 데 도움이 된다.
```ts
async function getJSON(url: string) {  
  const response = await fetch(url);  
  const jsonPromise = response.json();  // Promise<any>
  return jsonPromise;  
}
```
