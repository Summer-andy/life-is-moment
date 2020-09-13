---
title: 口琴的简单推导
date: 2020-09-09
tags:
 - 随笔记录
categories:
 - 前端基础
---


## 序

   “池塘边的榕树上, 知了在声声的叫着夏天”

   口琴, 是一种小型的吹奏乐器, 用嘴吹或吸气, 使金属簧片振动发声的多簧片乐器; 在1812年的一天, 德国有一位名叫布希曼的音乐家,
   在托斯恩散步, 偶然发现一个小女孩在门口玩耍, 一双肥嘟嘟的小手拿着一把贴着硬纸的木梳吹着。布希曼心里一亮，回去后，根据中国古代笙和罗马笛的发音和吹奏原理，用象牙雕刻成“药丸筒”似的口琴，这就是世界上最早的口琴。

   对于初学口琴的人来说, 最难的应该是气息与音准的把握了。气息可以通过不断地打节拍慢慢控制, 然而想要把音吹的准那么就需要对口琴每一个孔位置对应的音阶以及当前琴孔是吹是吸都了如指掌。人类在文字诞生前之前的上百万年里, 只有图像记忆能力。文字的历史只有几千年，跟漫长的人类历史比起来，微不足道。换句话说, 图像记忆是生物本能, 人生来就具备。好像扯得有点远了, 那么本文的主要内容是: 我是如何拆解音谱上的每一个音阶形成代码, 并且最后将每个音阶都```可视化```出来。


