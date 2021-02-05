---
title: Canvas在超级玛丽中的应用
date: 2021-02-05
tags:
  - js基础
categories:
  - 前端基础
---

## 前言

   在上一篇文章中, 我们基于DOM体系构建了超级玛丽, 那么在本篇文章中我们使用canvas对整个架构进行升级, 从而提升游戏的视觉体验。

   > 考虑到有些同学对canvas不是很熟悉。本文将会对canvas的一些基础做一些大致的讲解。

## canvas基础知识

### 画布元素   

   canvas标签可以让我们能够使用JavaScript在网页上绘制各种样式的图形。要访问实际的绘图接口, 首先我们需要创建一个上下文(context), 它是一个对象, 提供了绘图的接口。目前有两种广受绘图的样式: 用于二维图形的”2d“以及通过``` OpenGL ```接口的三维图形的``` webgl ```。

   比如, 我们可以使用 ``` <canvas /> ``` DOM元素上的 ``` getContext ```方法创建上下文。

   ```html
    <body>
      <canvas width="500" height="500" />
    </body>
    <script>
      let canvas = document.querySelector('canvas');
      let context = canvas.getContext('2d');
      context.fillStyle = "yellow";
      context.fillRect(10, 10, 400, 400);
    </script>
   ```

   ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a2f5f07ec624869aeab379beb6d94c5~tplv-k3u1fbpfcp-watermark.image)

   我们绘制了一个宽度和高度都为400像素的黄色正方形, 并且其左上角顶点处的坐标为(10, 10)。canvas的坐标系(0, 0)在其左上角.


### 边框的绘制

在画布的接口中, ``` fillRect ``` 方法用于填充矩形。 ``` fillStyle ``` 用于控制填充形状的方法。比如

- 单色

```js
context.fillStyle = "yellow";
```
- 渐变色

```js
let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');
let grd = context.createLinearGradient(0,0,170,0);
grd.addColorStop(0,"black");
grd.addColorStop(1,"red");
context.fillStyle = grd;
context.fillRect(10, 10, 400, 400);
```

- pattern图案对象

```js
let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');
let img = document.createElement('img');
img.src = "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3112798566,2640650199&fm=26&gp=0.jpg";
img.onload = () => {
  let pattern = context.createPattern(img, 'no-repeat');
  context.fillStyle = pattern;
  context.fillRect(10,10,400,400)
}
```

strokeStyle属性与fillStyle属性类似, 但是 ``` strokeStyle``` 作用与描边线的颜色。线条的宽度由 ``` lineWidth ```属性决定。

比如我想绘制一个边框宽度为6的黄色正方形。

```js
let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');
context.strokeStyle = "yellow";
context.lineWidth = 6;
context.strokeRect(10,10, 400, 400);
```
 
### 路径

  路径是很多线条的组合。如果想要绘制各种各样的形状,我们会频繁用到 ``` moveTo ``` 和  ``` lineTo ``` 两个函数。


  ```js
    let canvas = document.querySelector('canvas');
    let context = canvas.getContext('2d');
    context.beginPath();
    for (let index = 0; index < 400; index+=10) {
      context.moveTo(10, index);
      context.moveTo(index, 0);
      context.lineTo(390, index);
    }
    context.stroke();
  ```
  
  ``` moveTo ``` 表示我们当前画笔起点的位置,  ``` lineTo ``` 表示我们画笔从起点到终点的连线。以上代码执行后就是如下所示: 

  ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f55cef23fb847c2a8b00f07c51a4da1~tplv-k3u1fbpfcp-watermark.image)

  当然我们可以为线条绘制的图形进行填充。

  ```js
    let canvas = document.querySelector('canvas');
    let context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(50, 10);
    context.lineTo(10, 70);
    context.lineTo(90, 70);
    context.fill();
    context.closePath();
  ```

