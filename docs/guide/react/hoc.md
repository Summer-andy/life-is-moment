### React 组件设计-高阶组件

#### 高阶组件的定义

##### 高阶组件(HOC)是 React 中复用逻辑的一种高级技巧。HOC 不是 React 的 API 的一部分。它仅仅只是组件的一种设计模式。简单的来说, 高阶组件的输入是组件.输出也是一个组件。

##### 这里需要注意下: 组件是把 props 转化为 UI,而高阶组件则是将一个组件转化为一个新的组件。比如我们经常用的 react-redux 中的 connect 就是一个高阶组件。

#### 高阶组件的应用方式

##### 1.以代理的方式实现 HOC

###### 返回的新的组件直接继承 React.Component 类, 新组件是传入组件的一个代理。通过新组件的 render 函数将传入组件渲染出来。除了一些可复用的逻辑,其余的逻辑都在传入组件里面完成。

##### 2.以继承的方式实现 HOC(了解即可)

###### 返回的新组件继承传入的组件.假如传入的参数 ComponentA， 那么返回的新组件直接继承 ComponentA。一般不推荐使用以继承的方式实现 HOC。因为组合大于继承。

#### 详谈高阶组件

##### 以代理方式实现 HOC 有哪些应用场景呢？

- 操纵 props
  需求 1: 我想给每一个组件添加一个 props。
  ```
  import React from 'react';
  import A from './A';
  import B from './B';
  function App() {
  return (
  <div className="App">
  <A name="andy" age={22} />
  <B name="rabbit" age={21} />
  </div>
  );
  }
  export default App;
   ```
  ```
  import React from 'react';
  import HOComponent from './HOC/HOComponent';
  const A = ({ name, age, sex }) => {
    return (
      <div>
        我是组件A:
        <p>我的英文名是: {name}</p>
        <p>我的年龄是: {age}</p>
        <p>我的性别是: {sex}</p>
      </div>
    );
  };

  export default HOComponent()(A);

  ```

  ```
  import React, { Component } from 'react';
  const HOComponent = () => WrapComponent =>
    class HOC extends Component {
      render() {
        return <WrapComponent sex="男" {...this.props}></WrapComponent>;
      }
    };
  export default HOComponent;
  ```
  需求2: 删除指定一个props。比如name

  ```
  import React, { Component } from 'react';
  const HOComponent = () => WrapComponent =>
    class HOC extends Component {
      render() {
        const { name, ...otherProps  }  = this.props;
        return <WrapComponent sex="男" {...otherProps}></WrapComponent>;
      }
    };
  export default HOComponent;
  ```

- 抽取状态
 需求1: A跟B需要一个Input组件(受控)，用尽可能少的代码完成。

  ```
  import React from 'react';
  import HOComponent from './HOC/HOComponent';
  const A = (props) => {
    const { name, age, sex, ...otherProps } = props;
    return (
      <div>
        我是组件A:
        <p>我的英文名是: {name}</p>
        <p>我的年龄是: {age}</p>
        <p>我的性别是: {sex}</p>
        <input {...otherProps} />
      </div>
    );
  };
  export default HOComponent()(A);
  ```


  ```
    import React, { Component } from 'react';

    const HOComponent = () => WrapComponent =>
      class HOC extends Component {

        state = {
          value: ''
        }

        handleInputChange = e => {
          this.setState({
            value: e.target.value
          });
        }

        render() {
          const { name, ...otherProps  }  = this.props;
          const { value } = this.state;
          const InputProps = {
            value,
            onChange: this.handleInputChange
          }
          return <WrapComponent sex="男" {...InputProps} {...otherProps}></WrapComponent>;
        }
      };
    export default HOComponent;
  ```
- 访问 ref
- 包装组件
