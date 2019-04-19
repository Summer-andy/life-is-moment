#### 什么是冒泡以及阻止冒泡的方法

#### 翻阅了网上挺多资料, 我觉得首先好多语言都太书面化了。首先我们需要知道当我们点击页面上的某一个dom元素的时候,其实html与js就产生了发生了事件关系了。在你们相互认识的阶段, 对方一开始都是不清楚你的人品呀,内在素养啦什么的,所以只能慢慢的从外而内的了解你,所以如果她想捕获你的心,她就必须慢慢的一层层的剥开你的心,所以事件的捕获是从外到内。但是呢,我们想和别人交流这回事,肯定是我们从心里开始的从而表于形,所以说事件的响应也就是事件的冒泡是从内而外的。我们可以看实例，证明一下。

####  浏览器中支持冒泡的事件有 beforeinput | click | compositionstart | compositionupdate | compositionend | dblclick | focusin | focusout | input | keydown | keyup | mousedown | mouseup | mousemove | mouseout | mouseover | scroll | select | wheel


#### 不支持冒泡的事件有 abort | blur | error | focus | load | mouseenter | mouseleave | resize | unload

#### 阻止事件冒泡的方法 分为两种 第一种是使用 return false; 第二种是 stopPropagation()千万不要与默认事件混淆哦！