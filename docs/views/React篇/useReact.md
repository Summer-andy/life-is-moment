---
title: React开发者需要会的技能
date: 2019-10-31
tags:
  - React基础
categories:
  - React
---

## React 开发者需要会的技能

#### 1.组件通讯

- 父组件向子组件发起通讯

  ##### 场景描述: 我上小学的时候,零花钱都是一天一给的而且都是固定的。今天是星期一儿子问爸爸要零花钱, 然后爸爸就给了儿子 2 块钱。那么对应到通讯, 这是父组件传递了 2 块钱给子组件。

  父组件

  ```
   import React, { Component } from 'react';
   import Child from './Child'; // 引入子组件
   class App extends Component {
     render() {
       return (
         <div>
           <h4>我是父组件</h4>
           <Child money={2} />
         </div>
       );
     }
   }
   export default App;
  ```

  子组件

  ```
   import React, { Component } from 'react';
   class Child extends Component {
     render() {
       const { money } = this.props;
       return (
         <div>
           <h5>我是子组件,我今天的零花钱是{money}元</h5>
         </div>
       );
     }
   }
   export default Child;
  ```

* 子组件向父组件发起通讯

  ##### 场景描述: 此时儿子又说,"爸爸, 我的文具用品又不够用啦,需要买新的呢",这时爸爸就给了 20 块钱。现在其实已经有点小小的逻辑了。如果儿子买文具用品那么爸爸就给 20 块钱,否则就给 2 块钱。

  父组件

  ```
   import React, { Component } from 'react';
   import Child from './Child';
   class App extends Component {

     state = {
       money: 2
     }

     buyStationery = value => {
       if(value === '文具')  {
         this.setState({
           money: 20
         })
       }
     }

     render() {
       const { money } = this.state;
       return (
         <div>
           <h4>我是父组件</h4>
           <Child money={money} buyStationery={this.buyStationery} />
         </div>
       );
     }
   }

   export default App;
  ```

  子组件

  ```
   import React, { Component } from 'react';

   class Child extends Component {
     render() {
       const { money, buyStationery } = this.props;
       return (
         <div>
           <h5>我是子组件,我今天的零花钱是{money}元</h5>
           <button onClick={() => buyStationery('文具')}>我要买文具</button>
         </div>
       );
     }
   }

   export default Child;
  ```

* 爷组件向孙组件发起通讯

  ##### 场景描述: 快过年了, 儿子看到其他小朋友的爷爷都给他们压岁钱了, 心想为什么我的爷爷没有给我压岁钱呀？儿子就去问爸爸了, "爸爸,你帮我问问爷爷,我这么乖有没有压岁钱呀", 爸爸此时哈哈大笑,"好的, 我去帮你问问"。过了一会儿,爸爸跟儿子说, "儿子, 爷爷说给你 100 块 🧧"。

  爷组件

  ```
   import React, { Component } from 'react';
   import Parent from './Parent';

   class App extends Component {
     render() {
       return (
         <div>
           <h4>我是爷组件</h4>
           <Parent money={100}  />
         </div>
       );
     }
   }

   export default App;
  ```

  父组件

  ```
   import React, { Component } from 'react';
   import Child from './Child';

   class Parent extends Component {
     render() {
       const { money } = this.props;
       return (
         <div>
             我是父组件
             <Child money={money} />
         </div>
       );
     }
   }

   export default Parent;
  ```

  孙组件

  ```
  import React, { Component } from 'react';

  class Child extends Component {
    render() {
      const { money } = this.props;
      return (
        <div>
          <h5>我是孙组件,今年爷爷给我的压岁钱是{money}元</h5>
        </div>
      );
    }
  }

  export default Child;
  ```

