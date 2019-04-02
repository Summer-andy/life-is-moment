### 实现非嵌套组件之间的通信有二种方式
- 利用二者之间共同的父元素进行通信
- 利用发布、订阅模式进行通信
#### 当然这里我们来讲一下怎么利用发布/订阅模式进行通信

```
  yarn add events --save
```

#### 首先我们需要一个event包

#### 我们新建一个event.js,并且引入events包,并且向外提供一个事件对象,供通信时使用 
```
import { EventEmitter } from 'events'
export default new EventEmitter()

```

#### 现在我们有三个组件他们之间的关系是:  A组件里面包含B,C组件并且B和C组件之间无嵌套关系,都是互相独立。

A: 
```   
import React from 'react'
import B from './B'
import C from './C'
export default const A = ({ }) => {
  return (
  <A>
    <B />
    <C />
  </A>)
}

```

B:
```
import React from 'react'
import emitter from "./event"
export default const B = ({ }) => {
  useEffect(()=>{

  }, [])

  const handleEmit = () => {
    emitter.emit('andy', '起风了');
  }

  return ( 
    <button onClick={handleEmit}>点击</button>
  )
}


```

C:
```
import React from 'react'
import emitter from "./event"
export default const C = ({ }) => {

  const [title ,setTitle] = (''); 

  useEffect(()=>{
      emitter.addListener('andy', msg => {
            setTitle(msg);
      })
  }, [])


  return ( 
    <h1>{`这是我最喜欢电视剧: ${title}`}</h1>
  )
}


```
当然非嵌套组件也可以使用context！自己觉得哪个方便就用哪个哈！