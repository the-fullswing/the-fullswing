---
title: 코틀린 코루틴을 배워야 하는 이유
author: HyunJaae
lastUpdated: 2025.07.17 03:37
---

<PostHeader 
  :title="$frontmatter.title"
  :author="$frontmatter.author"
  :lastUpdated="$frontmatter.lastUpdated"
/>

코루틴이라는 개념은 1960년대부터 다뤄온 개념이지만 제한적으로 사용되어 옴(async/await)

Golang 이 범용적으로 사용하면서부터 코틀린도 코루틴을 도입하는 등 변화가 시작됨

자바 자체적으로도 멀티스레드를 지원하고 있으며 비동기적 연산을 수행하기 위해 콜백, 스레드, RxJava 등을 활용하고 있었음

## 코틀린 코루틴을 배워야 하는 이유

안드로이드에서는 하나의 앱에서 뷰를 다루는 스레드가 단 하나만 존재하기 때문에 블로킹되면 안됨

예를 들어 외부 API 를 통해 뉴스를 가지고 와서 정렬한 다음, 스크린에 띄우는 함수가 있다고 생각해보자

```kotlin
fun onCreate() {
	val news = getNewsFromApi()
	val sortedNews = news
			.sortedByDescending { it.publishedAt }
	view.showNews(sortedNews)
}
```

위 함수를 실행하게 되면 `getNewsFromApi()` 함수가 스레드를 블로킹하게 되어 앱 에러가 발생함

`getNewsFromApi()` 함수를 다른 스레드에서 실행하더라도 `showNews` 를 호출할 때 정보가 없으므로 메인 스레드에서 에러가 남

논블로킹으로 구현하는 방법은 4개가 있음

1. 스레드 전환
2. 콜백
3. RxJava와 리액티브 스트림
4. 코틀린 코루틴

### 스레드 전환

> 블로킹이 가능한 스레드를 먼저 사용하고 이후에 메인 스레드로 전환하는 방법

```kotlin
fun onCreate() {
	thread {
		val news = getNewsFromApi()
		val sortedNews = news
			.sortedByDescending { it.publishedAt }
		runOnUiThread {
			view.showNews(sortedNews)
		}
	}
}
```

스레드 전환의 **문제점**

- 스레드가 실행되었을 때 **멈출 수 있는 방법이 없어** 메모리 누수 발생 가능성
- 스레드를 새로 생성해야하기 때문에 비용 낭비
- 스레드를 자주 전환하면 복잡도 증가 및 관리의 어려움
- 코드가 쓸데없이 길어져 가독성이 나빠짐

예를 들어 뷰를 열었다가 재빨리 닫는 경우, 뷰가 열려 있는 동안 데이터를 가져와 처리하는 스레드가 다수 생성되는데 이때 생성된 스레드를 제거하지 않으면 주어진 작업을 계속 수행한 후 더 이상 존재하지 않는 뷰를 수정하려고 계속 시도함

### 콜백

> 콜백의 기본적인 방법은 함수를 논블로킹으로 만들고 함수의 작업이 끝났을 때 호출될 콜백 함수를 넘겨주는 것

```kotlin
fun onCreate() {
	getNewsFromApi { news ->
		val sortedNews = news
			.sortedByDescending { it.publishedAt }
		view.showNews(sortedNews)
	}
}
```

콜백을 이용한 구현 방식 또한 중간에 작업을 취소할 수 없음

취소할 수 있는 콜백 함수를 만들수도 있지만 쉬운 일이 아님 콜백 함수 각각에 대해 취소할 수 있어야 하고 모든 객체를 분리해서 모아야함

```kotlin
fun showNews() {
	getConfigFromApi { config ->
		getNewsFroniApi(config) { news ->
			getUserFrornApi { user ->
				view.showNews(user, news)
			}
		}
	}
}
```

콜백의 **문제점**

- 뉴스를 얻어오는 작업과 사용자 데이터를 얻어오는 작업은 병렬 처리할 수 있으나 현재의 구조로는 두 작업을 동시에 처리할 수 없음
- 취소 함수 구현 어려움
- 들여쓰기가 많아질수록 가독성 떨어짐, 이런 상황을 콜백 지옥(Callback hell) 이라고 함
- 작업의 순서를 파악하기 어려움

### RxJava와 리액티브 스트림

> 자바 진영에서 인기 있는 또 다른 해결책은 RxJava 나 그 뒤를 이은 Reactor와 같은 리액티브 스트림을 사용하는 것

데이터 스트림 내에서 일어나는 모든 연산을 시작, 처리, 관찰할 수 있음
리액티브 스트림은 스레드 전환과 동시성 처리를 지원하기 때문에 앱 내 연산을 병렬 처리하는데 사용됨

- RxJava 사용 예시

