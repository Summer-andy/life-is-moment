---
title: 📝 记录一些平时小工具以及函数库
date: 2020-03-07
tags:
 - 随笔记录
categories:
 - 前端基础
---


- 🔥 [thenby](https://www.npmjs.com/package/thenby) 可以帮我们完成多条件依次排序。
  假如我们需要先按照阶段排序然后再按照顺序排序。
  ```js
  import { firstBy } from 'thenby'
  var data = [ { phare: 1, order: 1 }, { phare: 2, order: 2 }, { phare: 2, order: 1 } ];
  
  var sortData =  data.sort(
  firstBy(function(a, b) { return a.phare - b.phare })
  .thenBy(function(a, b) { return a.order - b.order })
  ); 
  // [ { phare: 1, order: 1 }, { phare: 2, order: 1 }, { phare: 2, order: 2 } ];
  ```

- 🔥 获取当前页面滚动位置
  ```js
  const getScrollPosition = (el = window) => ({
    x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
    y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
  });
  ```
- 🔥 平滑的滚动到页面顶部
  ```js
  const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
  }
  ```
- 🔥 判断当前元素在当前视图能够被看见
  ```js
  const elementIsVisibleInViewport = el => {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
  };
  ```
- 判断当前环境是手机和pc电脑环境
  ```js
  const detectDeviceType = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      ? 'Mobile'
      : 'Desktop';
  ```
- 判断当前浏览器选项卡是否聚焦
  ```js
  const isBrowserTabFocused = () => !document.hidden;
  ```  
