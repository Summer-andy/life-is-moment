---
title: useEffect 与 EventEmitter的故事
date: 2020-03-24
tags:
  - React基础
categories:
  - React
---

#### 我们先来看一个简单的例子。需求是这样子的, 每当你点击 count+1 的按钮时 count 的数量会加 1, 然后当我们点击触发事件的时候能输出 count 的最终值。

```js
import React, { Fragment, useState, useEffect } from 'react';
import { Emitter } from './event';
const Layout = () => {
  const [count, setCount] = useState(1);

  const handleTrigger = () => {
    Emitter.emit('click', '🐶');
  };

  useEffect(() => {
    Emitter.on('click', data => {
      console.log(`i am ${count} 号 ${data}仔`);
    });
    event();
  }, [count]);

  return (
    <Fragment>
      <button onClick={() => setCount(count + 1)}>点击count+1</button>
      <br />
      <button onClick={handleTrigger}>点击触发事件</button>
    </Fragment>
  );
};

export default Layout;
```

#### 运行完以上代码,我们会发现我点击3次会输出4次, 分别是
```
i am 1 号 🐶仔
i am 2 号 🐶仔
i am 3 号 🐶仔
i am 4 号 🐶仔
```

但我们再次点击count+1的按钮3次时会输出
```
i am 1 号 🐶仔
i am 2 号 🐶仔
i am 3 号 🐶仔
i am 4 号 🐶仔
i am 5 号 🐶仔
i am 6 号 🐶仔
i am 7 号 🐶仔
```
这跟我们想的完全不一样。我们想要的结果是
```
i am 4 号 🐶仔
```

```
i am 7 号 🐶仔
```

发现了问题后,我们开始解决问题,可能有的同学说这还不简单, 直接写点小算法取最后一次的数据不就ok了嘛。但是这种方法肯定不是最佳的,官方肯定有最优解。我们来看一下useEffect的官方说明:

```
Accepts a function that contains imperative, possibly effectful code.

Mutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a function component (referred to as React’s render phase). Doing so will lead to confusing bugs and inconsistencies in the UI.

Instead, use useEffect. The function passed to useEffect will run after the render is committed to the screen. Think of effects as an escape hatch from React’s purely functional world into the imperative world.

By default, effects run after every completed render, but you can choose to fire them only when certain values have changed.

```

我们大致翻译一下, 他的意思是说,Hooks的主体接受一个命令式,以及可能会副作用的函数。



```js
import React, { Fragment, useState, useEffect } from 'react';
import { Emitter } from './event';
const Layout = () => {
  const [count, setCount] = useState(1);

  const handleTrigger = () => {
    Emitter.emit('click', '🐶');
  };

  const func = data => {
    console.log(`i am ${count} 号 ${data}仔`);
  };

  useEffect(() => {
    Emitter.on('click', func);
    return () => {
      Emitter.removeListener('click', func);
    };
  }, [count]);

  return (
    <Fragment>
      <button onClick={() => setCount(count + 1)}>点击count+1</button>
      <br />
      <button onClick={handleTrigger}>点击触发事件</button>
    </Fragment>
  );
};

export default Layout;
```
