---
title: 10个自定义Hook助你不再加班
date: 2020-05-28
tags:
  - React基础
categories:
  - React
---

## 前言
    
  ::: tip
  For you a thousand times over 为你，千千万万遍   ———————— 《追风筝的人》
  ::: 

## 温馨提示
 
  本文所有的自定义Hook均来自于[https://usehooks.com/](https://usehooks.com/)。由于这上面的内容都是英文并且篇幅比较长, 可能有的小伙伴阅读起来会比较吃力, 因此我将会挑一些比较常用的自定义Hook来分享一下。

## useAsync

### 📚 简单描述
  
  使用自定义钩子, 将异步函数作为输入, 将返回的值、状态、是否立即执行异步函数作为输出, 我们可以很方便地来跟踪异步调用的状态。


### ✨ 动画效果

![image](./useAsync.gif)


### 🌰 使用示例

```js
  import React from 'react';
  import { BoxLoading } from 'react-loadingg';
  import useAsync from './component/useAsync';
  function App() {
    const axiosFunc = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() * 10 < 5 ? resolve('我小于5!') : reject('我不比5小!');
        }, 1000);
      });
    };

    const [excute, value, pending, error] = useAsync(axiosFunc, false);

    return (
      <div style={{ height: 100, width: 100, position: 'relative' }}>
        {!pending && <button onClick={excute}>点击我加载接口</button>}
        {pending && <BoxLoading />}
        <b style={{ color: 'green' }}>{value}</b>
        <b style={{ color: 'red' }}>{error}</b>
      </div>
    );
  }

  export default App;
```

### 🚀 自定义Hook
```js
const useAsync = (asyncFunction, immediate = true) => {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(() => {
    setPending(true);
    setValue(null);
    setError(null);
    return asyncFunction()
      .then(response => setValue(response))
      .catch(error => setError(error))
      .finally(() => setPending(false));
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, value, pending, error };
};
```
