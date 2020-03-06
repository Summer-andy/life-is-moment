---
title: React源码学习之FiberRoot与RootFiber以及Update
date: 2017-09-21
tags:
  - React源码
categories:
  - React
---

##### 名词讲解
   - FiberRoot
   - RootFiber
   - Update
   - UpdateQueue

   1. FiberRoot:它是整个应用的起点,并且包含了应挂载的目标及诶单,同时它也记录着整个应用更新过程中的各种信息 
   2. RootFiber:每一个ReactElement对应一个RootFiber对象，因此一个组件可以对应一个或者多个Fiber.Fiber上也记录了组件的的状态,比如state, props。我们使用Fiber对象可以把我们整个应用串联成一个树形结构。
   3. Update: 用于记录组件状态的改变,同时它存放于UpdateQueue链表中,因此可以同时存在多个Update对象.实际在React中,如果我们setState导致了三个更新,那么React会创建3个Update对象, 等到3个Update对象都创建完后,再根据调度算法进行一个一个更新。
   4. UpdateQueue: UpdateQueue队列。主要用于存储每次更新完后的state, 以及记录各种情况下的Update对象。