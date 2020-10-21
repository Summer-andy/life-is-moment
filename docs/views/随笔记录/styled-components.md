---
title: 深入理解styled-components运行机制
date: 2020-10-20
tags:
 - 随笔记录
categories:
 - 前端基础
---

## 前言: 

  前些天看到塔希同学分享的《Linaria 也许是现在 React 最佳的 JSS 方案》文章后, 让我对JSS的理解又更进了一步, 为了更加深入地了解JSS, 我花了几天的时间阅读了各个JSS库的源码, 在阅读的过程中, 写下了这篇文章, 分享给大家。
  如果对大家有帮助, 给个小小的[star](https://github.com/Summer-andy/life-is-moment)即可, 谢谢啦!。

## 如何阅读styled-components源码?

  ### 常用的API

  - styled 
  
    ```styled``` 基本上是我们最常用的API之一。例如我想要创建一个长和宽分为100px、且背景为红色的div.那么
    我们只需要编写如下代码即可:

    ```js
    const DivContainer = styled.div`
      width: 100px;
      height: 100px;
      background: red;
    `
    ```

  - createGlobalStyle  

    生成全局的css样式。例如我们需要将web应用中所有的p标签文字颜色为红色, 那么代码如下

    ```js
    const GlobalStyle = createGlobalStyle`
      h1 {
        color: red;
      }
    `
    ```

  - keyframes

    没有动画的css是没有灵魂的, 因此``` keyframes ``` 也是一个很重要的一个API.例如我们想要实现一个交替循环若隐若现的按钮, 那么代码如下: 

    ```js
    const pulse = keyframes`
      0% {
        opacity: 0;
        height: 100px;
        width: 100px;
      }
      100% {
        opacity: 1;
        height: 100px;
        width: 100px;
      }
    `

    const animation = props => css` ${pulse} ${props.animationLength} infinite alternate`;

    const PulseButton = styled.button`
      animation: ${animation};
    `
    ```

    还有一些其他API, 就不赘述了。既然我们已经学会了, 如何通过 ``` styled-components ``` 构建样式。那么我们需要知道它是如何将上述代码转化为css和js的, 并且它们存在的形态是什么?对于第一个问题, 可能暂时还不太好解释, 那么先来看第二个问题. 第二个问题换一种说法, 其实就是styled-components的产物是什么。

   ### styled-components的产物

  打开浏览器, 审查对应div块级元素。

 ![](https://imgkr2.cn-bj.ufileos.com/05f08be3-bcd4-4483-9531-a18930e27b7f.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=aJIT%252FyVTqGUjWaCSqLnKSmQGT38%253D&Expires=1603337129)


  通过上图, 我们可以发现。在head中生成了关于这个div的```style```标签, 它定义了文档中对应div的样式。
  除此之外, 它还给div添加了类名。仔细观察可以发现, 类名的后半部分字符串与style标签中的类名是一致的。
  那么它的整个过程应该是: 1. 生成style标签, 并且插入到head中  2.生成唯一的类名, 添加到对应元素的class上。

   ### 阅读源码的方式

   当我们对它的产物有所了解后, 其实这里有两种方法阅读源码:

   - 第一种方法: 我们可以根据它的产物, 比如``` <style> .XXXX { background: red } </style> ```, 很明显这东西肯定是通过``` document.createElement('style') ```创建的, 那么我们在源码中查找对应片段的代码, 然后一步一步向上摸索, 但是这种方法适合简单的项目。

   - 第二种方法: 这种方法应该是看任何源码最常用的方法了, 我们通过查看``` styled-components ``` export出来的接口, 一步一步的向下摸索。比如我们在第一小节中提及的常用API.但是, 这种方法可能会让大家在阅读源码的过程中迷失自我, 即假如源码中的逻辑嵌套太深或者分支太多, 我们很容易陷入源码的汪洋大海。

   那么, 对于``` styled-components ```这个项目, 我们采用第二种最通用的办法。


   ### 从styled开始

   > 为了方便, 我接下来将``` styled-components ```简写为 ``` sc ```。

   #### 构建入口函数

   ```js
  var domElements = [
    'a',
    'abbr',
    'address',
    ...
  ]

  var styled = function styled(tag) {
    return constructWithOptions(createStyledComponent, tag)
  }

  domElements.forEach(function(domElement) {
    styled[domElement] = styled(domElement)
  })
   ```

   初次使用sc的同学, 可能会对它的语法奇怪。竟然还能这么写, 其实如下代码

  ```js
  const DivContainer = styled.div`
    width: 100px;
    height: 100px;
    background: red;
  `
  ```

还能修改成: 

```js
  const DivContainer = styled.div({
    width: '100px',
    height: '100px',
    background: 'red'
  })
```

因此我们能够很容易地得出: ```styled.div``` 等于 ``` styled('div') ``` 这个结论。那么后面跟着的模板字符串又是怎么一回事呢? 我们先来看一个简单的例子: 

```js
function latex(str) { 
  return { "cooked": str[0], "raw": str.raw[0] }
} 

latex`\unicode`

// { cooked: undefined, raw: "\\unicode" }
```

上述例子摘自于[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), 函数后接模板字符串是 ES6 的一个新语法特性。我们可以通过在函数后面添加模板字符串为其传参。那么我们接下来查看``` constructWithOptions ```函数是如何处理参数的。

```js
function constructWithOptions(componentConstructor, tag, options) {

  var templateFunction = (...args) =>  componentConstructor(tag, options, ...args);

  return templateFunction;
}
```

首先``` constructWithOptions ``` 接收三个参数, 第一个参数```componentConstructor```, 它指代的是```createStyledComponent```函数, 这个函数我们接下来会讲到。第二个参数```tag```, 指代的是styled后的标签名称, 比如div。第三个参数是options, 用来传递一些参数,由于它并不是很重要,因此我们可以把它忽略。

读到这里, 细心的同学应该也发现了, 之前的styled.XX其实是一个柯里化函数。类似F()()。



### 构建DOM元素函数

既然我们现在已经能够接收到所有的参数了。那么我们接下来自然而然的会想到页面上的DOM是如何被构建出来的呢？
那么刚刚好``` createStyledComponent ``` 函数给了我们答案。

```js
function createStyledComponent(target, options = {}, rules) {
    const {
      attrs = EMPTY_ARRAY,
      // 生产唯一的组件Id
      componentId = generateId(options.displayName, options.parentComponentId),
      displayName = generateDisplayName(target)
    } = options;

    const styledComponentId =
    options.displayName && options.componentId
      ? `${escape(options.displayName)}-${options.componentId}`
      : options.componentId || componentId;

    var WrappedStyledComponent;
    var componentStyle = new ComponentStyle(rules, styledComponentId);


    // eslint-disable-next-line react-hooks/rules-of-hooks
    var forwardRef = (props, ref) =>  useStyledComponentImpl(WrappedStyledComponent, props, ref);
    
    forwardRef.displayName = displayName;

    WrappedStyledComponent = React.forwardRef(forwardRef);
    WrappedStyledComponent.attrs = attrs;
    WrappedStyledComponent.componentStyle = componentStyle;
    WrappedStyledComponent.target = target;
    WrappedStyledComponent.styledComponentId = styledComponentId;

    return WrappedStyledComponent;
  }
```

通过查看以上代码, 我们发现它return了一个 ``` WrappedStyledComponent ```。代码中的WrappedStyledComponent又是等于```  React.forwardRef(forwardRef) ```。如果对React比较熟悉, 那么大家应该能够猜想到
此处应该是用到了引用传递的知识点了。目的是为了能够让我们在DivContainer组件中也能使用ref去对元素做一些操作。那么我们接下来需要查看``` useStyledComponentImpl ``` 是如何创建元素的。

```js
function useStyledComponentImpl(forwardedComponent, props) {
  var componentAttrs = forwardedComponent.attrs,
    componentStyle = forwardedComponent.componentStyle

  const { target, styledComponentId } = forwardedComponent

  const propsForElement = {}

  //  生成组件的类名
  var generatedClassName = useInjectedStyle(
    componentStyle,
    componentAttrs.length > 0,
    props,
    undefined
  );
  
  // 合并类名
  propsForElement.className = Array.prototype
    .concat(
      [],
      styledComponentId,
      generatedClassName !== styledComponentId ? generatedClassName : null,
      props.className,
      undefined
    )
    .filter(Boolean)
    .join(' ')
    
  return React.createElement(target, propsForElement)
}
```

通过查看useStyledComponentImpl的返回值我们应该能知道, 它返回了一个React创建的元素。这也是我们上面提到的第二个过程点: ``` 生成唯一的类名, 添加到对应元素的class上 ``` 。那么我们还需要了解的是, 它是如何保证类名唯一的呢？

### 生成唯一的类名

```js
 propsForElement.className = Array.prototype
    .concat(
      [],
      styledComponentId,
      generatedClassName !== styledComponentId ? generatedClassName : null,
      props.className,
      undefined
    )
    .filter(Boolean)
    .join(' ')
```

我们查看以上代码, 可以大致清楚一点, styledComponentId、generatedClassName、props.className这三个条件是生成唯一类名的重要因子。因此我们逐个去了解各个因子的生成规则。

- styledComponentId

  顺藤摸瓜, 我们在开始的 ```createStyledComponent``` 中找到了 ``` styledComponentId ```的生成代码。

  ```js
    const {
      attrs = EMPTY_ARRAY,
      // 生产唯一的组件Id
      componentId = generateId(options.displayName, options.parentComponentId),
      displayName = generateDisplayName(target)
    } = options;

    const styledComponentId = componentId;
  ```

  然而styledComponentId的又是通过generateId初始化生成的, 一开始的时候options肯定是一个空的对象, 因此``` generateId ```的两个入参都是```void 0```.接下来, 我们继续查看 ``` generateId ``` 函数的实现逻辑

  ```js
  function generateId(displayName, parentComponentId) {
    const name = typeof displayName !== 'string' ? 'sc' : escape(displayName);
    identifiers[name] = (identifiers[name] || 0) + 1;
    const componentId = `${name}-${generateComponentId(
      SC_VERSION + name + identifiers[name]
    )}`;

    return parentComponentId ? `${parentComponentId}-${componentId}` : componentId;
  }
  ```

  通过debugger调试, 我们可以在控制台打印出 generateId生成的值: ``` sc-kkpfMf ```.由于displayName和parentComponentId的值都为```void 0```。因此函数中的name的值是``` sc ```, return的值是``` componentId ```那么``` generateComponentId ``` 成为了关键。 generateComponentId通过将sc的版本号加上identifiers[name]对应的值。identifiers[name]它的值是不断递增的。假如页面上有两个div元素: 

  ```js
  const DivContainer = styled.div`
    width: 100px;
    height: 100px;
    background: red;
  `;

  const DivContainer1 = styled.div`
  width: 100px;
  height: 100px;
  background: red;
  `;
  ```

  那么在此处, 它们的```SC_VERSION + name + identifiers[name]```各为 ``` 5.2sc1``` 和 ``` 5.2sc2 ```。

  ```js
  import generateAlphabeticName from './generateAlphabeticName';
  import { hash } from './hash';

  export default (str) => {
    return generateAlphabeticName(hash(str) >>> 0);
  };
  ```

  以上``` generateComponentId ``` 函数的源代码。我们发现它首先对传进来的字符串做了一次哈希处理, 让通过 ``` generateAlphabeticName ``` 函数生成了唯一字符串。

  ```js
  const AD_REPLACER_R = /(a)(d)/gi;

  /* This is the "capacity" of our alphabet i.e. 2x26 for all letters plus their capitalised
  * counterparts */
  const charsLength = 52;

  /* start at 75 for 'a' until 'z' (25) and then start at 65 for capitalised letters */
  const getAlphabeticChar = (code) =>
    String.fromCharCode(code + (code > 25 ? 39 : 97));

  /* input a number, usually a hash and convert it to base-52 */
  export default function generateAlphabeticName(code) {
    let name = '';
    let x;

    /* get a char and divide by alphabet-length */
    for (x = Math.abs(code); x > charsLength; x = (x / charsLength) | 0) {
      name = getAlphabeticChar(x % charsLength) + name;
    }

    return (getAlphabeticChar(x % charsLength) + name).replace(AD_REPLACER_R, '$1-$2');
  }

  ```

  由于生成的哈希值过于巨大, 因此我们需要对数据进行降级处理, 我们发现name的生成是通过获取每一次x的绝对值模52后的余数,然后通过``` getAlphabeticChar ``` 调用 ``` String.fromCharCode()  ```, 生成英文字符串。

  以上就是componentId的生成的全部过程了。一般sc创建的元素的类名是: ``` sc-XXXXX #### ```。因此到这里我们生成了元素类名的前半部分即sc-XXXXX。那么后半部分是如何生成的呢？ 同时, 我们也发现,后半部分的名称与head中style标签内类名一致。

- generatedClassName

  通过debugger发现, generatedClassName的值正是我们要寻找的 ####。
  ```js
  var generatedClassName = useInjectedStyle(
    componentStyle,
    componentAttrs.length > 0,
    props,
    undefined
  );
  ```

  那么我们来查看它的入参, 首先第一个参数 ``` componentStyle ``` 是我们在 ``` createStyledComponent ``` 的时候, 就实例化了 ``` var componentStyle = new ComponentStyle(rules, styledComponentId) ```.我们可以看到实例化的时候传递了rules, 而rules指的就是css代码, styledComponentId指的就是对应元素的前半部分类名``` sc-XXXXX ```。那么继续查看 ``` useInjectedStyle ``` 是如何处理实例化后的ComponentStyle。

  ```js
  function useInjectedStyle(componentStyle, hasAttrs, resolvedAttrs) {
    var styleSheet = useStyleSheet()
    var stylis = useStylis()
    // todo  generateAndInjectStyles插入css rules
    var className = componentStyle.generateAndInjectStyles(
      resolvedAttrs,
      styleSheet,
      stylis
    )
    return className
  }
  ```

  我们通过调用generateAndInjectStyles方法将css代码插入到head中, 并且生成了对应的className.Lets go!

  ```js
  const SEED = hash(SC_VERSION)

  export default class ComponentStyle {
    constructor(rules, componentId, baseStyle) {
      this.rules = rules
      this.staticRulesId = ''
      this.isStatic = false
      this.componentId = componentId
      this.baseHash = phash(SEED, componentId)
      this.baseStyle = baseStyle
    }

    generateAndInjectStyles(executionContext, styleSheet, stylis) {
      const { length } = this.rules
      var componentId = this.componentId
      let dynamicHash = phash(this.baseHash, '')
      let css = ''
      const names = []

      for (let i = 0; i < length; i++) {
        const partRule = this.rules[i]
        if (typeof partRule === 'string') {
          css += partRule
          dynamicHash = phash(dynamicHash, partRule + i)
        }
      }

      if (css) {
        var name = generateName(dynamicHash >>> 0)
        const cssFormat = stylis(css, `.${name}`, undefined, componentId)
        styleSheet.insertRules(componentId, name, cssFormat);
        names.push(name)
      }

      return names.join(' ')
    }
  }
  ```
  查看以上代码我们发现name的影响因子是dynamicHash。而它的值是通过哈希baseHash后生成的。我们查看构造器的这一行代码: ```  this.baseHash = phash(SEED, componentId) ```。我们发现baseHash是通过SEED和componentId来生成的。
  而SEED的值通过哈希sc的版本号获得的。我们发现尽管这个过程哈希了很多次, 但是我们只需要能够连接到对应元素的componentId即可。至此generatedClassName的生成也完成了, 因此最后一步就是把css代码插入到head中。

  ### 生成style标签

  ```js
    const cssFormat = stylis(css, `.${name}`, undefined, componentId)
    styleSheet.insertRules(componentId, name, cssFormat);
  ```

  继续上述代码, 我们能够显而易见的知道, insertRules应该就是将css代码插入到head中。因此我们查看styleSheet对应的insertRules方法。

  ```js
  insertRules(id, name, rules) {
    this.getTag().insertRule(getGroupForId(id), rules);
  }

  getTag() {
    return this.tag || (this.tag = makeTag(this.options));
  }
  ```

  调用insertRules方法首先需要调用```this.getTag```方法获取tag.而初始化的时候 ```this.tag``` 是为空的, 因此焦点就来到了makeTag方法。


  ```js
  import { makeStyleTag } from "./Dom";

  export const makeTag = ({ isServer, useCSSOMInjection, target }) => {
      return new TextTag(target);
  };

  export class TextTag{
    constructor(target) {
      const element = (this.element = makeStyleTag(target));
      this.nodes = element.childNodes;
      this.length = 0;
    }

    insertRule(index, rule) {
        const node = document.createTextNode(rule);
        const refNode = this.nodes[index];
        this.element.insertBefore(node, refNode || null);
        this.length++;
        return true;
    }
  }
  ```
  insertRule方法首先调用了 document.createTextNode() 方法将css代码作为文本节点的方式插入到this.element中。按照我们的猜想this.element应该就是style元素了。我们查看makeStyleTag方法创建了什么？

  ```js
  export const makeStyleTag = (target) => {
    const head = document.head;
    const parent = target || head;
    const style = document.createElement('style');
    const prevStyle = findLastStyleTag(parent);
    const nextSibling = prevStyle !== undefined ? prevStyle.nextSibling : null;

    style.setAttribute(SC_ATTR, SC_ATTR_ACTIVE);
    style.setAttribute(SC_ATTR_VERSION, SC_VERSION);

    parent.insertBefore(style, nextSibling);

    return style;
  };
  ```

  果然不出我们所料, makeStyleTag方法首先创建了一个style元素,然后设置了```  SC_ATTR ``` 和 ``` SC_ATTR_VERSION ``` 属性, 这刚刚好与head中的style标签对应。因此整个基础流程到这也告一段落了。至于sc的其他API也可以参照这种方法阅读源码。

  感谢阅读!




