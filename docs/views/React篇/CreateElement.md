---
title: React源码阅读之CreateElement
date: 2019-10-31
tags:
  - React源码
categories:
  - React
---

### React 源码阅读之 CreateElement

#### 首先我们使用 Babel 来编译一段简单的 jsx 来看看 React 是如何处理这段代码的

##### jsx:

```js
<div id="test" className="warp" ref="123">
  <span>123</span>
</div>
```

##### js:

```js
React.createElement(
  'div',
  {
    id: 'test',
    className: 'warp',
    ref: '123'
  },
  React.createElement('span', null, '123')
);
```

##### 经过编译后我们可以看到。React 会调用 createElement 这个方法来创建 dom,其中这个方法的第一个参数我们很容易能够理解是标签的类型。第二个参数是 props.第三个参数 children。接下来,我们翻一翻 React 的源码。我们看了之后发现跟我们预想的差不多,这里需要注意的 ref 和 key 是不作为 props 传递到子组件的,我们可以看第二段代码这边有一个内建的 props，如果是内建的 props 那么就不会放到 props 中。 除此之外,我们还可以看到其实 createElement 可以支持传递很多个参数,只不过后面的参数都会被当做 children 处理。

```js
export function createElement(type, config, children) {
  let propName;

  const props = {};

  let key = null;
  let ref = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }

    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }
}
```

```js
  // 内建的props
  const RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true,
  };

  if (config != null) {
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }
```
