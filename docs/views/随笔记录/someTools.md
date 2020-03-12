---
title: 📝 记录一些平时小工具以及函数库
date: 2020-03-12
tags:
 - 随笔记录
categories:
 - 前端基础
---


::: tip
- 🔥 [thenby](https://www.npmjs.com/package/thenby) 可以帮我们完成多条件依次排序。
  假如我们需要先按照阶段排序然后再按照顺序排序。
:::

  ```js
  import { firstBy } from 'thenby'
  var data = [ { phare: 1, order: 1 }, { phare: 2, order: 2 }, { phare: 2, order: 1 } ];
  
  var sortData =  data.sort(
  firstBy(function(a, b) { return a.phare - b.phare })
  .thenBy(function(a, b) { return a.order - b.order })
  ); 
  // [ { phare: 1, order: 1 }, { phare: 2, order: 1 }, { phare: 2, order: 2 } ];
  ```
::: tip
- 🔥 获取当前页面滚动位置
:::

  ```js
  const getScrollPosition = (el = window) => ({
    x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
    y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
  });
  ```
 ::: tip 
- 🔥 平滑的滚动到页面顶部
 ::: 
  ```js
  const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
  }
  ```
   ::: tip 
- 🔥 判断当前元素在当前视图能够被看见
   :::
  ```js
  const elementIsVisibleInViewport = el => {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
  };
  ```
  ::: tip 
- 判断当前环境是手机和pc电脑环境
  :::

  ```js
  const detectDeviceType = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      ? 'Mobile'
      : 'Desktop';
  ```
  ::: tip
- 判断当前浏览器选项卡是否聚焦
  ::: 
  ```js
  const isBrowserTabFocused = () => !document.hidden;
  ```  

  ::: tip
- [获取省级（省份直辖市自治区）、 地级（城市）、 县级（区县）、 乡级（乡镇街道）、 村级（村委会居委会)中国省市区镇村二级三级四级五级联动地址数据五级联动地址](https://github.com/modood/Administrative-divisions-of-China)
  ::: 