### 绘制图片

  在计算机图形学中, 通常需要对矢量图形和位图图形进行区分。 矢量图形是指: 通过给出形状的逻辑来描述指定的图片。而位图图形是指使用像素数据, 而不指定实际形状。

  canvas中的  ``` drawImage ``` 方法允许我们将像素数据绘制到画布上。像素的数据可以来自于<img />元素或者另外一个画布。

  drawImage支持传递9个参数, 第2到5个参数表明源图像中被复制的(x, y, 高度, 宽度), 第6到9个参数给出被复制的图像在canvas画布上的位置以及宽高。

  下图是玛丽多个姿势的汇总图, 我们使用 ``` drawImage ``` 先让他能够正常跑起来。

  ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/041c26a445834f68a7bbc8bb875862cd~tplv-k3u1fbpfcp-watermark.image)

  ```js
  let canvas = document.querySelector('canvas');
  let ctx = canvas.getContext('2d');
  let img = document.createElement('img');
  img.src = './player_big.png'
  let spriteW = 47, spriteH = 58;
  img.onload = () => {
    let cycle = 0;
    setInterval(() => {
      ctx.clearRect(0, 0, spriteW, spriteH);
      ctx.drawImage(img,
       cycle*spriteW, 0, spriteW, spriteH,
       0, 0, spriteW, spriteH,
      );
      cycle = (cycle + 1) % 10;
    }, 120);
  }
  ```

  ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65229fecbf794453a5235451fc7a7b10~tplv-k3u1fbpfcp-watermark.image)

  我们需要大致截取玛丽的大小, 通过 ``` cycle ``` 锁定玛丽在动画中的位置。在合成中, 我们只需要让前面8个动作循环播放即可实现玛丽的一个奔跑动作了。


