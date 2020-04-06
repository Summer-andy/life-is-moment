---
title: ES7-ES10
date: 2020-04-05
tags:
  - js基础
categories:
  - 前端基础
---

### es7:

  - Array.prototype.includes()
  在es6中可以用String.prototype.includes()判断给定字符串是否包含某个字符串，在es7中,数组也可以使用这个方法来判断一个数组是否包含指定的值

  ``` js
  const arr = [1,2,3,4,5];
  arr.includes(1) // true
  arr.includes(1,2) // false, includes第二个参数表示搜索的位置
  ```

  - 求幂运算符
  ``` js
  2**10 = 1024 
  Math.pow(2,10) = 1024
  ```

### es8：

   - Async/Await
     await不可脱离async单独使用。async返回的是一个Promise对象,它提供了在不阻塞主线程的情况下使用同步代码实现异步访问资源的能力,并且使得代码的逻辑也更加清晰。
  
   - Object.values()
     
     ``` js
     const obj = { a: 123, b: 12333 }
     Object.values(obj) // [123, 12333]

     const obj = { 100: 'a', 2: 'b', 7: 'c' };
     Object.values(obj) // ["b", "c", "a"]
     ```
     ::: tip
      需要注意的是，如果属性名为数值的属性，是按照数值大小，从小到大遍历的，因此返回的顺序是b、c、a
     :::

    - Object.entries()
    
     ```js
    const obj = { foo: 'bar', baz: 42 };
    Object.entries(obj) // [ ["foo", "bar"], ["baz", 42] ]
     ```

   - String padding
    在es8中新增了两个实例函数,String.prototype.padStart 和 String.prototype.padEnd,它们允许将空字符串以及其他字符串添加到原始字符串的开头或者结尾。如果长度不够那么会自动按顺序补齐。
   
   ```js
    'x'.padStart(7,1253) // "125312x"
    'x'.padEnd(7,1253) // "x125312"
   ```

   - getOwnPropertyDescriptors
     
     ES5 的Object.getOwnPropertyDescriptor()方法会返回某个对象属性的描述对象（descriptor）。ES8 引入了Object.getOwnPropertyDescriptors()方法，返回指定对象所有自身属性（非继承属性）的描述对象。
     引入getOwnPropertyDescriptors的目的主要是为了解决Object.assign()无法正确拷贝get属性和set属性的问题。这是因为Object.assign只是拷贝属性并不会拷贝方法，这时使用Object.getOwnPropertyDescriptors()方法配合Object.defineProperties()方法，就可以实现正确拷贝.

     ``` js
      const source = {
        set foo (value) {
          console.log(value)
        },
        get bar () {
          return 'andy'
        }
      }
      const target2 = {}
      Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source))
      console.log(Object.getOwnPropertyDescriptor(target2, 'foo')
     ```

### es9


   - for await of
    for of方法能够遍历具有Symbol.iterator接口的同步迭代器数据，但是不能遍历异步迭代器。ES9新增的for await of可以用来遍历具有Symbol.asyncIterator方法的数据结构，也就是异步迭代器，且会等待前一个成员的状态改变后才会遍历到下一个成员，相当于async函数内部的await。

  
      ``` js

      function Gen (time) {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            resolve(time)
          }, time)
        })
      }
      async function test () {
        let arr = [Gen(2000), Gen(100), Gen(3000)]
        for await (let item of arr) {
          console.log(Date.now(), item)
        }
      }
      test()
      // 1575536194608 2000
      // 1575536194608 100
      // 1575536195608 3000
      ```

    - Promise.prototype.finally()
    Promise.prototype.finally() 方法返回一个Promise，在promise执行结束时，无论结果是resolved或者是rejected，在执行then()和catch()后，都会执行finally指定的回调函数。

  ### es10

  - Array.prototype.flat(depth)  // depth是指定要提取嵌套数组的结构深度，默认值为 1
   
   将多维数组打平

  - Array.prototype.flatMap()
  
   这个函数其实没什么软用,你完全可以通过map和flat组合出来,而且flatMap也只能打平一层。

  - fromEntries
   可以将数组快速的转化为对象。

    ``` js
    const object = { x: 23, y:24 };
    const entries = Object.entries(object); // [['x', 23], ['y', 24]]
    const result = Object.fromEntries(entries); // { x: 23, y: 24 }
    ``` 
  - String.trimStart 和 String.trimEnd
     
    从字符串的开头和结束删除空格

    ```js
    let aa = '  ssss'
    aa.trimStart() // 'ssss'
    ```
  - try…catch  
  
   可以省略catch后的参数

  - 可选链运算符 - Optional Chaining

  ```  js
  const result = {};
  const price = result?.body?.data?.price;
  ```
  - Promise.allSettled
  Promise.all 是可以并发执行多个任务的，但是 Promise.all 有个缺陷，那就是只要其中有一个任务失败了，就会直接进入 catch 的流程，想象一下，我们有两个请求，一个失败了，结果都挂了，这不是我们想要的。
  我们需要一个方法来保证,即使其中的一个Promise 失败了,我们还可以执行其余的任务。

  ``` js
  const promise1 = Promise.resolve(3);
  const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
  const promises = [promise1, promise2];

  Promise.allSettled(promises).
    then((results) => results.forEach((result) => console.log(result)));

  // expected output:
  // {status: "fulfilled", value: 3}
  // {status: "rejected", reason: "foo"}
  ```
  
  - 异步加载模块 - import()

  ``` js
  // logger.js
  export default {
      log: function() {
          console.log(...arguments);
      }
  };

  import('./logger.js')
    .then((module)=>{
    module.default.log('p9');
  })
  ```
  当然也可以使用await.

  ```js
  let module = await import('/modules/my-module.js');
  ```