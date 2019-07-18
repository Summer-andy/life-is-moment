### 基本的钩子

- useState
- useEffect
- useContent

### 其他附加的一些钩子

- useReducer
- useCallback
- useMemo
- useRef
- useImperativeHandle
- useLayoutEffect
- useDebugValue

#### useState 钩子介绍

在 hooks 出现之前我们一般定义 state 是这样的 `this.state = { count: 0 }` , 假如我们需要改变 state 的值那么我们需
要这么做 `this.setState = { count: 1 }`, 当我们有了钩子函数以后,我们可以通过这样来定义一个 state `const [count, setCount] = useState(0)`, 假如我们需要改变 state,那么我们只需要调用`setCount(1)`即可;当然 useState 里面也可以写函数。

### useEffect 钩子介绍

首先在这里我想让大家了解一个名字“副作用”。什么是副作用呢？ 哪些 action 算是副作用呢？ 其实数据获取, 设置订阅啦，直接改 react 中 DOM 都会产生副作用。当然不是所有的副作用我们都需要清理.所以就产生了二种副作用：1.需要清理的副作用 2.不需要清理的副作用。如果你对类声明周期方法熟悉的话,你可以把 useEffect 当做 componentDidMount、componentDidUpdate 和 componentWillUnmount 的组合体。

##### 下面我们来讲一下需要清理的副作用

在 React 中 render 内部按道理是不应该进行副作用的, 但是我们希望在 React 更新完以后执行一些特定的副作用。这就是为什么在 React class 中会把副作用放到 componentDidMount 和 componentDidUpdate 中。下面我们来讲一下例子,还是用官网的例子进行解读。

```
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = this.state.count;
  }

  componentDidUpdate() {
    document.title = this.state.count;
  }

  render() {
    return (
      <div>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>点击我</button>
      </div>
    );
  }
```

很明显, 如果我们需要改变文档的标题, 那么我们必须执行二个生命周期函数。有些同学可能会问, 那我直接利用 componentDidUpdate 不就只有一个了嘛？但是问题来了,那么我们第一次的渲染效果呢？我们不可能单独去处理第一次没有 state 后的状态.因为你不能确定你这样做,会对组件造成什么样的影响.而且也不优雅。加入我们的 hooks 的这种写法我们只需要执行一次 useEffect 就好了。

```

const Hooks = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = count;
  });

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>你点击了</button>
    </div>
  );
};

```

可能你会问,useEffect 在这里做了什么操作？为什么要把 useEffect 放到组件内部？ 1.useEffect 会把 function 当成是一个副作用(effect), 并且在执行完 DOM 更新的时候去调用这个 function。 2. 在组件内使用 useEffect 可以直接读取到 state 的值,不需要引入其他的东西。你可能又会有疑问了, 我是不是每次 render 完,都会执行 useEffect? 答: 是的。抛弃类生命周期,我们更容易理解为这个副作用是发生在 render 完之后的！那么假如我们不想每次都执行呢? 比如说某一个达到顶峰不在变化了, 那么我们就不让他执行. 答: useEffect 函数还支持第二个参数

```
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]);

```

在这里只有 count 变化,才会执行这个函数,这样就可以实现定制化了。


### useContent
首先我大概介绍一下这个钩子的作用是什么?这个钩子主要是用于上下文传递值用的。在介绍这个钩子的用法之前,我想回一下,hooks出现之前,上下文之间的值传递是如何进行的。
```
 class Father extends Component {

  static childContextTypes = {
    permissions: PropTypes.array
  };

    getChildContext() {
    return {
      permissions: [1,2,3,4]
    };
  }
 }

```
```
  class Children extends Component {

    const withContent = (props, content) => {
      return ...
    }

    withContent.contextTypes = {
      permissions: PropTypes.array
    }

  }
```
我们可以看到还有有点复杂的。首先在父组件需要定义个childContextTypes。然后通过getChildContext派发到children.那么children处怎么接收呢？在chidlren得使用contextTypes接收一下permissions。那么我们如果使用hooks的话,比这个方便而且好理解多啦。我们通过createContext这个函数创建一个上下文,然后通过Provider提供给下文,下文通过useContext接收上文提供的值。

