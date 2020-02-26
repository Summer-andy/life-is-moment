#### 📝 记录一些平时小工具以及函数库

- 🔥 [thenby](https://www.npmjs.com/package/thenby) 可以帮我们完成多条件依次排序。
  假如我们需要先按照阶段排序然后再按照顺序排序。
  ```js
  import { firstBy } from 'thenby'
  var data = [ { phare: 1, order: 1 }, { phare: 2, order: 2 }, { phare: 2, order: 1 } ];
  
  var sortData =  data.sort(
  firstBy(function(a, b) { return a.phare - b.phare })
  .thenBy(function(a, b) { return a.order - b.order })
  ); 
  // [ { phare: 1, order: 1 }, { phare: 2, order: 1 }, { phare: 2, order: 2 } ];
  ```