### 控制转换

  现在我们已经可以让玛丽朝着右边跑了, 但是在实际的游戏中 玛丽是可以左右跑的。这里的话 有两个方案: 1. 我们再绘制一组朝着左边跑的组合图 2.控制画布反过来绘制图片。第一种方案比较简单, 因此我们就选择第二种比较复杂一点的方案。

  canvas中可以调用scale方法按照比例尺调整然后绘制。此方法有两个参数, 第一个参数用于设置水平方向比例尺, 另外一个设置垂直方向的比例尺。

  ```js
  let canvas = document.querySelector('canvas');
  let ctx = canvas.getContext('2d');
  ctx.scale(3, .5);
  ctx.beginPath();
  ctx.arc(50, 50, 40, 0, 7);
  ctx.lineWidth = 3;
  ctx.stroke();
  ```

  上面是对 ``` scale ``` 的简单应用。我们调用了 ``` scale ``` 使得圆的水平方向被拉伸了3倍, 垂直方向被缩小了0.5倍。

  如果scale中的参数为负数-1时, 在x位置为100的位置绘制的形状最终会被绘制到-100的位置。因此为了转化图片, 我们不能仅仅在drawImage的之前调用 ```ctx.scale(-1, 1) ```, 因为在当前画布中是看不到转化后的图片的。这里有两种方案: 1. 调用 drawImage 的时候设置x为-50的时候来绘制图形 2.通过调整坐标轴, 这种做法的好处在于我们编写的绘图不需要关心比例尺的变化。

  我们采用 ``` rotate ``` 来渲染绘制的图形, 并且通过``` translate ```方法移动他们。

  ```js
    function flip(context, around) {
      context.translate(around, 0);
      context.scale(-1, 1);
      context.translate(-around, 0);
    }
  ```

  我们的思路大概是这样子: 
  
  ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5738ea30639b439a94350306554c01c9~tplv-k3u1fbpfcp-watermark.image)

  如果我们在正x处绘制三角形, 默认情况下它会位于1位置。调用flip函数后首先进行右边平移, 得到三角形2. 然后通过调用 ``` scale ``` 进行翻转得到三角形3。最后再次通过调用 ``` translate ``` 方法, 对三角形3进行平移得到三角形4, 也就是最后我们想要的图案。

  ```js
    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext('2d');
    let img = document.createElement('img');
    img.src = './player_big.png'
    let spriteW = 47, spriteH = 58;
    img.onload = () => {
        ctx.clearRect(100, 0, spriteW, spriteH);
        flip(ctx, 100 + spriteW / 2);
        ctx.drawImage(img,
        0, 0, spriteW, spriteH,
        100, 0, spriteW, spriteH,
        );
    }
  ```
  
  看, 他已经被我们转过来了！
  
  ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7357722f6134614919cdf37f0d8d9b1~tplv-k3u1fbpfcp-watermark.image)

  ## 升级超级玛丽游戏

  在上一篇文章中, 我们所有的元素都是直接通过DOM来显示的, 那么在我们学完canvas之后, 我们可以使用drawImage来绘制元素。

  我们定义CanvasDisplay替换掉之前的DOMDisplay, 除此之外, 我们新增了跟踪自己视图窗口, 他可以告诉我们当前正在那部分的关卡, 此外我还新增了 ``` flipPlayer ``` 属性, 这样即使玛丽不动, 它仍然面对着它最后移动的方向。

  ```js
  var CanvasDisplay = class CanvasDisplay {
    constructor(parent, level) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = Math.min(600, level.width * scale);
      this.canvas.height = Math.min(450, level.height * scale);
      parent.appendChild(this.canvas);
      this.cx = this.canvas.getContext("2d");

      this.flipPlayer = false;

      this.viewport = {
        left: 0,
        top: 0,
        width: this.canvas.width / scale,
        height: this.canvas.height / scale
      };
    }

    clear() {
      this.canvas.remove();
    }
  }
  ```

  syncState方法首先计算新视图窗口, 然后在适当的位置绘制。
  
  ```js
  CanvasDisplay.prototype.syncState = function(state) {
    this.updateViewport(state);
    this.clearDisplay(state.status);
    this.drawBackground(state.level);
    this.drawActors(state.actors);
  };
  ```

  ```js
  DOMDisplay.prototype.syncState = function(state) {
    if (this.actorLayer) this.actorLayer.remove();
    this.actorLayer = drawActors(state.actors);
    this.dom.appendChild(this.actorLayer);
    this.dom.className = `game ${state.status}`;
    this.scrollPlayerIntoView(state);
  };
  ```

  在之前的更新相反, 我们现在必须在每次更新的时候, 重新绘制背景。因为画布上的形状只是像素, 所以我们在绘制完后没有好的方法来移动或者删除他们。因此更新画布的唯一方法是清除并且重绘。

  ``` updateViewport ```方法跟 ``` scrollPlayerIntoView ``` 方法一样。它会检查玩家是否太靠近视图边缘。

  ```js
  CanvasDisplay.prototype.updateViewport = function(state) {
    let view = this.viewport, margin = view.width / 3;
    let player = state.player;
    let center = player.pos.plus(player.size.times(0.5));

    if (center.x < view.left + margin) {
      view.left = Math.max(center.x - margin, 0);
    } else if (center.x > view.left + view.width - margin) {
      view.left = Math.min(center.x + margin - view.width,
                          state.level.width - view.width);
    }
    if (center.y < view.top + margin) {
      view.top = Math.max(center.y - margin, 0);
    } else if (center.y > view.top + view.height - margin) {
      view.top = Math.min(center.y + margin - view.height,
                          state.level.height - view.height);
    }
  };
  ```

  当我们成功或者失败的时候, 我们需要清除当前场景, 因为如果失败了, 我们需要重新来, 如果成功了, 我们需要删除当前场景, 重新绘制一个新的场景。

  ```js
  CanvasDisplay.prototype.clearDisplay = function(status) {
    if (status == "won") {
      this.cx.fillStyle = "rgb(68, 191, 255)";
    } else if (status == "lost") {
      this.cx.fillStyle = "rgb(44, 136, 214)";
    } else {
      this.cx.fillStyle = "rgb(52, 166, 251)";
    }
    this.cx.fillRect(0, 0,
                    this.canvas.width, this.canvas.height);
  };
  ```

  接下来, 我们需要绘制墙壁和熔岩。首先, 我们遍历当前视图中所有的墙壁和砖头。我们使用 ``` sprites.png ``` 绘制所有非空的墙砖(墙、熔岩、金币)。在提供的素材中, 我们墙壁是20px * 20px, 偏移量是0，熔岩也是 20px * 20px, 但是偏移量是20px.
  
  ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2c97bfd5ce147939214cb63e81f89ec~tplv-k3u1fbpfcp-watermark.image)

  ```js
  let otherSprites = document.createElement("img");
  otherSprites.src = "img/sprites.png";

  CanvasDisplay.prototype.drawBackground = function(level) {
    let {left, top, width, height} = this.viewport;
    let xStart = Math.floor(left);
    let xEnd = Math.ceil(left + width);
    let yStart = Math.floor(top);
    let yEnd = Math.ceil(top + height);

    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        let tile = level.rows[y][x];
        if (tile == "empty") continue;
        let screenX = (x - left) * scale;
        let screenY = (y - top) * scale;
        let tileX = tile == "lava" ? scale : 0;
        this.cx.drawImage(otherSprites,
                          tileX,         0, scale, scale,
                          screenX, screenY, scale, scale);
      }
    }
  };
  ```

  最后我们需要绘制玩家的模型。

  在前面的8个图像中, 是一个完整的运动过程。第九个画像是玩家静止不动的状态, 第10个画像是玩家在离地时候的状态。因此当玩家移动的时候, 我们需要每60ms切换一帧。当玩家不动的时候绘制第九个画面, 当玩家跳跃的时候绘制第十个画面。
  
  ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/739e99c43f2d4129a91e3dc0177d80b8~tplv-k3u1fbpfcp-watermark.image)

  ```js
    CanvasDisplay.prototype.drawPlayer = function(player, x, y,
                                                width, height){
    width += playerXOverlap * 2;
    x -= playerXOverlap;
    if (player.speed.x != 0) {
      this.flipPlayer = player.speed.x < 0;
    }

    let tile = 8;
    if (player.speed.y != 0) {
      tile = 9;
    } else if (player.speed.x != 0) {
      tile = Math.floor(Date.now() / 60) % 8;
    }

    this.cx.save();
    if (this.flipPlayer) {
      flipHorizontally(this.cx, x + width / 2);
    }
    let tileX = tile * width;
    this.cx.drawImage(playerSprites, tileX, 0, width, height,
                                    x,     y, width, height);
    this.cx.restore();
  };
  ```

  对于不是玩家的模型, 我们根据对应模型的偏移量找到对应的图像。

  ```js
    CanvasDisplay.prototype.drawActors = function(actors) {
    for (let actor of actors) {
      let width = actor.size.x * scale;
      let height = actor.size.y * scale;
      let x = (actor.pos.x - this.viewport.left) * scale;
      let y = (actor.pos.y - this.viewport.top) * scale;
      if (actor.type === "player") {
        this.drawPlayer(actor, x, y, width, height);
      } else {
        let tileX = (actor.type === "coin" ? 2 : 1) * scale;
        this.cx.drawImage(otherSprites,
                          tileX, 0, width, height,
                          x,     y, width, height);
      }
     }
   };
  ```
  
## 最后

  ok! 至此, 我们的超级玛丽就改造完成, 后面会陆续加上一些其他的地图元素 ~ 有兴趣的小伙伴可以关注一下哦 ~ 
  
  ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10314ce408104b0380f340b713f8c4b0~tplv-k3u1fbpfcp-watermark.image)