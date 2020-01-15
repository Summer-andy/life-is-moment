## 你不知道的js之原型
#### 前言: 在某个对象中获取属性的时候, 首先引擎会从对象本身去找, 如果找到不到的话回去Prototype原型上找。
```

var obj = { a: 2 };
var newObj = Object.create(obj);
newObj //  {}
newObj.__proto__.a // 2

```

### 屏蔽
```
var obj = { a: 2 }
var newObj = Object.create(obj)

obj.hasOwnProperty('a')  // true
newOj.hasOwnProperty('a') // false

newObj.a++

obj.hasOwnProperty('a')  // true
newOj.hasOwnProperty('a') // true

```

##### 解释: newObj.a++其实相当于  newObj.a = newObj.a + 1. 首先引擎会从newObj的原型上去查找a属性,通过++操作,通过PUT操作将值赋给newObj的屏蔽属性。

