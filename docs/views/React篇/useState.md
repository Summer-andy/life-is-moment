---
title: useState源码解析
date: 2021-03-24
tags:
  - React基础
categories:
  - React
---

## 前言

   useState是我们在编写Hook代码时经常用到的一个钩子。本文将会带着大家深入源码, 探寻useState这个钩子做了哪些事情。

## 前置知识

    - performUnitOfWork:  从root节点开始更新, 然后遍历下一个节点, 直接遍历要要更新的节点为止。此时开始调用 ``` beginWork ```

    ```js
    var current$$1 = workInProgress.alternate // 当前的fiber节点
    ```

    在调用render或者setState后会克隆出一个镜像fiber, diff产出的变化会标记在镜像fiber上。而alternate就是链接当前
    fiber tree和镜像fiber tree , 用于断点恢复。

    work-in-progress
    A fiber that has not yet completed; conceptually, a stack frame which has not yet returned.The alternate of the current fiber is the work-in-progress, and the alternate of the work-in-progress is the current fiber

    1. current$$1.memoizedState: element
    2. null 
    3. match: { path: '/', url: '/', params: {} }
    4. null
    5. null
    6. null
    7. null
    8. match: null
    9. match: null
    10. match: null
    11. match: null
    12. match: null
    13. match: { path: '/hooks', url: '/hooks', params: {} }
    14. baseState: 134
        baseUpdate: {expirationTime: 1073741823, action: 134, next:  { action: 135 expirationTime: 1073741823 next: null}}
        memoizedState: 134
        next: null
        queue: {
          dispatch: action
          last: {
          action: 135
          expirationTime: 1073741823
          next: null
          }
        }

  - beginWork

  - updateFunctionComponent的current$$1

  - updateFunctionComponent 

  - prepareToUseHooks之前的current.memoizedState 
     
  - prepareToUseHooks 准备使用Hook, 这时候已经生成了quene   

  -   
  
  ```js
  var _action2 = _update.action;
  _newState = reducer(_newState, _action2);

  function basicStateReducer(state, action) {
      return typeof action === 'function' ? action(state) : action;
  }
  ```

   
## 渲染Hook前的准备

   当执行 ``` updateFunctionComponent ``` 的时候首先会调用 ``` prepareToUseHooks ``` 函数, 它的内容非常简单, 第一步设置本次更新的优先级,
   第二步将当前fiberNode赋值到 ``` currentlyRenderingFiber$1 ```, 从命名描述来看就能猜出, 它的目的是将当前的fiberNode赋值给当前要渲染的fiber.
   第三步, 如果是首次更新, current是null, 那么当前的 ``` firstCurrentHook ``` 肯定也是null了, 如果不是首次渲染那么  ``` current.memoizedState ```就会附带当前的state信息以及将要更新的队列queue, 队列中包含下一次更新的值。


   ```js
    function prepareToUseHooks(current, workInProgress, nextRenderExpirationTime) {
      if (!enableHooks) {
        return;
      }
      renderExpirationTime = nextRenderExpirationTime;
      currentlyRenderingFiber$1 = workInProgress;
      firstCurrentHook = current !== null ? current.memoizedState : null; // The following should have already been reset
    }
   ```

## 渲染完Hook后的复位

   当我们在渲染完Hook的时候, 如果中间发起了Action的派发(setCount)比如以下代码:

   ```js
   import React, { useState } from 'react';
   const Parent = () => {

   const func = () => 123;
   const [count, setCount] = useState(func);
   setCount(222);

  return (
        <div>
          <span>{count}</span>
          <button onClick={() => setCount(count + 1)}>加1</button>
        </div>  
      )
    };

    export default Parent;
   ```
   
   此时 ``` didScheduleRenderPhaseUpdate ``` 会在执行 ``` dispatchAction ``` 的阶段置为true, 只有当 ``` didScheduleRenderPhaseUpdate ``` 为false的时候才跳出循环, 将一些全局变量复位。

   ```js
    function finishHooks(Component, props, children, refOrContext) {
      if (!enableHooks) {
        return children;
      }

      while (didScheduleRenderPhaseUpdate) {
        // Updates were scheduled during the render phase. They are stored in
        // the `renderPhaseUpdates` map. Call the component again, reusing the
        // work-in-progress hooks and applying the additional updates on top. Keep
        // restarting until no more updates are scheduled.
        didScheduleRenderPhaseUpdate = false;
        numberOfReRenders += 1; // Start over from the beginning of the list

        currentHook = null;
        workInProgressHook = null;
        componentUpdateQueue = null;
        children = Component(props, refOrContext);
      }

      renderPhaseUpdates = null;
      numberOfReRenders = 0;
    }
   ```
   