* 孙组件向爷组件发起通讯

  ##### 场景描述: 这时候,儿子看到其他小朋友都有遥控汽车,就是立马跑回家跟爸爸说, "爸爸, 你能不能跟爷爷说一下,我想买辆遥控汽车, 能不能多给点呀"。这时候, 爸爸就去跟爷爷说了。爷爷说好的, 压岁钱给 500。

  爷组件

  ```
  import React, { Component } from 'react';
  import Parent from './Parent';
  class App extends Component {
    state = {
      money: 100
    };

    buyCar = value => {
      if (value === '遥控汽车') {
        this.setState({
          money: 500
        });
      }
    };

    render() {
      const { money } = this.state;
      return (
        <div>
          <h4>我是爷组件</h4>
          <Parent money={money} buyCar={this.buyCar} />
        </div>
      );
    }
  }

  export default App;
  ```

  父组件

  ```
  import React, { Component } from 'react';
  import Child from './Child';

  class Parent extends Component {
    render() {
      const { money, buyCar } = this.props;
      return (
        <div>
            我是父组件
            <Child money={money} buyCar={buyCar} />
        </div>
      );
    }
  }

  export default Parent;
  ```

  孙组件

  ```
  import React, { Component } from 'react';

  class Child extends Component {
    render() {
      const { money, buyCar } = this.props;
      return (
        <div>
          <h5>我是孙组件,今年爷爷给我的压岁钱是{money}元</h5>
          <button onClick={() => buyCar('遥控汽车')}>我要买遥控汽车</button>
        </div>
      );
    }
  }

  export default Child;
  ```

* 非嵌套组件之间的通讯

  ##### 非嵌套组件基本上可以分为兄弟组件和非兄弟组件。本文将提供一种比较简洁的方法,进行兄弟组件之间的通讯。

  ##### 场景描述: 哥哥想找弟弟出去玩, 但是呢不想被父亲知道。于是他们利用了"秘密工具"进行了通讯。

  父组件

  ```
   import React, { Component } from 'react';
   import Brother from './Brother';
   import YoungBrother from './YoungBrother';

   class App extends Component {
     render() {
       return (
         <div>
           {/* 我是父组件，我有二个儿子  */}
           <Brother />
           <YoungBrother />
         </div>
       );
     }
   }

   export default App;
  ```

  哥哥组件

  ```
   import React, { Component } from 'react';
   import { TestEvent } from './event';
   class Brother extends Component {

     handlePlay = () => {
       TestEvent.emit('play',{ action: '出去玩' })
     };

     render() {
       return (
         <div>
           我是哥哥组件
           <button onClick={this.handlePlay}>走弟弟, 我们出去玩!</button>
         </div>
       );
     }
   }

   export default Brother;
  ```

  弟弟组件

  ```
   import React, { Component } from 'react';
   import { TestEvent } from './event';
   class YoungBrother extends Component {

     componentDidMount() {
       TestEvent.on('play', value => {
         console.log(value);
       });
     }

     componentWillUnmount() {
       TestEvent.removeListener('play')
     }

     render() {
       return (
         <div>
             我是弟弟组件
         </div>
       );
     }
   }

   export default YoungBrother;
  ```

  秘密工具

  ```
  const EventEmitter = require('events');
  const TestEvent = new EventEmitter();
  export { TestEvent }
  ```

  ##### 秘密工具解释: 秘密工具主要是利用"发布/订阅"模式, 也就是观察者模式。

#### 2. 改变 State 的 5 种方式

- 普通方式

```
 let { count } = this.state;
 this.setState({ count: count + 2  })
```

- 通过回调函数

```
 this.setState({count} => ({ count: count + 2 }))
```

- 通过传递 state 和 props

```
this.setState((state, props) => {
  return { count: state.count + props.step };
});
```

- hooks 方式

```
const [count, setCount] = useState(0)
setCount(count+2)
```

- 改变 state，执行的回调函数

```
this.setState(
  {count:3},()=>{
    fn()
  }
)
```

#### 3.高阶组件

##### 参考 React 组件设计-高阶组件

#### 4.使用 useRef 缓存上一次的值

```js
import React, { Fragment, useState, useEffect, useRef } from 'react';

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const Layout = () => {
  const initCount = (value = 0) => value;
  const [now, setNow] = useState(() => initCount());
  const pre = usePrevious(now);

  const handleClick = () => {
    setNow(1);
  };

  return (
    <Fragment>
      <p>now is {now}</p>
      <p>pre is {pre}</p>
      <button onClick={handleClick}>改变state</button>
    </Fragment>
  );
};

export default Layout;
```
