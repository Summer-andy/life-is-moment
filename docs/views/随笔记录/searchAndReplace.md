---
title: 替换DOM中的文本, 恐怕没你想的那么简单
date: 2020-07-23
tags:
 - 随笔记录
categories:
 - 前端基础
---

## 话题
  
   假设我们现在有这么一段HTML

   ```html
  <div id="container">
    <p> i am andy </p>
  </div>
   ```
   
   我们想把andy替换成summer。

   可能大多数人一开始想到的办法是直接用正则替换HTML:

   ```js
const element = document.getElementById('container');
element.innerHTML = element.innerHTML.replace(/\bandy\w*\b/gi,'summer');
   ```

  咋一眼看, 貌似没有什么问题, 界面中的andy确实变成了summer。我们继续修改一下代码

  ```html
  	<div id="container">
			<p id="content">i am andy</p>
			<button id="btn">替换文本</button>
		</div>
  ```

  ```js
  document.getElementById('content').addEventListener('click', () => {
    console.log('i am andy');
  });

  document.getElementById('btn').addEventListener('click', () => {
    const element = document.getElementById('container');
    element.innerHTML = element.innerHTML.replace(/\bandy\w*\b/gi,'summer');
  })
  ```

 ::: tip
  思考: 当我们点击替换文本按钮之前, 去点击文本和当我们点击按钮之后去点击文本会有什么区别呢?
 ::: 

 ## 了解一下HTML DOM节点

 ### HTML DOM 节点
    
  在HTML DOM(文档对象模型)中, 每个部分都是节点:
  -  文档本身是文档节点
  -  所有的HTML元素是元素节点
  -  所有的HTML属性是属性节点
  -  HTML元素内的文本是文本节点
  -  注释是注释节点

  在我们编写代码的时候, 我们通常都把事件作用于HTML元素上。注意是HTML元素, 我为什么特别强调这一点呢。其实答案显而易见, 我们回到上面的思考题,
  当我们使用一段新的HTML去替换老的HTML的时候, 之前绑定在p上的事件, 自然而然的就丢失了。这就好比, 你之前一直暗恋着你的同桌,突然有一天,你同桌
  换了一个其他的妹子, 你还能暗恋你同桌么？怎么着也得重新和新同桌发生点啥的才行, 对吧？

  言归正传, 既然事件是作用于HTML元素上也就是元素节点上, 那么如果我替换的是元素节点中的文本节点, 这个绑定关系是不是还能继续维持呢?

  我们尝试修改一下上面例子中js部分:

  ```js
  document.getElementById('btn').addEventListener('click', () => {
    const element = document.getElementById('content');
    element.innerText = element.innerText.replace(/\bandy\w*\b/gi,'summer')
  })
  ```

  我们不出意外的验证了这个想法。 当我们完成文本替换后, 点击p标签依然能够触发它自己的点击事件。事情还远远没有结束, 请允许我向各位读者抛出几个问题。


  ## Questions

   - Q1: 假如DOM是动态的, p标签里面的span标签是动态生成的并且还附加了事件绑定, 同时span可能在``` i am andy ``` 之前, 也可能在它之后, 此时如何替换```andy``` ?

   ```html
  	<div id="container">
			<p id="content"><span>我是动态生成的并且是有事件绑定的</span>i am andy</p>
			<button id="btn">替换文本</button>
		</div>
   ``` 

  - Q2: 假如一个单词跨节点了, 我们该如何处理？难道还是使用innerText直接全部替换吗？这显然是不正确的, 因为当你完成替换后, 之前的span标签都丢失了。

    ```html
	  <div id="container">
			<p id="content">i am  an<span>dy</span></p>
			<button id="btn">替换文本</button>
		</div>
    ```

  - Q3: 最关键的一个问题, 你如何保证替换节点的准确性, 通俗的来讲, 就是你如何保证匹配的节点在正确的位置分割，并替换。

   我为什么会跟大家讨论这个话题呢？在前段时间, 我需要对已有产品中的功能模块做截图, 但是我需要对模块中的名称做替换, 从事前端的同学, 可能会想着直接浏览器
   f12修改就完事儿了。可是对于一些像我这样的手残党, 会一不小心按下刷新键。假设模块中的100处```andy```都要改成```summer```,那不得累死。因此我决定周末抽时间开发
   一款文本替换的谷歌插件。在谷歌商店的的确确有这样的插件, 有兴趣的同学可以去商店下载, 你会发现,比如下载量和使用量最高的 ``` search and replace ``` 是有问题的,
   当替换完文本后, 作用于页面上的事件绑定都失效了。 那么我们应该如何解决呢？
   
   ::: warning
   如果你有这个需求, 没有时间了解原理的话, 可以直接使用现成的插件。[https://github.com/Summer-andy/chrome-extensions-searchReplace](https://github.com/Summer-andy/chrome-extensions-searchReplace)。
   ::: 

## 设计思路

  正确的思路应该是在文本节点上做文章。文本节点和元素节点的处理方式是一样的, 但是它们俩的关键区别在于:

  - 文本节点不会有子节点
  - 文本节点的所有信息都在data(或者nodeValue)属性里
  - 文本节点中不会有任何样式, 不会有任何事件,单单只有文本

  ### 1.解析DOM

  ```html
    <p>
        <a href="https://github.com/Summer-andy/chrome-extensions-searchReplace">summer</a>
        i am andy
    </p>
  ```

  将上面这段代码转化为我们想要的DOM结构(提取出TEXT NODE)

  ```text
     -> P ELEMENT
        -> TEXT NODE (data: "\n   ")
        -> A ELEMENT (href: "https://github.com/Summer-andy/chrome-extensions-searchReplace")
            -> TEXT NODE (data: "summer" )
        -> TEXT NODE (data: "\n i am andy \n")   
  ```

  ### 2.遍历文本节点,标记出匹配文本节点

  ```js
      {
        node: #text // 找出文本节点
        text: 'andy'
      }
  ```

### 3.根据文本节点获取父元素, 并且追加一个新的元素

```js
 const precedingTextNode = 'summer'; // 这个precedingTextNode可以是元素节点也可以是文本节点
 node.parentNode.insertBefore(precedingTextNode, node); // 在文本节点之前插入新的元素(node表示匹配的文本节点)
```

### 4.删除匹配文本节点

```js
  node.parentNode.removeChild(node);
```

::: warning
接下来的例子都将使用这段html来演示: 
:::

``` html
<div id="container">
<div>Th<a>is</a>text
<button>123</button>
<h4>is This</h4>
</div>
</div>
```

## 解析DOM

 ### 思考如何归并文本节点

  ::: warning
  目前我们只考虑两种文本节点情况
  :::  

  1. 非跨节点文本

  诸如:

  ```html
    <p> summer </p>
  ```

  ```html
    <h4>summer</h4>
  ```

  2. 非块级元素跨文本节点

  诸如: 

  ```html
    <p>
      <span>sum</span><a>mer</a>
    </p>
  ```

  ```html
    <p>
      sum<a>mer</a>
    </p>
  ```

  因此我们将以上两种情况的文本节点统一合并成一个文本处理。如果遇到块级元素, 则重新生成一个新的文本节点。

 ### 编写一个判断是否是块级元素的函数

  - 定义块级元素集合

```js
const block =  {
  address:1, article:1, aside:1, blockquote:1, dd:1, div:1,
  dl:1, fieldset:1, figcaption:1, figure:1, footer:1, form:1, h1:1, h2:1, h3:1,
  h4:1, h5:1, h6:1, header:1, hgroup:1, hr:1, main:1, nav:1, noscript:1, ol:1,
  output:1, p:1, pre:1, section:1, ul:1,
  br:1, li: 1, summary: 1, dt:1, details:1, rp:1, rt:1, rtc:1,
  script:1, style:1, img:1, video:1, audio:1, canvas:1, svg:1, map:1, object:1,
  input:1, textarea:1, select:1, option:1, optgroup:1, button:1,
  table:1, tbody:1, thead:1, th:1, tr:1, td:1, caption:1, col:1, tfoot:1, colgroup:1
};
```

 - 判断节点的NodeName是否存在于block中

 ```js
  function forceContext(el) {
      return {}.hasOwnProperty.call(block, el.nodeName.toLowerCase());
  };
 ```
   
 ###  遍历获得文本节点数组

 ```js
 function getAggregateText() {

	const nodeTest = document.getElementById('container'); // 模拟替换节点的容器

	return getText(nodeTest);

	function getText(node) { 

    if (node.nodeType === Node.TEXT_NODE) {
      return [node.data];
    }

    var txt = [''];
    var i = 0;

    if (node = node.firstChild) do {
      
      if (node.nodeType === Node.TEXT_NODE) {
        txt[i] += node.data;
        continue;
      }

      var innerText = getText(node);

      if ( node.nodeType === Node.ELEMENT_NODE && (forceContext === true || forceContext(node)) ) 
      {
        txt[++i] = innerText;
        txt[++i] = '';

      } else {

        if (typeof innerText[0] === 'string') {
          txt[i] += innerText.shift();
        }

        if (innerText.length) {
          txt[++i] = innerText;
          txt[++i] = '';
        }

      }
    } while (node = node.nextSibling);

    return txt;
  }
}

```  

 ok, 第一阶段已经完成, 我们来看一下运行后的成果。emmm, 很棒, 文本节点已经全部分离出来了。接下来我们需要对这些数据进行正则匹配。

 ```js
  [
     "↵",
      [
        "Thistext↵	",
        ["123"],
        "↵	",
        ["is This"],
        "↵	"
      ]
     "↵"
  ]
 ```

 ## 遍历文本节点,标记出匹配文本节点

### 定义正则表达式

   比如我们匹配节点中this.
  
  ```js
  var regex = RegExp("this", 'gi');
  ```

### 记录匹配节点在文本中的位置

  ```js

  var matches = []; // 保存匹配结果
  var match;  // 临时匹配结果变量
  var offset = 0; // 记录文本偏移量
  var matchIndex = 0; // 匹配索引
  var regex = RegExp("this", 'gi');

function matchAggregation(textAggregation) {
	for (var i = 0, l = textAggregation.length; i < l; ++i) {
		var text = textAggregation[i];
		if (typeof text !== 'string') {
			matchAggregation(text);
			continue;
		}
		if (regex.global) {
			while (match = regex.exec(text)) {
				matches.push(prepMatch(match, matchIndex++, offset));
			}
		} else {
			if (match = text.match(regex)) {
				matches.push(prepMatch(match, 0, offset));
			}
		}
		offset += text.length;
	}
}


function prepMatch(match, matchIndex, characterOffset) {
    if (!match[0]) {
      throw new Error('findAndReplaceDOMText cannot handle zero-length matches');
    }
    match.endIndex = characterOffset + match.index + match[0].length;
    match.startIndex = characterOffset + match.index;
    match.index = matchIndex;
    return match;
}
  ```

  经过一轮过滤之后, 我们应该能够得到两组数据。数组中的```startIndex```和 ``` endIndex ``` 代表着匹配值在文本中的起始位置
  和结束位置。``` index ``` 表示第几项。

```js
[
  [ 0: "This" , endIndex: 6, index: 0, input: "Thistext↵	", startIndex: 2 ],
  [ 0: "This", endIndex: 24, index: 1, input: "is This", startIndex: 20 ]
]

```

### 遍历容器下的节点树, 记录 每次匹配的 startPortion 和 endPortion
  
   可能有的人会有疑问, 为什么要弄两个对象来存储匹配结果。

   当我们匹配 ``` <p> summer </p> ``` 中 summer文本节点的时候 startPortion 和 endPortion 的节点都是指向
   ``` summer ```文本节点。但是遇到 ``` <p>summ<a>er</a></p> ``` 这种情况的时候, startPortion 和 endPortion指向的节点就不一样了。因此我们可以根据
   它们的指向来做不同的处理。

   在遍历之前, 我们了解一下关于nodeType的小知识: 

  :::tip
   每个节点都有一个 nodeType 属性，用于表明节点的类型，节点类型由 Node 类型中定义12个常量表示
  :::

   | 常量名 | 常量值 | 节点类型 | 描述 |
   | :-----| ----: | :----: | :----: | 
   | Node.ELEMENT_NODE | 1 | Element | 代表元素 |
   | Node.ATTRIBUTE_NODE | 2 | Attr | 代表属性 | 
   | Node.TEXT_NODE | 3 | Text | 代表元素或属性中的文本内容 |
   | Node.COMMENT_NODE | 8 | Comment | 代表注释 | 
   | Node.DOCUMENT_NODE | 9 | Document | 代表整个文档（DOM 树的根节点 | 
   | ... | ... | ... |  ... |

   我们就根据nodeType对整颗DOM树进行遍历, 由于篇幅原因详细代码就不贴出来了, 有兴趣的可以上我的[https://github.com/Summer-andy/chrome-extensions-searchReplace](https://github.com/Summer-andy/chrome-extensions-searchReplace)上查看。

   ```js
    if(curNode.nodeType === Node.TEXT_NODE) {
        // 生成startPortion 和  endPortion
        // ...
      endPortion = {
          node: curNode,
          index: portionIndex++,
          text: curNode.data.substring(match.startIndex - atIndex, match.endIndex - atIndex),
          indexInMatch: atIndex === 0 ? 0 : atIndex - match.startIndex,
          indexInNode: match.startIndex - atIndex,
          endIndexInNode: match.endIndex - atIndex,
          isEnd: true
      };
        // ...
        startPortion = {
          node: curNode,
          index: portionIndex++,
          indexInMatch: 0,
          indexInNode: match.startIndex - atIndex,
          endIndexInNode: match.endIndex - atIndex,
          text: curNode.data.substring(match.startIndex - atIndex, match.endIndex - atIndex)
        };
    }
   ```

   如果说 ``` endPortion.node === startPortion.node ```, 那么可以结合之前match的匹配值, 获取到node节点。此时我们可以把替换部分
   暴露出去, 供开发者可以自定义替换效果。类似于:

  ```js
    replace: function(portion, match) {
        called = true;
        var el = document.createElement('em');
        el.innerHTML = portion.text;
        return el;
    },
  ```

   el就是我们新生成的节点。那我们此时我们应该怎么塞到DOM树上呢？


 ## 根据文本节点获取父元素, 并且追加一个新的元素  

   我们将自定义替换部分抽成一个函数getPortionReplacementNode.此时我们可以获取到替换后的新节点。
   比如我们将```summ``` 改成 ``` <em>###</em> ```

   ```js
		var newNode = this.getPortionReplacementNode(
        endPortion,
        match
      );
   ```

  获取到新节点后, 在之前DOM树上的匹配节点的前面插入新的节点, 比如我们插入的节点是 ``` <em>###</em>  ```

  ```js
	node.parentNode.insertBefore(newNode, node);
  ```

  那么此时现在的DOM树应该是

  ```html
    <p>summer</p>
  ```

  -> 

  ```html
    <p><em>###</em>summer</p>
  ```

  ## 删除匹配文本节点

  ```js
    node.parentNode.removeChild(node);
  ```

  那么到了这一步, 我们的替换工作也完成了。

  ```html
    <p><em>###</em>er</p>
  ```

## 个人总结

  其实我一开始也打算直接replace就完事儿了, 不管DOM事件绑定什么的。可是, 我觉得开源是一件伟大又很严肃的事情, 我们开源某个软件, 一定是为了解决
  生活、学习中的某个问题, 当我看到评论上说 ``` Search and Replace ``` 替换文本后无法点击按钮,超链接之类的话后。 我又开始重新审视这件事情, 我认为要是我能解决这个
  问题, 这肯定是一件有意义的事情。其实一开始我走了很多弯路, 可能是因为自己水平不够,没有想到在文本节点上能做这么大的文章。


## 参考文献

 - [replacing-text-in-the-dom-its-not-that-simple](http://james.padolsey.com/javascript/replacing-text-in-the-dom-its-not-that-simple)
 - [replacing-text-in-the-dom-solved](https://j11y.io/javascript/replacing-text-in-the-dom-solved)
 - [findAndReplaceDOMText](https://github.com/padolsey/findAndReplaceDOMText)
 - [HTML DOM nodeType](https://www.w3school.com.cn/jsref/prop_node_nodetype.asp)