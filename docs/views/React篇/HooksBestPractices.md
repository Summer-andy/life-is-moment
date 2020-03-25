---
title: useEffect 与 EventEmitter的故事
date: 2020-03-24
tags:
  - React基础
categories:
  - React
---

#### 场景一:

```js
import React, { Fragment, useState, useEffect } from 'react';
import { Emitter } from './event';
const Layout = () => {
  const [count, setCount] = useState(1);

  const handleTrigger = () => {
    Emitter.emit('click', '🐶');
  };

  useEffect(() => {
    const event = () => {
      Emitter.on('click', data => {
        console.log(`i am ${count} 号 ${data}仔`);
      });
    };

    event();

    return () => {
      Emitter.removeListener('click', event);
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


``` js
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
      Emitter.removeListener('click', func)
    }
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
