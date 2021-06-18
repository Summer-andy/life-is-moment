---
title: 📝 记录一些平时小工具以及函数库
date: 2020-05-30
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


  ::: tip
- [React缓存路由(类似vue中的keep-alive)](https://github.com/CJY0208/react-router-cache-route)
  :::

  ```js
  import React from 'react'
  import { HashRouter as Router, Route } from 'react-router-dom'
  import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
  import List from './views/List'
  import Item from './views/Item'
  const App = () => (
    <Router>
      <CacheSwitch>
        <CacheRoute exact path="/list" component={List} />
        <Route exact path="/item/:id" component={Item} />
        <Route render={() => <div>404 Not Found</div>} />
      </CacheSwitch>
    </Router>
  )
  export default App
  ```
  ::: tip
- [React pdf预览插件](https://github.com/forthealllight/react-read-pdf)
  :::
  
  ```js
  import { PDFReader } from 'react-read-pdf'
  <PDFReader url={"http://localhost:3000/test.pdf"} ...> // 同时也支持base64
  ```

  ::: tip
- [React虚拟列表组件](https://github.com/bvaughn/react-virtualized)
  :::

  ::: tip
- [React优雅的提示插件](https://github.com/fkhadra/react-toastify)
  :::

  ```js

  import { toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  toast.warn("Warning Notification !", {
    position: toast.POSITION.BOTTOM_LEFT
  });

  ```

  ::: tip
- [模糊延迟加载图片插件](https://github.com/Aljullu/react-lazy-load-image-component)
  :::

  ```js
  import { LazyLoadImage } from 'react-lazy-load-image-component';

  const MyImage = ({ image }) => (
    <div>
      <LazyLoadImage
        alt={image.alt}
        height={image.height}
        src={image.src} // use normal <img> attributes as props
        width={image.width} />
      <span>{image.caption}</span>
    </div>
  );
  ```

  ::: tip
  -   根据DOM以及DOM的属性名获取属性的值
  :::

  ```js
  const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
  const MOZ_HACK_REGEXP = /^moz([A-Z])/;

  const camelCase = function(name) {
    return name
      .replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
      })
      .replace(MOZ_HACK_REGEXP, 'Moz$1');
  };

  const getStyle = function(element, styleName) {
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
      styleName = 'cssFloat';
    }
    try {
      var computed = document.defaultView.getComputedStyle(element, '');
      return element.style[styleName] || computed ? computed[styleName] : null;
    } catch (e) {
      return element.style[styleName];
    }
  };
 
  getStyle(dom, 'paddingLeft') // 使用示例
  ```

  ::: tip
   - 标签内容长度的精确计算
  :::

  ```js
    const element = dom   // 获取标签元素
    const range  = document.createRange();
    range.setStart(element, 0);
    range.setEnd(element, element.childNodes.length)
    range.getBoundingClientRect().width  
  ```

  ::: tip
- [校验和解析数据](https://github.com/jquense/yup)
  :::

  ```js

    let yup = require('yup');

    let schema = yup.object().shape({
      name: yup.string().required(),
      age: yup.number().required().positive().integer(),
      email: yup.string().email(),
      website: yup.string().url(),
      createdOn: yup.date().default(function () {
        return new Date();
      }),
    });

    // check validity
    schema
      .isValid({
        name: 'jimmy',
        age: 24,
      })
      .then(function (valid) {
        valid; // => true
      });

    // you can try and type cast objects to the defined schema
    schema.cast({
      name: 'jimmy',
      age: '24',
      createdOn: '2014-09-23T19:25:25Z',
    });
  ```

  ::: tip
- [新手引导组件](https://github.com/elrumordelaluz/reactour)
  :::

  ```js
  import React, { useState } from 'react'
  import Tour from 'reactour'

  const steps = [
    {
      selector: '.first-step',
      content: 'This is my first Step',
    },
    // ...
  ];

  const App = () => {
    const [isTourOpen, setIsTourOpen] = useState(false);

    return (
      <>
        { /* other stuff */}
        <Tour
          steps={steps}
          isOpen={isTourOpen}
          onRequestClose={() => setIsTourOpen(false)}
        />
      </>
    )
  };
  ```
