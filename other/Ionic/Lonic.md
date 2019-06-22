###  基于ionic4的react开发的经验

1. 如果想要修改某个空间的样式. 记住尽量使用class 而不是使用className 标签。(因为当你使用className标签的时候, 有时候会把控件自带的样式给覆盖掉,造成页面抖动的假象)
2. IonPopover 控件如果想要达到满意的效果。需要加event。在官方文档上没有标明。
3. 下拉刷新组件中(IonRefresherContent中没有, 可能是因为版本较低),如果发现当前版本没有onRefresherContent我们可以使用javascript版本的ion-refresher-content的标签替换掉.