## 首次渲染阶段

  - createWorkInProgressHook

    每次调用Hook都会调用 ``` createWorkInProgressHook ``` 创建一个迷你版fiber的对象。

    由于是初始化, 全局变量 ``` workInProgressHook ``` 、 ``` firstWorkInProgressHook ``` 、 ```  firstCurrentHook ``` 都是为空的,
    因此, 初始化的时候 ``` createWorkInProgressHook ``` 会调用 ``` createHook ``` 创建一个对象。
    ```js
    function createWorkInProgressHook() {
        if (workInProgressHook === null) {
          // This is the first hook in the list
          if (firstWorkInProgressHook === null) {
            isReRender = false;
            currentHook = firstCurrentHook;

            if (currentHook === null) {
              // This is a newly mounted hook
              workInProgressHook = createHook();
            } else {
              // Clone the current hook.
              workInProgressHook = cloneHook(currentHook);
            }

            firstWorkInProgressHook = workInProgressHook;
          } else {
            // There's already a work-in-progress. Reuse it.
            isReRender = true;
            currentHook = firstCurrentHook;
            workInProgressHook = firstWorkInProgressHook;
          }
        }
    }
    ```

  - queue

    ```js
    var queue = workInProgressHook.queue;
    ```

    首次渲染我们拿到的queue是为空的因此我们直接跳过 ``` queue !== null ``` 的条件, 如果我们state的初始值是function类型的, 那么就直接执行该函数获取值。

    由于useState中调用的 ``` useReducer ```不存在第三个参数, 因此 ```  initialState = reducer(initialState, initialAction); ``` 这种情况可以忽略。

    最后将初始值赋值给

    ```js
    function useState(initialState) {
      return useReducer(basicStateReducer, // useReducer has a special case to support lazy useState initializers
      initialState);
    }
    ```

    ```js

    function useReducer(reducer, initialState, initialAction) {
      workInProgressHook = createWorkInProgressHook();
      var queue = workInProgressHook.queue;

      if(queue !== null) {
        // ...
      }

      if (reducer === basicStateReducer) {
        // Special case for `useState`.
        if (typeof initialState === 'function') {
          initialState = initialState();
        }
      } else if (initialAction !== undefined && initialAction !== null) {
        initialState = reducer(initialState, initialAction);
      }

      workInProgressHook.memoizedState = workInProgressHook.baseState = initialState;
      queue = workInProgressHook.queue = {
        last: null,
        dispatch: null
      };
      var dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue);
      return [workInProgressHook.memoizedState, dispatch];
    }
    ```

    至此, 初始化Hook的流程已经走完, 接下来我们来看一下通过dispatch的流程是如何进行的。

 ## 更新阶段渲染过程

  - createWorkInProgressHook

    跟首次更新一样, 我们需要通过调用 ```createWorkInProgressHook ``` 重新创建一个 ``` workInProgressHook ```。只不过此时的 ``` currentHook ``` 不再为null了, 因此在此阶段我们调用 cloneHook ```  workInProgressHook = cloneHook(currentHook);  ``` 去克隆 ``` currentHook ```。而cloneHook函数做的仅仅只是将值复制一遍, 并且将next的值置为null。

    ```js
     function cloneHook(hook) {
      return {
        memoizedState: hook.memoizedState,
        baseState: hook.memoizedState,
        queue: hook.queue,
        baseUpdate: hook.baseUpdate,
        next: null
      };
    }
    ```

  -  queue

    ```js
    queue = {
      dispatch: func,
      last: {
        action: 124
      }
    }
    ```

    此时我们的queue不再为null. 因此进入 queue !== null 的循环中。接下来就将queue最新的值赋值给当前 ``` workInProgressHook ``` 的 memoizedState, 完成
    新的一轮state的更新。

    ```js

    if(queue !== null) {
      // ...
      var _last = queue.last; // The last update that is part of the base state.
      var _baseUpdate = workInProgressHook.baseUpdate;
      var first = void 0;

      first = _last !== null ? _last.next : null

      var _update = first;

       var _action2 = _update.action;

      _newState = reducer(_newState, _action2);

      workInProgressHook.memoizedState = _newState;
      workInProgressHook.baseUpdate = newBaseUpdate;
      workInProgressHook.baseState = newBaseState;
    }
    ```




