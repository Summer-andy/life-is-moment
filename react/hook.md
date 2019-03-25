(```)
import React, { Fragment, useState, useEffect } from 'react';
const Hooks = ({}) => {
  const [count, setcount] = useState(0);
  const [count1, setcount1] = useState(100);
  // 定义一个count的state, 其中useState括号里面的值为初始值
  // 数组中第一个为变量state, 为设置变量的函数

  const addCount = () => {
    setcount(count+1);
  }

  useEffect(() => {
    console.log(`你点击了${count}次`);
  }, [count1])

  // 个人对该函数的初步理解是：userEffect钩子是 componentDidMount 和 componentDidUpdate的结合体。
  // 该钩子的第二个参数是指, 当第二个参数里面的state不变时 useEffect 不执行.

  // 当然react还提供了很多有用的hook

  // useContext

  // useReducer

  // useCallback

  // useMemo

  // useRef

  // useImperativeMethods

  // useMutationEffect

  // useLayoutEffect

  return <div style={{ cursor: 'pointer' }} onClick={addCount}>点击我++:{count}</div>
};

export default Hooks;

(```)