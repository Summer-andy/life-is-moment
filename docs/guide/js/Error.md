#### js中你不知道的Error

#### 1.EvalError
##### 我们来看一下官方是如何解释这个异常的:
##### EvalError is not used in the current ECMAScript specification and will thus not be thrown by the runtime. However, the object itself remains for backwards compatibility with earlier versions of the specification.

##### 这段话的大致意思就是说:EvalError在当前的ECMAScript中不会被使用,因此在运行中几乎不会抛出这个异常。那么什么时候会抛出这个异常呢？首先呢, 这个异常是发生在eval函数上的，eval函数的作用主要是计算某个字符串,并且执行其中的javascript的表达式。如果我们试图覆盖 eval 属性或把 eval() 方法赋予另一个属性，并通过该属性调用它，则 ECMAScript 实现允许抛出一个 EvalError 异常。


#### 2.InternalError
##### 产生InternalError的原因主要是由于开发者编写的代码不好导致js引擎内部发生了错误。比如递归太多了。官方文档也举了一些例子: 1."too many switch cases” 2、"too many parentheses in regular expression". 3. "array initializer too large" 4."too much recursion".

#### 3.RangeError
##### 试图传递一个number参数给一个范围内不包含该number的函数时则会引发RangeError。当传递一个不合法的length值作为Array 构造器的参数创建数组，或者传递错误值到数值计算方法（Number.toExponential()，Number.toFixed() ，Number.toPrecision()），会出现RangeError.
```
  const arr = new Array(-1)
```

#### 4.ReferenceError
##### ReferenceError（引用错误） 对象代表当一个不存在的变量被引用时发生的错误

```
  console.log(b);

```

#### 5.SyntaxError
##### 当Javascript语言解析代码时,Javascript引擎发现了不符合语法规范的tokens或token顺序时抛出SyntaxError.


#### 6.TypeError
##### 当传入函数的操作数或参数的类型并非操作符或函数所预期的类型时，将抛出一个 TypeError 类型错误。

#### 7.URIError
##### URIError是URI相关函数的参数不正确时抛出的错误，主要涉及encodeURI()、decodeURI()、encodeURIComponent()、decodeURIComponent()、escape()和unescape()这六个函数
```
  decodeURI('%2');
```