```kotlin
fun onCreate() {
	disposables += getNewFromApi()
		.subscribeOn(Schedulers.io())
		.observeOn(AndroidSchedulers.mainThread())
		.map { news ->
			news.sortedByDescending { it.publishedAt }
		}
		.subscribe { sortedNews ->
			view.showNews(sortedNews)
		}
}
```

( \* `disposables` 는 사용자가 스크린을 빠져나갈 경우 스트림을 취소하기 위해 필요함 )

메모리 누수 없고, 취소 가능하며, 스레드를 적절히 사용하고 있으나 구현 복잡도가 높음

`subscribeOn`, `observeOn` , `map`, `subcribe` 와 같은 함수들을 RxJava 를 사용하기 위해 배워야 함

### 코틀린 코루틴의 사용

> 코틀린 코루틴이 도입한 핵심 기능은 **코루틴을 특정 지점에서 멈추고 이후에 재개할 수 있다는 것**

코루틴을 사용하면 우리가 짠 코드를 메인 스레드에서 실행하고 API에서 데이터를 얻어올 때 잠깐 중단시킬 수도 있음

**코루틴을 중단시켰을 때 스레드는 블로킹되지 않으며** 뷰를 바꾸거나 다른 코루틴을 실행하는 등의 또 다른 작업이 가능함

<aside>
❓ 중단되고 다른 코루틴으로 넘어가고 거기서 또 중단돼서 넘어가는게 반복되면 이 모든 스케줄을 별도로 관리하는걸까?
</aside>

코루틴을 **중단했다가 다시 실행할 수 있는 컴포넌트**로 정의함

코루틴이 스레드를 할당 받는 관계임

여러 개의 엔드포인트를 호출해야 하는 문제는 어떻게 해결할 수 있을까?

```kotlin
fun showNews() {
	veiwModelScope.launch {
		val config = getConfigFromApi()
		val news = getNewsFromApi(config)
		val user = getUserFromApi()
		view.showViews(user, news)
	}
}
```

위 코드가 작동하는 방식은 API 호출이 순차적으로 일어나기 때문에 효율적이지 않음

```kotlin
fun showNews() {
	viewModelScope.launch {
		val config = async { getConfigFromApi }
		val news = async { getNewsFromApi(config.await()) }
		val user = async { getUserFromApi() }
		view.showNews(user.await(), news.await())
	}
}
```

async/await 패턴을 통해 코루틴을 즉시 시작하는 함수로 호출하여 개선함

for 문이나 컬렉션 처리하는 함수 사용할 때 블로킹 없이 구현도 가능함

- 모든 페이지를 동시에 받아옴

```kotlin
fun showAllNews() {
	viewModelScope.launch {
		val allNews = (0 until getNumberOfPages())
			.map { page -> async { getNewsFromApi(page) } }
			.flatMap { it.await() }
		view.showAllNews(allNews)
	}
}
```

- 페이지별로 순차적으로 받아옴

```kotlin
fun showPagesFromFirst() {
	viewModelScope.launch {
		for (page in 0 until getNumberOfPages()) {
			val news = getNewsFromApi(page)
			view.showNextPage(news)
		}
	}
}
```

### 백엔드에서의 코루틴 사용

백엔드에서 코루틴을 사용하는 **가장 큰 장점은 간결성**임

Rx-Java와 달리 코루틴을 도입하면 현재 코드에서 큰 변화가 없음

스레드를 코루틴으로 바꾸는 대부분의 환경에서는 단지 `suspend` 제어자(modifier)를 추가하는 것으로 충분함

코루틴을 도입하면 동시성을 쉽게 구현하고 동시성을 테스트할 수 있으며 코루틴을 취소할 수 있음

```kotlin
suspend fun getArticle(
	articleKey: String,
	lang: Language
): ArticleJson? {
	return articleRepository.getArticle(articleKey, lang)
		?.let { toArticleJson(it) }
}

suspend fun getAllArticles(
	userUuid: String?,
	lang: Language
): List<ArticleJson> = coroutineScope {
	val user = async { userRepo.findUserByUUID(userUuid) }
	val articles = articlceRepo.getArticles(lang)
	articles
		.filter { hasAccess(user.await(), it) }
		.map { toArticleJson(it) }
}
```

위와 같은 특징들을 제외하면 코루틴을 사용하는 가장 중요한 이유는 **스레드를 사용하는 비용이 크기 때문임**

스레드는 명시적으로 생성해야 하고, 유지되어야 하며, 스레드를 위한 메모리 또한 할당되어야 함

```kotlin
import kotlinx.coroutines.*

fun runThreads() {
    repeat(100_000) {
        Thread.sleep(1000L)
        print(".")
    }
}

fun runCoroutines() = runBlocking {
    repeat(100_000) {
        launch {
            delay(1000)
            print(".")
        }
    }
}

fun main() {
    runThreads()
    runCoroutines()
}
```

실행해보면 `runCoroutines()` 함수는 1초 뒤 모든 점을 바로 출력함

`runTreads()` 함수는 OOM 내거나 점 찍는데 한세월 걸림
