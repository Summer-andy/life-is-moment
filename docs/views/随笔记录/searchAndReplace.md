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

  ### 2.遍历DOM,标记出匹配文本节点

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

## 解析DOM

 ### 