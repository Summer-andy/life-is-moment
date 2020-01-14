### 你不知道的js之对象类型
#### 对象是js的基础,在js中主要有6种类型: 
- string
- number
- boolean
- undefined
- object
- null
#### 这里需要注意一下null 有时候会被当做一种对象类型。typeof null === 'object'，在你不知道的js上册中作者指出,这其实语言的一种bug，即typeof null输出的是object.但是实际上null也是本身的基本类型。
1. 语法
   对象可以通过两种形式定义: 声明(文字)形式和构造形式。

   对象的文字语法大概是这样: 
   ```
   var obj = {
     a: 123
   }
   ```
   构造形式的语法是这样:

   ```
   var obj = new Object();
   obj.a = 123;
   ```

 2.属性描述符
  在 ES5 之前，JavaScript 语言本身并没有提供可以直接检测属性特性的方法，比如判断属性是否是只读。但是从 ES5 开始，所有的属性都具备了属性描述符
  思考以下代码:

  ```
  var myObj = { a: 2 }
  Object.getOwnPropertyDescriptor(myObj, "a") ===>
  {value: 2, writable: true, enumerable: true, configurable: true}
  ```
  writable决定了你是否可以修改value的值, 
  configurable: 只要属性是可配置的，就可以使用 defineProperty(..) 方法来修改属性描述符, 
  注意点:
  1. configurable即便设为false, 我们还是可以将writable从true设为false， 但是无法将fasle设为true.同时如果你将该属性的configurable设为false,那么delete myObj.a 将会无效。
  enumerable:这个属性描述的是属性是否可枚举。


  3.不变性
  - 对象常量结合writable: false和configurable: false即可实现，该属性无法被删除修改重新定义。
  - 禁止扩展: 
   ```
    var myObject = { a:2};
    Object.preventExtensions( myObject );
    myObject.b = 3;
    myObject.b; // undefined
   ```
   - 密封: 密封之后不仅不能添加新属性，也不能重新配置或者删除任何现有属性(但是可以修改属性的值)
   ```
    myObject.seal()
   ```
   - 冻结: 无法修改属性的值
   ```
   Object.freeze()
   ```

   小结: 对象中访问属性的时候,引擎会调用GET操作,如果是赋值的那么就调用PUT操作,会检查对象是否有该属性，如果没有的话会去原型上查找。