## 音符

   乐曲上每一个音的时值是用音符来表明的。音符一般分为单音符、附点音符、复附点音符和休止符等几种。

  - 单音符

     单音符分为全音符、二分音符、四分音符、八分音符、十六分音符、三十二分音符等。

     ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f83ab119f539475a8fa8b7cfe731c371~tplv-k3u1fbpfcp-zoom-1.image)

     如果把全音符假定为四拍, 那么一个二分音符就是两拍, 一个四分音符就是一拍, 八分音符是半拍, 十六分音符是四分之一拍。

    ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ad37e4d21c5495f8d08bf1ed94ab43e~tplv-k3u1fbpfcp-zoom-1.image)

  - 附点音符

      附点音符是在单音符的右边加一个小 “.”。这个小点的时值, 是```单音符```时值的一半。比如
      ``` 5 -``` 是一个二分音符并且是两拍, 那么如果加上一个附点, 如``` 5 - . ```，它的时值就变成了三拍。``` 3 = 2 + 2 / 2 ```。

  - 复附点音符  

      复附点音符是在附点音符的右边再加一点, 这一点就叫做复附点。复附点的时值, 等于附点音符的附点的一半。比如在四分音符的右边加上复附点。如 ``` 5 . . ```，它的时值就有一拍又四分之三。

  - 休止符

    休止符是停止不奏或不唱的一种符号。简谱上的休止符是用“0”来表示的。休止符也和单音符一样,有全休止符, 二分休止符、四分休止符、八分休止符、十六分休止符和三十二分休止符等。

    ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b4c4f713ffa4cf09c553dbdddb20d6a~tplv-k3u1fbpfcp-zoom-1.image)

  ## 节拍

  每一首曲子都由若干条纵线分成若干小节, 两条纵线的中间我们称之为小节。乐曲划分小节之后，就确定了一定的节奏强弱。而确定这种节奏强弱的，就叫做拍子，或称节拍。通常在简谱的左上角我们可以看到用
  分数的形式标明拍子的记号。当然在谱子中间部分换拍的时候, 我们也同样能看到拍子的记号, 如 ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70a48d9c110748a1bed7ae7cb2e3a248~tplv-k3u1fbpfcp-zoom-1.image)。记号中上面部分的数字是指每小节内有几拍, 下面的数字是指以多少音符为一拍。
  比如: ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18f8d0ec7c54459ab2a1a735a75e39c6~tplv-k3u1fbpfcp-zoom-1.image) 这是一段以四分音符为一拍, 每一小节内有两拍。根据上述的乐理知识, ```3``` 指的是四分音符, 后面的`32`分别由两个八分音符组成, 因此合成一块就是两个四分音符。一般乐曲所常用的拍子有二拍子，三拍子，四拍子，六拍子以及九拍子和十二拍子等。如下图:
 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/339c459abf81462e96842ee07cdcc162~tplv-k3u1fbpfcp-zoom-1.image)

  正常的二拍子，它的第一拍为强拍第二拍为弱拍;三拍子第一拍是强拍，第二，第三两拍是弱拍;四拍子的第一拍是强拍，第三拍是中强拍，第二，第四拍两拍都是弱拍。
  
  ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aeb2fe1df61e45ffb1eef2a1e86fda37~tplv-k3u1fbpfcp-zoom-1.image)
      
  注：▲表示强拍，△表示弱拍，×表示中强


  ## 构建口琴组件

  > 注意: 本文使用的是24孔的复音口琴

  复音口琴的音阶是由长短不同的簧片按照规律排列组成的。从左到右，音依次增高。

  ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebb591e2ce2a4eb9be8acbaceb8d428e~tplv-k3u1fbpfcp-zoom-1.image)

  一共24孔，分为低音，中音，高音三大部分.我们仔细观察, 发现它的duo rai mi fa suo la xi并不是连续的,
  这会对我们后面和音的定义会稍稍有点不一样, 我在此就不赘述了, 后续谈到和音部分, 我们再详聊。

  ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e05705d02f746d69e9b6909567a5d7b~tplv-k3u1fbpfcp-zoom-1.image)

  上图是通过svg构建出来的复音口琴简谱。每个琴孔下面都标记吹吸记号以及中高低音符。初次之外, 我们还定义了
  ``` blow ``` 和 ``` absorb ```两个可复用的元素,用于辅助后续口琴的演奏。
  
  ```js
  import React from 'react';
  const Svg = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="svg" width="1000" height="420" viewBox="0 0 300 300" preserveAspectRatio="xMidYMin meet">
        <defs>
          <g id="blow">
            <rect width="20" height="40"  fill="#bce672"  stroke="#d6ecf0" strokeWidth="1" />
          </g>
          <g id="absorb">
            <rect width="20" height="40" fill="#ff461f"  stroke="#d6ecf0" strokeWidth="1" />
          </g>
        </defs>
        <rect x="25" y="45" rx="5" ry="5" width="480" height="40"  fill="yellow" stroke="#666" strokeWidth="2" />
        <path d="
        M25 65 L505 65  
        M25 85 L505 85  
        M45 45 L45 85 
        M65 45 L65 85 
        M85 45 L85 85 
        M105 45 L105 85 
        M125 45 L125 85 
        M145 45 L145 85 
        M165 45 L165 85 
        M185 45 L185 85 
        M205 45 L205 85 
        M225 45 L225 85 
        M245 45 L245 85 
        M265 45 L265 85 
        M285 45 L285 85 
        M305 45 L305 85 
        M325 45 L325 85 
        M345 45 L345 85 
        M365 45 L365 85 
        M385 45 L385 85 
        M405 45 L405 85 
        M425 45 L425 85 
        M445 45 L445 85 
        M465 45 L465 85 
        M485 45 L485 85 
        M505 45 L505 85 
        " stroke="#666" strokeWidth="2" fill="none" />
        <text x="30" y="100" fill="#333" fontSize="10" fontWeight="700">吹</text>
        <text x="30" y="120" fill="#333" fontSize="10" fontWeight="700">5</text>
        <text x="30" y="130" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="30" y="140" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="50" y="100" fill="#f00056" fontSize="10" fontWeight="700">吸</text>
        <text x="50" y="120" fill="#333" fontSize="10" fontWeight="700">2</text>
        <text x="50" y="130" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="70" y="100" fill="#333" fontSize="10" fontWeight="700">吹</text>
        <text x="70" y="120" fill="#333" fontSize="10" fontWeight="700">1</text>
        <text x="70" y="130" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="90" y="100" fill="#f00056" fontSize="10" fontWeight="700">吸</text>
        <text x="90" y="120" fill="#333" fontSize="10" fontWeight="700">4</text>
        <text x="90" y="130" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="110" y="100" fill="#333" fontSize="10" fontWeight="700">吹</text>
        <text x="110" y="120" fill="#333" fontSize="10" fontWeight="700">3</text>
        <text x="110" y="130" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="130" y="100" fill="#f00056" fontSize="10" fontWeight="700">吸</text>
        <text x="130" y="120" fill="#333" fontSize="10" fontWeight="700">6</text>
        <text x="130" y="130" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="150" y="100" fill="#333" fontSize="10" fontWeight="700">吹</text>
        <text x="150" y="120" fill="#333" fontSize="10" fontWeight="700">5</text>
        <text x="150" y="130" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="170" y="100" fill="#f00056" fontSize="10" fontWeight="700">吸</text>
        <text x="170" y="120" fill="#333" fontSize="10" fontWeight="700">7</text>
        <text x="170" y="130" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="190" y="100" fill="#333" fontSize="10" fontWeight="700">吹</text>
        <text x="190" y="120" fill="#333" fontSize="10" fontWeight="700">1</text>
        <text x="210" y="100" fill="#f00056" fontSize="10" fontWeight="700">吸</text>
        <text x="210" y="120" fill="#333" fontSize="10" fontWeight="700">2</text>
        <text x="230" y="100" fill="#333" fontSize="10" fontWeight="700">吹</text>
        <text x="230" y="120" fill="#333" fontSize="10" fontWeight="700">3</text>
        <text x="250" y="100" fill="#f00056" fontSize="10" fontWeight="700">吸</text>
        <text x="250" y="120" fill="#333" fontSize="10" fontWeight="700">4</text>
        <text x="270" y="100" fill="#333" fontSize="10" fontWeight="700">吹</text>
        <text x="270" y="120" fill="#333" fontSize="10" fontWeight="700">5</text>
        <text x="290" y="100" fill="#f00056" fontSize="10" fontWeight="700">吸</text>
        <text x="290" y="120" fill="#333" fontSize="10" fontWeight="700">6</text>
        <text x="310" y="100" fill="#333" fontSize="10" fontWeight="700">吹</text>
        <text x="310" y="115" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="310" y="130" fill="#333" fontSize="10" fontWeight="700">1</text>
        <text x="330" y="100" fill="#f00056" fontSize="10" fontWeight="700">吸</text>
        <text x="330" y="120" fill="#333" fontSize="10" fontWeight="700">7</text>
        <text x="350" y="100" fill="#333" fontSize="10" fontWeight="700">吹</text>
        <text x="350" y="115" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="350" y="130" fill="#333" fontSize="10" fontWeight="700">3</text>
        <text x="370" y="100" fill="#f00056" fontSize="10" fontWeight="700">吸</text>
        <text x="370" y="115" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="370" y="130" fill="#333" fontSize="10" fontWeight="700">2</text>
        <text x="390" y="100" fill="#333" fontSize="10" fontWeight="700">吹</text>
        <text x="390" y="115" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="390" y="130" fill="#333" fontSize="10" fontWeight="700">5</text>
        <text x="410" y="100" fill="#f00056" fontSize="10" fontWeight="700">吸</text>
        <text x="410" y="115" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="410" y="130" fill="#333" fontSize="10" fontWeight="700">4</text>
        <text x="430" y="100" fill="#333" fontSize="10" fontWeight="700">吹</text>
        <text x="430" y="115" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="430" y="125" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="430" y="140" fill="#333" fontSize="10" fontWeight="700">1</text>
        <text x="450" y="100" fill="#f00056" fontSize="10" fontWeight="700">吸</text>
        <text x="450" y="115" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="450" y="130" fill="#333" fontSize="10" fontWeight="700">6</text>
        <text x="470" y="100" fill="#333" fontSize="10" fontWeight="700">吹</text>
        <text x="470" y="115" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="470" y="125" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="470" y="140" fill="#333" fontSize="10" fontWeight="700">3</text>
        <text x="490" y="100" fill="#f00056" fontSize="10" fontWeight="700">吸</text>
        <text x="490" y="115" fill="#333" fontSize="20" fontWeight="700">.</text>
        <text x="490" y="130" fill="#333" fontSize="10" fontWeight="700">7</text>
      </svg>
      );
  };

  export default Svg;
  ```

  ## 构建琴谱规则

  基于上述的乐理知识, 我们需要将琴谱上的知识, 转化为代码模型定义。

  - 单音符

  ```js
  const musicMap =  {
      a: {
        title: '全音符',
        step: 4
      },
      b: {
        title: '二分音符',
        step: 2
      },
      c: {
        title: '四分音符',
        step: 1
      },
      d: {
        title: '八分音符',
        step: 0.5
      }, 
      e: {
        title: '十六分音符',
        step: 0.25
      } 
    }
   ```

   对于附点和复附点我们采用之前的乐理知识直接通过单音符一步一步推导出来。
   
   ```js
    let arr = toneString.split('');
    let dot = 0;
    let doubleDot = 0;
    const totalTime = arr.reduce((pre, cur,index, arr) => {

      if(yinfuMap[cur]) {
        return pre + yinfuMap[cur].step;
      }

      if(cur === '.' && index === 1) {
        dot = pre / 2;
        return pre + dot; 
      }

      if(cur === '.' && index === 2) {
        doubleDot = dot / 2;
        return pre + doubleDot;
      }

      return pre;
    }, 0);
   ```

  我们以2/4拍子的简谱来验证我们的推导公式是否正确。
  假如我们的谱子如下: 

  ```js
   const music = ['1c', '2c', '3c', '4c.', '4c', '3a', '2c..', '1a.'];
  ```

  经过我们的公式推到之后

  ```js
   [1, 1, 1, 1.5, 1, 4, 1.75, 6]
  ```
  
  解释一波:
   
    - ``` 1c ```  表示这个音符是四分音符, 对应一拍;
    - ``` 4c. ``` 四分单音符后面跟了一个附点音符, 因此 1 + 1/2 = 1.5拍
    - ``` 3a ```  a代表全音符, 一个全音符等于四个四分音符, 因此对应4拍
    - ``` 2c.. ``` 四分音符后面跟了一个附点音符, 附点音符后面跟了一个复附点音符因此 1 + 1/2 + ((1/2)/2) = 1.75拍

   - 音符的位置

   ```js
  export const musicalDistance = new Map(); // 音程的位置x
  musicalDistance.set('1#', { x: 305 })
  musicalDistance.set('1', { x: 185 })
  musicalDistance.set('2', { x: 205 })
  musicalDistance.set('3', { x: 225 })
  musicalDistance.set('4', { x: 245 })
  musicalDistance.set('#1', { x: 65 })
  ...
   ```
  - 音符的吹吸

  ```js
  export const musical = new Map(); // 音程的吹吸
  musical.set('#1', { action: 'blow' });
  musical.set('1', { action: 'blow' });
  musical.set('2', { action: 'absorb' });
  musical.set('3', { action: 'blow' });
  musical.set('4', { action: 'absorb' });
  musical.set('1#', { action: 'blow' });
  ...
  ``` 
  
  - 拍子对应的强弱节奏

  ```js
  export const tipMap = new Map();
  tipMap.set(2, ['strong', 'weak']);
  tipMap.set(3, ['strong', 'weak', 'weak']);
  tipMap.set(4, ['strong', 'weak', 'middle', 'weak']);
  tipMap.set(6, ['strong', 'weak', 'weak', 'middle', 'weak', 'weak']);
  ```

  不同的谱子拍子可能不一样, 因此我们需要根据音时以及谱子的类型来生成强弱的信号📶

  ```js
  let flag = 0;
  getStrongOrWeight() {
    const { pai } = this;
    let tipMap = new Map();
    tipMap.set(2, ['strong', 'weak']);
    tipMap.set(3, ['strong', 'weak', 'weak']);
    tipMap.set(4, ['strong', 'weak', 'middle', 'weak']);
    tipMap.set(6, ['strong', 'weak', 'weak', 'middle', 'weak', 'weak']);
    if(flag < 1) {
      flag  = flag + this.getDuringTime();
      return tipMap.get(pai)[0]
    }
    if(2 > flag && flag >= 1) {
      flag  = flag + this.getDuringTime();
      return tipMap.get(pai)[1]
    }
    if(flag === 2) {
      flag = this.getDuringTime();
    }
    return tipMap.get(pai)[0];
  }
  ```

  同样的我们输入一首2/4拍子的曲子

  ```js
    const music = ['1c', '2d', '3d', '4d', '5d', '4c'];
  ```

  经过我们的公式推导之后

  ```js
   ["strong", "weak", "weak", "strong", "strong", "weak"]
  ```

  这是一首以四分音符为一拍的曲子, 每小节有两拍。因此上述曲子可以分为2小节。
  
  ```
  | 1  23 |  45 4 |
  ```
  
    正常的二拍子，它的第一拍为强拍第二拍为弱拍。因此很明显 1 为强拍, 23为弱拍, 45为强拍, 4为弱拍。
    
   - 至于其他的一些基础配置就不赘述了, 后续会将整个代码开源出来, 目前还在迭代中。
  
  ## 构建单音类

  每个音都有自己一些固有的属性, 比如音对应琴孔的位置, 音符♪本身, 音符在口琴上是吹还是吸等等,
  但是每个音在琴谱上也会不同的表现形态, 比如音的强弱、音时等等。因此我打算构建一个基类和一个音符运行在谱子上时的单音类。

  基类

  ```js
  class Tone {
    constructor(toneString = '0') {
      this.toneString = toneString; 
    }

    // 琴孔的吹吸方式
    getStatus() {
      return this.toneString.includes('0') ? '空' : musical.get(this.toneString);
    }

    // 琴孔所处的位置
    getPosition() {
      return this.toneString.includes('0') ? '空' : musicalDistance.get(this.toneString)
    }

    // 获取初始音符
    getOriginMusic() {
      return this.toneString.replace(/[^0-9#]/ig,"");
    }
    
  }
  ```

  单音类

  ```js
  let flag = 0; 

  class ATone extends Tone {
    constructor(toneString,idx ,pai, count, map) {
      super();
      this.toneString = toneString;
      this.musicMap = map;
      this.pai = pai;
      this.count = count;
      this.idx = idx;
    }

  // 获取音强
  getStrongOrWeight() {
    const { pai } = this;
    let tipMap = new Map();
    tipMap.set(2, ['strong', 'weak']);
    tipMap.set(3, ['strong', 'weak', 'weak']);
    tipMap.set(4, ['strong', 'weak', 'middle', 'weak']);
    tipMap.set(6, ['strong', 'weak', 'weak', 'middle', 'weak', 'weak']);
    if(flag < 1) {
      flag  = flag + this.getDuringTime();
      return tipMap.get(pai)[0]
    }
    if(2 > flag && flag >= 1) {
      flag  = flag + this.getDuringTime();
      return tipMap.get(pai)[1]
    }
    if(flag === 2) {
      flag = this.getDuringTime();
    }
    return tipMap.get(pai)[0];
  }

  // 获取该音的音时长短
  getDuringTime() {
    const { toneString } = this;
    let arr = toneString.split('');
    let dot = 0;
    let doubleDot = 0;
    const totalTime = arr.reduce((pre, cur,index, arr) => {
      if(!isNaN(+cur)) {
        return pre + 1 / 4;
      }

      if(yinfuMap[cur]) {
        return pre + yinfuMap[cur].step / 4;
      }

      if(cur === '.' && index === 1) {
        dot = pre / 2;
        return pre + dot; 
      }

      if(cur === '.' && index === 2) {
        doubleDot = dot / 2;
        return pre + doubleDot;
      }

      return pre;
    }, 0);
    return totalTime;
  }

 }
  ```

