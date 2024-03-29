---
title: Framework7-React组件最佳实践
date: 2020-12-11
tags:
  - js基础
categories:
  - 前端基础
---

## 前言

   本文是对Framework-React中部分特殊组件的一次最佳实践。如有错误欢迎指正!

## ToolBar、Fab等具有特殊定位组件

  如果在Tab中要使用带有特殊定位组件, 例如 Fab ToolBar 等等, 需要按照对应的结构编写代码。

  ![image](./img/fab.png) 

  代码结构应该大致如下: 

  ```js
  <Tabs>
    <Tab id="XXX" className="page-content" tabActive>
      <Page>
        <PageContent>
          <Block>content</Block>
        </PageContent>
      </Page>
      <Fab position="center-bottom" slot="fixed" text="Create" color="red">
        <Icon ios="f7:plus" aurora="f7:plus" md="material:add"></Icon>
      </Fab>
    </Tab>
    ...
  </Tabs>
  ```

## 路由的跳转

   Framework7内置了8种页面进出场的方式: 

   ![image](./img/f7-router.gif) 

   - f7-circle

   - f7-cover

   - f7-cover-v

   - f7-dive

   - f7-fade

   - f7-flip

   - f7-parallax

   - f7-push

   我们可以根据不同的场景使用不同的进出场方式:

   ```js
    import Framework7 from 'framework7/framework7.esm.bundle';
    Framework7.instance.view.main.router.navigate('/home', { transition: 'f7-circle' });
   ```

## sheetModal

   React版本的``` sheetModal ``` 顶部是不带handler的。因此如果我们使用了sheetModal并且需要handler, 我们需要手动的在 ``` Sheet ``` 组件内添加 ``` handler ```。

   ```js
    const SheetModal = ({ children, ...other }) => {
      return (
        <Sheet {...other}>
          <div className={styles['swipe-handler']}></div>
          {children}
        </Sheet>
      );
    };
   ```

   ```css
  .swipe-handler {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 16px;
    cursor: pointer;
    z-index: 10;
    &::after {
      content: '';
      position: absolute;
      left: calc(50% - 18px);
      top: calc(50% - 3px);
      width: 36px;
      height: 6px;
      border-radius: 3px;
      background: #666;
    }
  }
   ```

