---
title: 중단은 어떻게 작동할까?
author: HyunJaae
date: 2025-07-28
---

## 중단 함수

**중단 함수는 코틀린 코루틴의 핵심**이다. **중단이 가능하다는 건 코틀린 코루틴의 다른 모든 개념의 기초가 되는 필수적인 요소이다.**

코루틴을 중단한다는건 **실행을 중간에 멈추는 것을 의미**한다. 게임을 중간에 세이브하고 다시 해당 세이브 지점부터 하는 것과 비슷하다.

**코루틴은 중단되었을 때 `Continuation` 객체를 반환**한다. `Continuation` 을 이용하면 멈췄던 곳에서 다시 코루틴을 실행할 수 있다.

**스레드는 저장이 불가능하고 멈추는 것만 가능**하기 때문에 코루틴이 확실히 좋다. 또한 중단했을 때 코루틴은 어떤 자원도 사용하지 않는다. 코루틴은 **다른 스레드에서 시작할 수 있고 `Continuation` 객체는 직렬화와 역직렬화가 가능**하며 다시 실행될 수 있다.

## 재개

작업이 재개되는 원리를 사용 예제를 통해 알아보자.

작업을 재개하려면 코루틴이 필요하다. 코루틴은 `runBlocking` 이나 `launch` 와 같은 코루틴 빌더를 통해 만들 수 있는데 여기선 중단 가능한 main 함수를 사용한다.

중단 함수는 말 그대로 코루틴을 중단할 수 있는 함수이다. 이 말은 중단 함수가 반드시 코루틴(또는 다른 중단 함수)에 의해 호출되어야 함을 의미한다.

```kotlin
suspend fun main() {
	println("Before")

	suspendCoroutine<Unit> { }

	printlng("After")
}
```

코틀린은 코루틴 내부에서 `suspend` 가 붙은 main 함수를 실행한다. 코틀린 라이브러리에서 제공하는 `suspendCoroutine` 을 사용하여 중단 시킨 위 코드를 실행하면 “After” 는 출력되지 않으며, 코드는 실행된 상태로 유지된다.

`suspendCoroutine` 이 호출된 지점을 보면 람다 표현식으로 끝났는데 인자로 들어간 람다 함수는 앞서 언급한 `Continuation` 객체를 인자로 받는다.

```kotlin
suspend fun main() {
	println("Before")

	suspendCoroutine<Unit> { continuation ->
		println("Before too")
	}

	printlng("After")
}

// Before
// Before too
```

`suspendCoroutine` 이 호출된 뒤에는 이미 중단되어 `Continuation` 객체를 사용할 수 없기 때문에 람다 표현식을 통해 중단되기 전에 실행한다. 람다 함수는 `Continuation` 객체를 저장한 뒤 코루틴을 다시 실행할 시점을 결정하기 위해 사용된다.

```kotlin
suspend fun main() {
	println("Before")

	suspendCoroutine<Unit> { continuation ->
		continuation.resume(Unit)
	}

	printlng("After")
}

// Before
// After
```

`suspendCoroutine` 에서 `resume` 를 호출하여 중단한 후 곧바로 코루틴을 실행할 수 있다.

```kotlin
suspend fun main() {
	println("Before")
	suspendCoroutine<Unit> { continuation ->
		thread { // 코루틴 중단된 상태, 새 스레드 실행
			println("Suspended")
			Thread.sleep(1000) // 스레드 1초 중단
			continuation.resume(Unit) // 코루틴 시작
			println("Resumed") // 새 스레드에서 이어서 출력
		}
	}
	println("After") // 메인 스레드 출력
}
// Before
// Suspended
// (1초 후）
// After
// Resumed
```

다른 스레드가 재개되는 방식과 같이 정해진 시간 뒤에 코루틴을 다시 재개하는 함수를 만들 수 있다.

```kotlin
fun continueAfterSecond(continueation: Continuation<Unit>) {
	thread {
		Thread.sleep(1000)
		continuation.resume(Unit)
	}
}

suspend fun main() {
	println("Before")

	suspendCoroutine<Unit> { continuation ->
		continueAfterSecond(continuation)
	}

	println("After")
}

// Before
// (1초 후)
// After
```

만들어진 다음 1초 뒤에 사라지는 스레드는 불필요하며 스레드 생성 비용이 상당히 많이 든다. 더 좋은 방법은 알람 시계를 설정하는 것처럼 JVM 이 제공하는 ScheduledExecutorService를 사용하는 것이다.

```kotlin
private val executor =
	Executors.newSingleThreadScheduledExecutor {
		Thread(it, "scheduler").apply { isDaemon = true }
	}

suspend fun main() {
	println("Before")

	suspendCoroutine<Unit> { continuation ->
		executor.schedule({
			continuation.resume(Unit)
		}, 1000, TimeUnit.MILLISECONDS)
	}

	println("After")
}
// Before
// (1초 후)
// After
```

이를 delay 함수로 추출하자

```kotlin
private val executor =
	Executors.newSingleThreadScheduledExecutor {
		Thread(it, "scheduler").apply { isDaemon = true }
	}

suspend fun delay(timeMillis: Long): Unit =
	suspendCoroutine<Unit> { cont ->
		executor.schedule({
			cont.resume(Unit)
		}, timeMillis, TimeUnit.MILLISECONDS)
	}

suspend fun main() {
	println("Before")

	delay(1000)

	println("After")
}
// Before
// (1초 후)
// After
```

여기서 `Executors` 는 스레드를 사용하긴 하지만 delay 함수를 사용하는 모든 코루틴의 전용 스레드이다. 앞서 설명한 대기할 때마다 하나의 스레드를 블로킹하는 방법보다 훨씬 낫다.

위 코드는 코틀린 코루틴 라이브러리에서 `delay` 가 구현된 방식이랑 일치한다. 현재 `delay` 의 구현은 테스트를 지원하기 위한 목적 때문에 좀 더 복잡해졌으나 핵심적인 코드를 거의 똑같다.
