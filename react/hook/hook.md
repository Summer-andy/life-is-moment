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

### useReducer 的介绍

在使用 useReducer 之前我们一般的 redux 数据处理方式是这样的: 一般我们新建一个 redux 的容器为

- 一个大的 redux
  - 小的 redux
    - action (用来派发的 action, 这里我们不把service抽离出来单独处理)
    - type (用来区分派发不用的 action)
    - index (用来转发的 reducer)
    - selector (可省略, 主要的作用是转化数据结构表并且优化性能)
  - ....
  - ....
  - ....

当我们的页面发起请求的时候,就会自动去调用 redux 里面的 action.当我们使用了 useReducer 的时候, 我们可以不用去在 redux 中定义 action 直接在页面中进行 dispatch 就好了。下面我们还是引用官方计时器的例子

```
function Counter({initialState}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```
从上面的例子可以看到, useReducer内置了一个dispatch和state。从名字中我们就可以看出来他的作用了, state 就是redux里面的状态机, dispatch取代了我们action里面的派发动作了。当出现一个新技术的时候,我们始终应该关注着能为我们带来什么便利,我认为useReducer最大的好处就是可以简化代码, 没有必要写冗余的代码。

### useRef的介绍
useRef 返回一个可变的ref对象。返回的对象将持续整个生命周期。useRef将替代我们之前用的ref, 它的current的值发生改变,React相应的DOM的属性值将发生改变。
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
输出的值为我们input的DOM。 当然useRef不仅仅可用于操作DOM, 还可以获取之前dom的状态。

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
未来React可能会提供usePrevious开箱即用的Hook，因为它是一个相对常见的用例.

