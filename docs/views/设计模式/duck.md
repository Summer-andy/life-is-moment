---
title: 动态语言类型和鸭子类型
date: 2019-09-21
tags:
 - 设计模式
categories:
 - 前端基础
---

##### 编译语言按照数据类型大体可分为两类, 一类是静态类型语言,另一类是动态语言类型。静态语言在编译时已经确定了变量的类型,而动态语言类型的变量要在程序运行的时候才能确认。在js中, 我们对变量赋值的时候, 我们并不需要考虑它的类型。因此js是一门典型的动态类型语言。由于无需对类型进行检测,我们可以尝试调用任何对象的任意方法,而无需去考虑他原本是否应该被设计拥有该方法。这一切都建立在鸭子类型的概念上, 鸭子类型的通俗说法是, 如果他走起路来是鸭子，叫起来也是鸭子,那么它就是鸭子。

``` 
  var duck = {
  name: '🦆',
  duckSinging: function () {
    console.log('嘎嘎嘎');
  }
 }

var chickKen = {
  name: '🐔',
  duckSinging:function () {
    console.log('嘎嘎嘎');
  }
 }

var choir = [];

var joinChoir = function (animal) {
  if(animal && typeof animal.duckSinging === 'function') {
    choir.push(animal);
  }
}

joinChoir(duck);
joinChoir(chickKen);

```


####  多态
##### 主人家里养了两只动物，分别是一只鸭和一只鸡，当主人向它们发出“叫”的命令 时，鸭会“嘎嘎嘎”地叫，而鸡会“咯咯咯”地叫。这两只动物都会以自己的方式来发 出叫声。它们同样“都是动物，并且可以发出叫声”，但根据主人的指令，它们会各自 发出不同的叫声。

```
  var makeSound = function(animal) {
    if (animal instanceof cat) {
      console.log('喵喵喵');
    }
    if (animal instanceof dog) {
      console.log('汪汪汪');
    }
  };

  var cat = function(params) {};

  var dog = function(params) {};

  makeSound(new cat());
  makeSound(new dog());
```

##### 思考以上代码: 如果这时候来了一只鸡,那么我们是不是得修改makeSound这个方法了？修改代码总是危险的，修改的地方越多，程序出错的可能性就越大，而且当动物的种类越 来越多时，makeSound 有可能变成一个巨大的函数。多态背后的思想是将“做什么”和“谁去做以及怎样去做”分离开来，也就是将“不变的事 物”与 “可能改变的事物”分离开来。接下来我们改造一下代码:

```
    var makeSound = function(animal) {
      animal.sound();
    };

    var cat = function(params) {};

    var dog = function(params) {};

    cat.prototype.sound = function(params) {
      console.log('喵喵喵');
    };

    dog.prototype.sound = function(params) {
      console.log('汪汪汪');
    };

    makeSound(new cat());
    makeSound(new dog());
    
```