---
title: DSL 이란?
author: HyunJaae
date: 2025-07-20
---

## 정의

DSL 은 Domain-Specific Language, 도메인 전용 언어의 줄임말

특정 도메인에 특화된 문법을 만드는 방법으로 **개발자가 원하는 방식으로 코드를 더 읽기 좋고 선언적으로 쓸 수 있도록 하는 문법 기법임**

코틀린 문법으로 SQL, 정규식, HTML 같은 별도의 문법(external DSL)처럼 보이게 만들고 기능하게 하는 것

## DSL 만들기

- 목표

```kotlin
form {
	input("name")
	input("email")
}
```

### Step 1. DSL을 위한 클래스 만들기

```kotlin
class Form {
	private val inputs = mutableListOf<String>()

	fun input(name: String) {
		inputs.add(name)
	}

	fun render(): String {
		return inputs.joinToString("\n") { "input name=\"$it\" />" }
	}
}
```

- `input(name)` 함수로 필드를 추가하고
- `render()` 로 HTML 문자를 만들어내는 기능

### Step 2. 람다 받는 함수 만들기

```kotlin
fun form(block: Form.() -> Unit): Form {
	val form = Form() // 수신 객체
	form.block() // 수신 객체로 block 을 실행
	return form
}
```

### Step 3. DSL 호출

```kotlin
fun main() {
	val myForm = form {
		input("username") // this.input("username")과 같음. 여기서 this는 수신 객체인 Form
		input("password")
	}

	println(myForm.render())
}

// <input name="username" />
// <input name="password" />
```

## 수신 객체 있는 람다?

```kotlin
val sb = StringBuilder()

sb.append("Hello")
sb.append("World")
```

이걸 apply 를 쓰면:

```kotlin
val sb = StringBuilder().apply {
	append("Hello")
	append("World")
}
```

> 여기서 `apply { … }` 안에서 this 는 StringBuilder임
> 그래서 this.append(…) 대신 append(…) 이렇게 쓸 수 있음

StringBuilder 가 수신 객체, `{ append(...) }` 이 블록이 수신 객체를 받아서 실행되는 람다

### 일반 람다와의 차이

| 구분                | 형태        | 설명                             |
| ------------------- | ----------- | -------------------------------- |
| 일반 람다           | () → Unit   | 아무것도 넘겨받지 않음           |
| 수신 객체 있는 람다 | T.() → Unit | T 타입 객체를 this로 갖고 실행함 |

```kotlin
fun noReceiver(block: () -> Unit) {
	block()
}

fun withReceiver(block: StringBuilder.() -> Unit) {
	val sb = StringBuilder()
	sb.block() // 수신 객체가 sb 임
}

noReciever {
	append("hi") ❌ StringBuilder 가 아니니까 불가능
}

withReceiver {
	append("hi") ✅ StringBuilder 가 수신 객체여서 가능
}
```

### 스코프 함수에서의 수신 객체 지정 람다

| **함수**     | **수신 객체?**         | **리턴값**          | **주로 쓰는 상황**   |
| ------------ | ---------------------- | ------------------- | -------------------- |
| let          | ❌ 없음 ((T) -> R)     | 블록의 마지막 값    | null-safe 실행, 변형 |
| run          | ✅ 있음 (T.() -> R)    | 블록의 마지막 값    | this 기반 블록 실행  |
| apply        | ✅ 있음 (T.() -> Unit) | 수신 객체 자기 자신 | 객체 초기화          |
| also         | ❌ 있음 ((T) -> Unit)  | 수신 객체 자기 자신 | 중간 처리, 디버깅    |
| with(obj) {} | ✅ 있음 (T.() -> R)    | 블록의 마지막 값    | 기존 객체에 작업     |

- run

```kotlin
public inline fun <T, R> T.run(block: T.() -> R): R
```

- 확장 함수
- 블록은 `T.() → R` 수신 객체 있는 람다
- 리턴 값: R, 블록의 마지막 표현식이 결과

예시 코드

```kotlin
val result = "kotlin".run {
    uppercase() + " is fun" // this.uppercase 와 같음, this == "kotlin"
}
println(result)  // "KOTLIN is fun"
```

- apply

```kotlin
public inline fun <T> T.apply(block: T.() -> Unit): T
```

- 수신 객체 자신을 리턴
