### 重复 N 次的元素

#### 题目描述

在大小为 2N 的数组 A 中有 N+1 个不同的元素，其中有一个元素重复了 N 次。

返回重复了 N 次的那个元素

#### 算法

```

    let set = new Set();
    for(let e of A){
        if(!set.has(e)){
            set.add(e);
        }else{
            return e;
        }
    }

```
