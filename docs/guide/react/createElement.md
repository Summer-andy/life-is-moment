### React源码阅读之CreateElement

#### 首先我们使用Babel来编译一段简单的jsx来看看React是如何处理这段代码的
##### jsx:
```
<div id="test" className="warp" ref="123" >
	<span>123</span>
</div>
```
##### js:
```
React.createElement("div", {
  id: "test",
  className: "warp",
  ref: "123"
}, React.createElement("span", null, "123"));
```
##### 经过编译后我们可以看到。React会调用createElement这个方法来创建dom,其中这个方法的第一个参数我们很容易能够理解是标签的类型。第二个参数是props.第三个参数children。接下来,我们翻一翻React的源码。我们看了之后发现跟我们预想的差不多,这里需要注意的ref和key是不作为props传递到子组件的,我们可以看第二段代码这边有一个内建的props，如果是内建的props那么就不会放到props中。 除此之外,我们还可以看到其实createElement可以支持传递很多个参数,只不过后面的参数都会被当做children处理。

```
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
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
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

```
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