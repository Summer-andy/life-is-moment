---
title: reduce常用功能汇总
date: 2020-04-09
tags:
  - js基础
categories:
  - 前端基础
---

#### 前言: 人生的学习就像打副本一样,你需要有一条主线任务,同时你也需要很多条支线任务。主线任务是为了让你能够朝着正确的方向前行, 而支线任务则会给予你很多的surprise。


### 语法

  ``` js
   arr.reduce(callBack, [initValue])
  ```

  reducer接收两个参数,第一个参数是每次循环执行的回调函数, 第二个参数值表示的是第一次循环的时候,回调函数中的第一次循环时候的初始化值,并且如果第二个参数有值, 那么arr的每次遍历将会从0开始而不是从1开始。让我们来看一下例子吧。

  
### 解析reduce

  ```js
    var  arr = [1, 2, 3, 4];
    var sum = arr.reduce(function(prev, cur, index, arr) {
        console.log(prev, cur, index);
        return prev + cur;
    }) 
  ```

  ::: tip
  打印结果:

  `1 2 1`

  `3 3 2`

  `6 4 3`
  :::

  我们可以看到prev是我们的初始值:1, cur是我们的当前值:2,index是我们数组的下标:1, arr就是我们要处理的数组。我们可以发现,reduce的遍历是从index=1开始, arr的长度为4, 但是却只遍历了三次。
  我们接下来看第二个例子:

  ```js
    var  arr = [1, 2, 3, 4];
    var sum = arr.reduce(function(prev, cur, index, arr) {
        console.log(prev, cur, index);
        return prev + cur;
    }, 10) 
  ```


  ::: tip
  打印结果:

  `10 1 0`

  `11 2 1`

  `13 3 2`

  `16 4 3`

  :::

  我们给reduce添加了第二个参数,发现他循环了4次,并且初始值是10,刚刚好是我们输入的第二个参数,并且从index=0开始遍历。

  #### 结论:

  ::: tip
    如果我们不给reduce添加第二个参数,那么他默认会从索引为1的地方开始遍历。如果我们添加第二个
    参数,那么就从0开始遍历。
  :::

  #### 注意点:

   :::warning
    如果我们数组存在为空的可能性,那么我们必须给reduce添加第二个参数,否则会报错,
    我们来看一个例子。
   :::

   ```js
    var  arr = [];
    var sum = arr.reduce(function(prev, cur, index, arr) {
        return prev + cur;
    }) 
   ```

   :::danger
   我们来看一下报错:

   `Uncaught TypeError: Reduce of empty array with no initial value`
   `at Array.reduce (<anonymous>)`

   由于它是从索引为1的地方开始遍历，然而我们的arr仅仅是一个空的数组而已。因此我们添加第二个参数即可。
   :::


  ```js
    var  arr = [];
    var sum = arr.reduce(function(prev, cur, index, arr) {
        return prev + cur;
    },1) 
    // sum === 1
  ```


  ### redcue高级应用

  #### 1.计算数组中每个元素出现的次数

  ```js
  var arr = [1, 2, 3, 4, 4, 5];
  var sum = arr.reduce(function(prev, cur) {
    if (cur in prev) {
      prev[cur]++;
    } else {
      prev[cur] = 1;
    }
    return prev;
  }, {});
  // {1: 1, 2: 1, 3: 1, 4: 2, 5: 1}
  ```

  #### 2.数组去重

  ```js
    var arr = [1, 2, 3, 4, 4, 5];
    var sum = arr.reduce(function(prev, cur) {
    if(prev.indexOf(cur) !== -1) {
      return prev
    } else {
      return prev.concat(cur)
    }
    }, []);
    // [1, 2, 3, 4, 5]
  ```

  #### 3.多维数组转化为一维数组

  ```js
  let arr = [0, [1], [2, 3,7], [4,[5,6]]]
  const sum = function(arr){
    return arr.reduce((pre,cur)=>pre.concat(Array.isArray(cur)?sum(cur):cur),[])
  }
  // [0, 1, 2, 3, 7, 4, 5, 6]
  ```

  #### 4.对象数组求和

  ``` js
  var arr = [
    {
      name: 'apple',
      price: 100,
    },
    {
      name: 'watermelon',
      price: 120,
    },
    {
      name: 'pear',
      price: 20,
    },
  ];

  var sum = result.reduce(function(prev, cur) {
    return cur.price + prev;
  }, 0);

  // 240
  ```