```
import React, { createContext } from 'react';
import Example from './Example';
export const themeContent = createContext(null);

const index = () => {
  return (
    <themeContent.Provider value="light">
      <Example />
    </themeContent.Provider>
  );
};

export default index;
```

```
import React, { useContext } from 'react';
import { themeContent } from './index';
const Example = () => {
  const theme = useContext(themeContent);
  return (
    <div>
      {
        theme
      }
    </div>
  );
};

export default Example;
```

### useRef 的介绍

useRef 返回一个可变的 ref 对象。返回的对象将持续整个生命周期。useRef 将替代我们之前用的 ref, 它的 current 的值发生改变,React 相应的 DOM 的属性值将发生改变。

```
const Hooks = () => {
  const testRef = useRef();
  const Refclick = () => {
    console.log(testRef.current);
  }
  return (
    <div>
      <input ref={testRef}/>
      <button onClick={Refclick}>测试Ref</button>
    </div>
  );
};
```

输出的值为我们 input 的 DOM。 当然 useRef 不仅仅可用于操作 DOM, 还可以获取之前 dom 的状态。

```
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;
  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

未来 React 可能会提供 usePrevious 开箱即用的 Hook，因为它是一个相对常见的用例.

### useReducer 的介绍

useReducer 接收二个类型参数:1. 当前状态的 state 2. 返回与状态相关的 dispatch。假如你已经熟悉 redux 模式, 那么这个例子肯定很容易理解。这里特别说明一下, useReducer 假如需要从其他组件中传递参数那么可以通过在组件入口处定义个初始对象,切记一定要使用对象包一下！之后 useReducer 中第二个参数用于传递参数到 reducer 中。

```

function initialState(params) {
  console.log(params);
  return { count: 0 }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return {
        count: state.count + 1
      }
    case 'reduce':
      return {
        count: state.count - 1
      }
    default:
      break;
  }
}

const UseReducer = ({ arr = [{ id: 1, number : 2 }]}) => {
  const [state, dispatch] = useReducer(reducer, arr ,initialState);
  console.log(state, dispatch);
  return (
    <div>
      <p>{state.count}</p>
      <Button
        onClick={() => {
          dispatch({ type: 'add' });
        }}
      >
        增加
      </Button>
      <Button
        onClick={() => {
          dispatch({ type: 'reduce' });
        }}
      >
        减少
      </Button>
    </div>
  );
};

export default UseReducer;


```

### useCallback 的使用教程

不知道大家是否会注意到,当我们使用 hooks 写法的时候, 每次 state 更新都会引起整个内部的函数的重新申明, 何以见得呢? 当我们 state 更新的时候, 我们可以在 hooks 内部打印一下,会发现只要 state 变化, 就会打印一下。这个现象,说明了有闭包调用问题, 因此为了节约内存,我们可以使用 useCallBack 来缓存一下,只有在特定情况下才重新申明。下面我们直接看例子.

```
const useCallBack = () => {

  const [state, setState] = useState(0);

  const hello = useCallback(() => {
    console.log('hello!');
  }, [state]);

  console.log('object');

  return (
    <div>
      <p onClick={hello}>{state}</p>
      <button onClick={() => { setState(state + 1) }}>gogoog</button>
    </div>
  );
};
```

### useImperativeHandle 的使用

场景： 父组件需要使用子组件的 ref 进行一些操作。这时候就需要用到 useImperativeHandle 了
使用方法: （子组件需要使用forwardRef包一下哦）

```
import React, { forwardRef, useRef, useImperativeHandle } from 'react';

const useImperativeHandles = (props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focusHH: () => {
      inputRef.current.focus();
    }
  }));

  return (
    <div>
      <input ref={inputRef} />
    </div>
  );
};

export default forwardRef(useImperativeHandles);
```
``` 
import React, { useRef, useEffect } from 'react';
import UseImperativeHandles from './index';
const Parnent = () => {

  const fancyInputRef = useRef();

  useEffect(() => {
    console.log(fancyInputRef);
    fancyInputRef.current.focusHH();
  }, []);

  return (
    <div>
      <UseImperativeHandles ref={fancyInputRef} />
    </div>
  );
};

export default Parnent;
```