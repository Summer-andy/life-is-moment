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

可能你会问,useEffect在这里做了什么操作？为什么要把useEffect放到组件内部？ 1.useEffect会把function当成是一个副作用(effect), 并且在执行完DOM更新的时候去调用这个function。 2. 在组件内使用useEffect可以直接读取到state的值,不需要引入其他的东西。你可能又会有疑问了, 我是不是每次render完,都会执行useEffect? 答: 是的。抛弃类生命周期,我们更容易理解为这个副作用是发生在render完之后的！那么假如我们不想每次都执行呢? 比如说某一个达到顶峰不在变化了, 那么我们就不让他执行. 答: useEffect函数还支持第二个参数
``` 
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]);

```
在这里只有count变化,才会执行这个函数,这样就可以实现定制化了。
