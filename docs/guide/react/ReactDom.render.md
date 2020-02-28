### ReactDOM.render的阅读

##### 前言: 工欲善其事必先利其器。当我在使用React编写代码的时候, 总是会有一个疑问, 我写的代码到底是不是React的最佳实践。带着这个疑问, 我就开始了React的源码之旅。

##### 缘起
一切的一切都要从它说起, ` ReactDOM.render(<App />, 'root') `。它是我们整个应用的入口, 是我们开启React这块天空之城的飞行石。


##### 初探(了解render流程)
我们翻开ReactDOM.js这个文件,找到定义ReactDOM对象的地方,然后找到render方法.render方法接收三个参数, 分别是: 1.传入组件的类 2.挂载的dom节点 3.组件完成渲染后触发的回调函数.

``` js
const ReactDOM: Object = {
  createPortal,
  findDOMNode(
    componentOrElement: Element | ?React$Component<any, any>,
  ): null | Element | Text {
  ...
  render(
    element: React$Element<any>,
    container: DOMContainer,
    callback: ?Function,
  ) {
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback,
    );
  }
```
render方法返回一个 legacyRenderSubtreeIntoContainer();接下来我们看看定义这个函数的地方。同样的我们删掉一些不影响我们主流程阅读的代码。

```js
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: DOMContainer,
  forceHydrate: boolean,
  callback: ?Function,
) {
  ...
  let root: Root = (container._reactRootContainer: any);
  if (!root) {
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    ...
  return DOMRenderer.getPublicRootInstance(root._internalRoot);
}
```
这个函数最重要的一个步骤就是创建了``` ReactRoot ```，好那么我们接下去再看看他是如何创建ReactRoot的。
```js
function legacyCreateRootFromDOMContainer(
  container: DOMContainer,
  forceHydrate: boolean,
): Root {
  ...
  // Legacy roots are not async by default.
  const isConcurrent = false;
  return new ReactRoot(container, isConcurrent, shouldHydrate);
}
```
我们发现这边最重要的功能就是返回了一个ReactRoot。那么我们继续跟进,他是如何new的.
```js
import * as DOMRenderer from 'react-reconciler/inline.dom';
function ReactRoot(
  container: Container,
  isConcurrent: boolean,
  hydrate: boolean,
) {
  const root = DOMRenderer.createContainer(container, isConcurrent, hydrate);
  this._internalRoot = root;
}

ReactRoot.prototype.render = function(
  children: ReactNodeList,
  callback: ?() => mixed,
): Work {
  const root = this._internalRoot;
  const work = new ReactWork();
  callback = callback === undefined ? null : callback;
  DOMRenderer.updateContainer(children, root, null, work._onCommit);
  return work;
};

```
我们发现ReactRoot这个方法里面开始用到其他包里面的函数了``` DOMRenderer.createContainer() ```了,我们继续跟进createContainer这个方法。

```js
export function createContainer(
  containerInfo: Container,
  isConcurrent: boolean,
  hydrate: boolean,
): OpaqueRoot {
  return createFiberRoot(containerInfo, isConcurrent, hydrate);
}
```
我们发现这边其实又创建了一个fiberRoot.我们先不继续追究下去了, Fiber这边后面我们着重探讨, 我们先理清楚整个流程。那么我们创建了fiberRoot，我们接下去是不是得去更新呀？我们可以看到React开发者们对ReactRoot添加了一个render的原型,他的作用就是更新我们的fiberRoot,同样的我们看看``` updateContainer ```做了什么？

```js
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  const current = container.current;
  const currentTime = requestCurrentTime();
  const expirationTime = computeExpirationForFiber(currentTime, current);
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    callback,
  );
}
```
我们可以看到它在这里主要做了二件事情: 1. 创建expirationTime 2.创建一个更新的对象。那么他创建完更新的对象后, 是不是肯定要执行呀,我们继续看看```updateContainerAtExpirationTime```做了什么?
```js
export function updateContainerAtExpirationTime(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  expirationTime: ExpirationTime,
  callback: ?Function,
) {
  // TODO: If this is a nested container, this won't be the root.
  const current = container.current;
  ...
  return scheduleRootUpdate(current, element, expirationTime, callback);
}

```
updateContainerAtExpirationTime方法其实就是开始根据expirationTime执行调度任务了。

##### 缘落
  我们已经大概了解了ReactDOM.render()做的事情了,但是距离我们达到天空之城最核心的地方还有段距离,我们不要慌,一步一步探索下去,一定可以达到那片最为神秘的地方。本章,我们总结一下,ReactDOM.render()执行了哪几步比较重要的步骤：
         
  - 创建ReactRoot
  - 创建FiberRoot
  - 创建Fiber对象
  - 创建expirationTime
  - 创建更新对象
  - 根据expirationTime对之进行调度