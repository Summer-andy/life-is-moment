#### 你不知道的js之你不知道的Error

#### 1.EvalError
##### 定义: EvalError is not used in the current ECMAScript specification and will thus not be thrown by the runtime. However, the object itself remains for backwards compatibility with earlier versions of the specification.

##### 解释: 这段话的大致意思就是说:EvalError在当前的ECMAScript中不会被使用,因此在运行中几乎不会抛出这个异常。那么什么时候会抛出这个异常呢？首先, 这个异常是发生在eval函数上的，eval函数的作用主要是计算某个字符串,并且执行其中的javascript的表达式。如果我们试图覆盖 eval 属性或者 eval() 方法赋予另一个属性,并通过该属性调用它，那么就会抛出一个 EvalError 异常。但是在实际开发中,相信这个eval方法用的人也比较少, 也不太建议大家使用eval, with之类会欺骗作用域的函数。因为在我们使用这类函数的时候,它们会在运行时修改或者创建新的作用域,以此来欺骗它们在定义时的作用域, 从而导致我们的代码性能下降。

#### 2.InternalError
##### 定义: The InternalError object indicates an error that occurred internally in the JavaScript engine. For example: "InternalError: too much recursion"

##### 解释: 产生InternalError的原因主要是由于开发者编写的代码不好导致js引擎内部发生了错误。比如递归太多了。官方文档也举了一些例子: 1."too many switch cases” 2、"too many parentheses in regular expression". 3. "array initializer too large" 4."too much recursion".

#### 3.RangeError
##### 定义: The RangeError object indicates an error when a value is not in the set or range of allowed values.

##### 解释: 当我们试图传递一个number参数给一个范围内不包含该number的函数时则会引发RangeError。当传递一个不合法的length值作为Array 构造器的参数创建数组，或者传递错误值到数值计算方法(Number.toExponential()，Number.toFixed(),Number.toPrecision()),会出现RangeError.
例如:
```
  const arr = new Array(-1)
```

#### 4.ReferenceError
##### 定义: The ReferenceError object represents an error when a non-existent variable is referenced.

##### 解释: 当我们引用的一个对象、方法等没有被定义的,然后直接引用的时候报错这个引用错误的异常


#### 5.SyntaxError
##### 定义: The SyntaxError object represents an error when trying to interpret syntactically invalid code.
##### 解释: 当Javascript语言解析代码时,Javascript引擎发现了不符合语法规范的tokens或token顺序时抛出SyntaxError.比如多了括号啊少了个运算符啦等等.


#### 6.TypeError
##### 定义: The TypeError object represents an error when an operation could not be performed, typically (but not exclusively) when a value is not of the expected type.
##### 解释: 当传入函数的操作数或参数的类型并非操作符或函数所预期的类型时，将抛出一个 TypeError 类型错误。比如我们定义了一个变量a,然而我们引用的时候却以函数的方式调用。

#### 7.URIError
##### 定义: The URIError object represents an error when a global URI handling function was used in a wrong way.
##### 解释: URIError是URI相关函数的参数不正确时抛出的错误，主要涉及encodeURI()、decodeURI()、encodeURIComponent()、decodeURIComponent()、escape()和unescape()这六个函数

例如:
```
  decodeURI('%2');
```

参考: [MDN](https://developer.mozilla.org/)