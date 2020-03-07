---
title:  你不知道的js之你不知道的this
date: 2019-10-31
tags:
  - js基础
categories:
  - 前端基础
---


##### 对于开发者来说,可能平时不太会注重this真正的理解。如果现在让你回答this的绑定规则有哪些,你能立马回答出来么？我给我自己的答案是不能。如果你也不能,希望你可以花2~3分钟阅读本文,也算是巩固基础知识啦 🤝.

##### 每个函数的this是在调用时绑定的, 也就是说this的绑定是动态的,它完全取决于你调用它的位置。

##### 那么this的绑定规则有哪些呢？


#### 1.默认绑定
 例子
```
function foo() {
  console.log(this.a) // 输出123
}
var a = 123;
foo()

```
##### 解释: 上述例子中, 我们可以发现var a = 123;其实跟window.a = 123的效果是一样的。相当于定义了一个全局的变量。那么在foo函数被调用的时候,this就默认指向了全局对象。但是在严格模式在全局的对象将无法使用默认绑定。因此this.a会输出undefined.


#### 2.隐式绑定
例子
```
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
}

obj.foo();

```

##### 解释: 当我们调用foo函数时是ton过obj这个对象调用。那么我们很容易可以理解,foo这个函数其实在obj这个对象里面被调用的,因此this被绑定到了obj这个对象里面。在这里我们需要知道,隐式可能会存在this丢失的现象,我们看下面的例子1.最终this.a会输出undefined。虽然 bar 是 obj.foo 的一个引用，但是实际上，它引用的是 foo 函数本身，因此此时的 bar() 其实是一个不带任何修饰的函数调用，因此应用了默认绑定.还有一种情况也会发生this的丢失,下面我们看例子2，参数传递其实也是隐式赋值。
例子1
```
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
}

var bar = obj.foo;

bar();

```

例子2
```
function foo() {
  console.log(this.a);
}

function doFoo(fn) {
  fn();
}

var obj = {
  a: 2,
  foo: foo
}

doFoo(obj.foo)

```

#### 3.显式绑定

##### 我们利用js内置的函数,将函数强制绑定在某个对象上.下面看例子。我们使用了call函数将foo函数中的this绑定到了obj上。其实不单单只有call可以做到.像apply,bind也可以做到。这个三个函数都可以改变this的指向。只不过call的传参是单个传递的,而apply和bind可以是数组以及多个传参。那么apply和bind的区别就是apply是立即执行。而bind函数在执行时 是会返回一个函数。我们需要调用这个返回的函数才能执行bind.
例子
```
function foo() 
{ 
  console.log( this.a );
}

var obj = {
   a:2
};

foo.call( obj ); 

```


#### 4.new 绑定

##### 使用new来调用函数会自动执行以下操作:
  - 会创建一个新的对象
  - 这个新的对象会被执行新的原型连接
  - 这个新对象会绑定到调用函数的this上
  - 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象
  
  例子
  ```
  function foo(a) { 
      this.a = a;
  }

  var bar = new foo(2); console.log( bar.a ); 
  ```
##### 解释:使用 new 来调用 foo(..) 时，我们会构造一个新对象并把它绑定到 foo(..) 调用中的 this 上。