## 画谱为码

  ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41f4c894f2c74cbb93e9a1e4cb2a87b7~tplv-k3u1fbpfcp-zoom-1.image)
     
  通过以上的乐理知识, 我们已经能够将简单的乐谱化为我们的模型代码。
  
   ```js
   const music = ['1c', '1c', '5c', '5c', '6c', '6c', '5c','-']
   ```

  由于每个音阶的时长都不一样, 我们需要控制吹奏每个音持续的时间。

  ```js
  useEffect(() => {
    if(count < data.length) {
      let timer = 0;
      timer = setInterval(() => {
        if(count < music.length)
        setCount(count + 1);
      },  data[count].getDuringTime() * 1000)
      return () => clearInterval(timer)
    }
  })
  ``` 

  运行我们简谱中前面4个小节可以看到如下动画:
  
  ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a02e3d1fd171401da3a0638cffdd8fdb~tplv-k3u1fbpfcp-zoom-1.image)
     
  似乎有那么一点感觉了。

 ## 说不尽的尾

 通过本篇文章的学习, 我们对口琴的基础知识也有了一个大致的了解。其实这仅仅是最最基础的知识, 比如口琴中还有八度、五度、三度和音、喉震、舌震 还有压音超吹各种舌头功夫, 这些技巧都需要靠扎实的基本功以及
 长年累月的练习才能摸索到它的奥秘。看完本篇文章如果对你有帮助, 请给我点个[star](https://github.com/Summer-andy/life-is-moment)哦! 您的鼓励是我继续下去的动力 ~ 