## 下拉加载更多

  [F7-React官网](https://framework7.io/react/page.html)的例子中包含了下拉加载, 表明上看它的例子似乎没什么问题。 如果我们将初始化的数据条数修改为屏幕能够容纳的范围内, 例如将初始条数设置为2。我们将会看到以下画面。

  ![image](./img/Infinite.png) 

  加载中的loading符号会一直存在于我们的页面, 显然这是不对的, 那么正确的写法应如下所示: 

  ```js
  const BestTraining = () => {
    const [items, setItems] = useState(Array.from({ length: 20 }).map((item, index) => index + 1));
    const [allowInfinite, setAllowInfinite] = useState(true);
    const [showPreloader, setShowPreloader] = useState(false);

    const loadMore = () => {
      if (!allowInfinite) return;
      setAllowInfinite(false);
      setShowPreloader(true);
      setTimeout(() => {
        if (items.length >= 200) {
          setShowPreloader(false);
          return;
        }
        const itemsLength = items.length;
        for (let i = 1; i <= 20; i += 1) {
          items.push(itemsLength + i);
        }
        setItems(items);
        setAllowInfinite(true);
      }, 1000);
    };

    return (
      <Page infinite infiniteDistance={50} infinitePreloader={showPreloader} onInfinite={loadMore}>
        <Navbar title="Infinite Scroll"></Navbar>
        <List>
          {items.map((item, index) => (
            <ListItem title={`Item ${item}`} key={index}></ListItem>
          ))}
        </List>
      </Page>
    );
  };
  ```

  与官网中例子的差别其实就是在于对``` showPreloader ```初始值的定义, 只有当他执行 ``` loadMore ``` 的时候, 才会让``` showPreloader ```的值变为true。

## sass写法注意事项

   f7默认会对组件的```padding```或者其它属性有值的设定, 以下是一些默认的设定值: 

   ```css
  :root {
    --f7-theme-color: #007aff;
    --f7-theme-color-rgb: 0, 122, 255;
    --f7-theme-color-shade: #0066d6;
    --f7-theme-color-tint: #298fff;
    --f7-safe-area-left: 0px;
    --f7-safe-area-right: 0px;
    --f7-safe-area-top: 0px;
    --f7-safe-area-bottom: 0px;
    --f7-safe-area-outer-left: 0px;
    --f7-safe-area-outer-right: 0px;
    --f7-device-pixel-ratio: 1;
  }
   ```

   如果我们想要修改默认组件的样式, 比如: 修改List的中字体的颜色大小以及边距等等。那么我们应该如何修改呢?

   ```scss
  $fontSize: 14px;
  $color: #333333;
  $marginDistance: 0;

  .listInfo {
    --f7-list-margin-vertical: #{$marginDistance};
    --f7-list-item-title-font-size: #{$fontSize};
    --f7-list-item-title-text-color: #{$color};
    --f7-list-item-after-text-color: #{$color};
    --f7-list-item-after-font-size: #{$fontSize};
  }
   ```

  :::warning
  自定义变量作用于全局配置上(比如: --f7-list-item-after-font-size)的语法是#{$变量}
  :::


## smart select  

   智能选择可以让我们轻松地将通常的表单选择转换为具有分组单选或复选框输入的动态页面。在移动端中, 这样的功能也很常见。但是官网的示例中的 ``` smart select   ``` 都不是一个单独存在的组件。

   ```js
  <List>
    <ListItem
      title="Fruit"
      smartSelect
    >
        <select name="fruits" defaultValue="apple">
          <option value="apple">Apple</option>
          <option value="pineapple">Pineapple</option>
          <option value="pear">Pear</option>
          <option value="orange">Orange</option>
          <option value="melon">Melon</option>
          <option value="peach">Peach</option>
          <option value="banana">Banana</option>
        </select>
      </ListItem>
      // ...
    </List>
   ```

   很多时候, 我们往往是在触发一个按钮或者其他地方来触发智能选择器。因此官网的示例就非常有局限性了。我们可以将智能选择抽离成一个公用的组件: 

   ```js
    const Page = (props, ref) => {
      const { multiple } = props;
      const [list, setList] = useState([]);
      const instanceRef = useRef();

      useEffect(() => {
        loadData();
      }, []);

      useImperativeHandle(ref, () => ({
        open,
        getValue
      }));

      const EventLoop = () => {
        props.onHandleChooseItem && props.onHandleChooseItem(getValue());
        instanceRef.current.unsetValue();
        instanceRef.current.off('close', EventLoop);
      };

      const loadData = async () => {
        try {
          await Framework7.instance.preloader.show();
          setList([])
        } catch (error) {
          notification('加载失败!', error.message).open();
        } finally {
          await Framework7.instance.preloader.hide();
        }
      };

      /**
       * 打开模态框
       */

      const open = () => {
        instanceRef.current = Framework7.instance.smartSelect.get('.smart-select');
        instanceRef.current.on('close', EventLoop);
        Framework7.instance.smartSelect.open(instanceRef.current);
      };

      /**
       * 获取选中的值
       */

      const getValue = () => {
        if (multiple) {
          const arr = instanceRef.current.getValue();
          const result = list.filter(item => arr.indexOf(String(item.id)) !== -1);
          return [arr, result];
        }
        const item = list.find(item => item.id === +instanceRef.current.getValue());
        return [instanceRef.current.getValue(), item];
      };

      return (
        <a
          href="#"
          className="item-link smart-select smart-select-init"
          data-open-in="popup"
          data-searchbar="true"
          data-close-on-select="true"
          data-searchbar-placeholder="请输入XXX"
          data-back-on-select="true"
          data-popup-close-link-text="保存"
        >
          <select name="type" multiple={multiple}>
            {formatTree(list).map(item => (
              <optgroup label={item.name} key={item.id}>
                {item.children.map(rc => (
                  <option key={rc.id} value={rc.id} opt={rc}>
                    {rc.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </a>
      );
    };

    export default forwardRef(Page);
   ```

  在使用方, 我们只需要在页面的任何地方插入组件即可。

  ```js
    <ToolTypeChoose ref={domRef} onHandleChooseItem={onHandleChooseItem} />
  ```

  如果想要打开智能选择, 执行 ```domRef.current.open() ``` 即可, 通过 ``` onHandleChooseItem ``` 获取选中的值即可。这样我们就可以在任何恰当的地方使用。


  ## 写在结尾

  个人认为Framework作为移动端UI框架还是很不错的。 并且, 你看它很早就开始支持vue3啦! 

  ![image](./img/package.jpg) 



   