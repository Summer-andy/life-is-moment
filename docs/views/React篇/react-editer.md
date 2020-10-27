---
title: 基于React+Topology构建绘图工具
date: 2020-10-27
tags:
  - React基础
categories:
  - React
---


## 前言

  文本将会着重教大家如何基于Hooks搭建属于自己的一套绘图工具。话不多话直接上图:

  ![](https://imgkr2.cn-bj.ufileos.com/b0e3c8cf-6d55-4463-919f-f7c08c600975.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=fUzBE5p1nPTjfscQlfaQ1xjvZbc%253D&Expires=1603901411)


  项目的地址我已经托管到[github](https://github.com/Summer-andy/topology-react)上, 欢迎各位大佬批评指教!后面陆续会将完成的功能, 同步更新到我的github[博客](https://github.com/Summer-andy/life-is-moment)上。

## 环境搭建

  - 初始化项目
    
  ```create-react-app project```

  - 安装依赖

    ```js
    "@topology/activity-diagram": "^0.2.24",
    "@topology/chart-diagram": "^0.3.0",
    "@topology/class-diagram": "^0.2.24",
    "@topology/core": "^0.3.1",
    "@topology/flow-diagram": "^0.2.24",
    "@topology/layout": "^0.3.0",
    "@topology/sequence-diagram": "^0.2.24",
    "antd": "3.26.7",
    ```

    至于基础布局的代码, 大家可以自由发挥, 本文就不赘述了。如果想直接上手基础功能的话, 可以直接clone[已有的仓库](https://github.com/Summer-andy/topology-react)~

    ok! 完成项目基本环境的搭建后, 就可以开始逐个完成以下功能点了。

## 功能介绍

  ### 自定义iconfont示例

  ### 自定义图片示例

  ![](https://imgkr2.cn-bj.ufileos.com/d071fdc5-2c91-4a95-b501-4ef8027cdca2.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=dwz4jJkBiut4C0F4Rr5zTXd9dEk%253D&Expires=1603901441)

  主页面左侧的图形渲染区域, 可以自定义渲染。

  ```js
  const Layout = ({ Tools, onDrag }) => {
    return Tools.map((item, index) => (
      <div key={index}>
        <div className="title">{item.group}</div>
        <div className="button">
          {item.children.map((item, idx) => {
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            return (
              <a
                key={idx}
                title={item.name}
                draggable
                href="/#"
                onDragStart={(ev) => onDrag(ev, item)}
              >
                <i className={'iconfont ' + item.icon} style={{ fontSize: 13 }}></i>
              </a>
            );
          })}
        </div>
      </div>
    ));
  };
  ```

  自定义配置项数据源, ```icon: 'icon-image' ``` 指的是左侧显示的小图标。data数据name属性的值即代表``` image ```, topology通过此属性来判断渲染的是否是图片。
  image属性的值即是图片的地址。

  ```js
  {
    group: '自定义图片',
    children: [
      {
        name: 'image',
        icon: 'icon-image',
        data: {
          text: '',
          rect: {
            width: 100,
            height: 100
          },
          name: 'image',
          image: require('./machine.jpg')
        }
      },
    ]
  }
  ```

  ### 支持在线图片添加的功能

  如果觉得使用本地图片麻烦, 我们可以换成在线的图片。


  ![](https://imgkr2.cn-bj.ufileos.com/8d2e8edf-27cb-42fb-90d8-c46ec648864b.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=0%252BjftKIrC%252B1WNhF7w21YVTzqAlo%253D&Expires=1603901568)

  首先我们根据图片的url得出base64.

  ```js
  function getBase64(url, callback) {
    var Img = new Image(),
      dataURL = '';
    Img.src = url + '?v=' + Math.random();
    Img.setAttribute('crossOrigin', 'Anonymous');
    Img.onload = function () {
      var canvas = document.createElement('canvas'),
        width = Img.width,
        height = Img.height;
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(Img, 0, 0, width, height);
      dataURL = canvas.toDataURL('image/jpeg');
      return callback ? callback(dataURL) : null;
    };
  }
  ```

  最后通过``` onDrag ``` 方法将在线的图片拖到画布上即可。

  ```js
  const onDrag = (event, image) => {
    event.dataTransfer.setData(
      'Text',
      JSON.stringify({
        name: 'image',
        rect: {
          width: 100,
          height: 100
        },
        image
      })
    );
  };
  ```

  ### 支持新建文件, 打开文件, 导出json, 保存png与svg
  
  ![](https://imgkr2.cn-bj.ufileos.com/c672f34a-1788-4f22-8437-0828ea355eff.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=X9hsJuAj9CO685JQiY3jIsJ%252BObg%253D&Expires=1603901586)


  - 新建一个空的画板

    ```js
      canvas.open({ nodes: [], lines: [] });
    ```

  - 打开已有图形的文件

    ```js
    const onHandleImportJson = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = event => {
        const elem = event.srcElement || event.target;
        if (elem.files && elem.files[0]) {
          const reader = new FileReader();
          reader.onload = e => {
            const text = e.target.result + '';
            try {
              const data = JSON.parse(text);
              canvas.open(data);
            } catch (e) {
              return false;
            } finally {

            }
          };
          reader.readAsText(elem.files[0]);
        }
      };
      input.click();
    }
    ```

  - 将画好的图保存为json文件

    ```js
    import * as FileSaver from 'file-saver';

    FileSaver.saveAs(
      new Blob([JSON.stringify(canvas.data)], { type: 'text/plain;charset=utf-8' }),
      `le5le.topology.json`
    );
    ```

  - 保存为png文件

    ```js
    canvas.saveAsImage('le5le.topology.png');
    ```

  - 保存为SVG文件

    ```js
    const onHandleSaveToSvg = () => {
      const C2S = window.C2S;
      const ctx = new C2S(canvas.canvas.width + 200, canvas.canvas.height + 200);
      if (canvas.data.pens) {
        for (const item of canvas.data.pens) {
          item.render(ctx);
        }
      }
      let mySerializedSVG = ctx.getSerializedSvg();
      mySerializedSVG = mySerializedSVG.replace(
        '<defs/>',
        `<defs>
      <style type="text/css">
        @font-face {
          font-family: 'topology';
          src: url('http://at.alicdn.com/t/font_1331132_h688rvffmbc.ttf?t=1569311680797') format('truetype');
        }
      </style>
    </defs>`
      );
      mySerializedSVG = mySerializedSVG.replace(/--le5le--/g, '&#x');
      const urlObject = window.URL || window;
      const export_blob = new Blob([mySerializedSVG]);
      const url = urlObject.createObjectURL(export_blob);
      const a = document.createElement('a');
      a.setAttribute('download', 'le5le.topology.svg');
      a.setAttribute('href', url);
      const evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, true);
      a.dispatchEvent(evt);
    }
    ```

  - 撤销、恢复、复制、剪切、粘贴

    ```js
      canvas.undo(); // 撤销
      canvas.redo(); // 恢复
      canvas.copy();  // 复制
      canvas.cut(); // 剪切
      canvas.paste(); // 粘贴
    ```


  ### 支持节点外观属性(位置大小边距, 边框样式, 字体样式)的设置

  ![](https://imgkr2.cn-bj.ufileos.com/eb623063-ce74-4f94-8d40-7cc9aa7aff2e.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=AHD1XWAJw0%252BSqgWz%252Bx6XPNYBug8%253D&Expires=1603901611)


  - 节点的位置和大小

  ```js
  const renderForm = useMemo(() => {
    return <Form>
      <Row>
        <Col span={12}>
          <Form.Item label="X(px)">
            {getFieldDecorator('x', {
              initialValue: x
            })(<InputNumber />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Y(px)" name="y">
            {getFieldDecorator('y', {
              initialValue: y
            })(<InputNumber />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="宽(px)" name="width">
            {getFieldDecorator('width', {
              initialValue: width
            })(<InputNumber />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="高(px)" name="height">
            {getFieldDecorator('height', {
              initialValue: height
            })(<InputNumber />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="角度(deg)" name="rotate">
            {getFieldDecorator('rotate', {
              initialValue: rotate
            })(<InputNumber />)}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }, [x, y, width, height, rotate, getFieldDecorator]);
  ```

  - 边框样式

  ```js
  const renderStyleForm = useMemo(() => {
    return <Form>
      <Row>
        <Col span={24}>
          <Form.Item label="线条颜色">
            {getFieldDecorator('strokeStyle', {
              initialValue: strokeStyle
            })(<Input type="color" />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="线条样式">
            {getFieldDecorator('dash', {
              initialValue: dash
            })(
              <Select style={{ width: '95%' }}>
                <Option value={0}>_________</Option>
                <Option value={1}>---------</Option>
                <Option value={2}>_ _ _ _ _</Option>
                <Option value={3}>- . - . - .</Option>
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="线条宽度">
            {getFieldDecorator('lineWidth', {
              initialValue: lineWidth
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }, [lineWidth, strokeStyle, dash, getFieldDecorator]);
  ```

  - 字体设置

  ```js
  const renderFontForm = useMemo(() => {
    return <Form>
      <Col span={24}>
        <Form.Item label="字体颜色">
          {getFieldDecorator('color', {
            initialValue: color
          })(<Input type="color" />)}
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="字体类型">
          {getFieldDecorator('fontFamily', {
            initialValue: fontFamily
          })(<Input />)}
        </Form.Item>
      </Col>
      <Col span={11} offset={1}>
        <Form.Item label="字体大小">
          {getFieldDecorator('fontSize', {
            initialValue: fontSize
          })(<InputNumber />)}
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="内容">
          {getFieldDecorator('text', {
            initialValue: text
          })(<TextArea />)}
        </Form.Item>
      </Col>
    </Form>
  }, [color, fontFamily, fontSize, text, getFieldDecorator])
  ```

  当我们对表单里面的每一项都进行修改时, 都会调用``` onFormValueChange ``` 方法去改变对应节点的属性。最后将修改后的节点, 更新到画布上。

  ```js
  if (changedValues.node) {
    // 遍历查找修改的属性，赋值给原始Node
    for (const key in changedValues.node) {
      if (Array.isArray(changedValues.node[key])) {
      } else if (typeof changedValues.node[key] === 'object') {
        for (const k in changedValues.node[key]) {
          selected.node[key][k] = changedValues.node[key][k];
        }
      } else {
        selected.node[key] = changedValues.node[key];
      }
    }
  }
  canvas.updateProps(selected.node);
  ```

  ### 支持节点的数据属性

  在实际的业务开发中, 难免会出现默认Node节点上的属性不够用的情况, 或者节点上有特定的业务数据。那么这个时候, 我们可以将这些特殊的数据存在节点的自定义数据字段。

  ```js
  const renderExtraDataForm = useMemo(() => {
    return <Form >
      <Col>
        <Form.Item label="自定义数据字段">
          {getFieldDecorator('data', {
            initialValue: JSON.stringify(extraFields) 
          })(<TextArea rows={10} />)}
        </Form.Item>
      </Col>
    </Form>
  }, [extraFields, getFieldDecorator])
  ```

  > 注意: Le5leTopology.Node节点默认是没有data这个属性的.

  ### 支持节点自定义事件的功能

  
![](https://imgkr2.cn-bj.ufileos.com/29239865-f01c-464a-923f-4c7e85ce8ab9.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=UHxg06l75GlghbHlVGMkY%252BBB6Xk%253D&Expires=1603901629)

  由上图可知, 节点的事件分为事件类型和事件行为两部分。事件类型可以分为: 1.单击事件 2.双击事件 3.websocket事件 4.mqtt事件。事件行为可以分为:
  1.跳转链接 2.执行动画 3.执行函数 4.执行window下的全局函数 5.更新属性数据。

  Node节点中自定events属性, 因此根据[文档](https://www.yuque.com/alsmile/topology/pen)中各个属性的枚举值, 我们可以很简单的绘制出各个事件类型与事件行为的对应关系。具体的代码由于篇幅限制, 就不粘贴了。有兴趣的同学可以阅读[对应的源码](https://github.com/Summer-andy/topology-react/blob/master/src/Layout/component/nodeComponent/EventComponent/index.js).接下来, 我来演示一下如何对节点进行单击事件与websocket事件的绑定。

  - 单击执行自定义函数

  ![](https://imgkr2.cn-bj.ufileos.com/80217fb5-3fc3-4aa5-b10f-6afecb41c44b.gif?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=eWQVlm7wOqfFztYVbzAMq1VEGtc%253D&Expires=1603901646)


   查看上图动画, 我们可以发现, 每次点击图形, 都会输出``` 我是自定义函数 ```。那么在我们的编辑器上, 该如何配置呢？

  ![](https://imgkr2.cn-bj.ufileos.com/67fd0e64-8072-49cb-8c5e-4a46a8407c86.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=8hglokmvVu3ZLqlUXSJXxWUMFFk%253D&Expires=1603901660)



  - 接收来自于websocket的值

  我们通过websocket往服务器发送一个信号, 同时将会接收对应的值。首先我们需要事先连接好ws服务器。
  
  ```js
  canvas.openSocket('ws://123.207.136.134:9010/ajaxchattest');
  ```

  这一步很关键, 否则之后的流程都将会报错。

  然后我们新增一个拥有点击事件的节点, 模拟信号的发起。

  ![](https://imgkr2.cn-bj.ufileos.com/9957b09c-8ff4-46a7-9ee9-23a539ecaffc.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=7qKXbKTPRrDpZm3iAwpB%252BJczDhg%253D&Expires=1603901671)


  最后我们定义一个节点用于接收websocket返回的值。

 ![](https://imgkr2.cn-bj.ufileos.com/3271f85e-5a55-4ad8-82c4-a428fee93aeb.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=%252BsXeFHZbx6NcWxHgvsroHLAvWfc%253D&Expires=1603901680)


  接下来, 我们可以点击预览按钮, 测试我们配置的代码对不对。

  ![](https://imgkr2.cn-bj.ufileos.com/9eab10b9-e921-40e3-8ef4-5cf064feba0d.gif?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=%252Bk5z4v3STttw0xUU4itHOOud3jU%253D&Expires=1603901689)



  ### 支持线条的样式修改

  ![](https://imgkr2.cn-bj.ufileos.com/a0c6ef59-717d-4b9e-97a3-4aa1d04bb6af.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=eOTuRdb9JhXh9gJdOXLgmDtGgmk%253D&Expires=1603901698)


  目前只支持上图几种属性的设置。线条的更新与节点的更新类似, 我们直接修改线条的属性, 然后通过``` updateProps ``` 更新对应线条的样式。

  ```js
  const onHandleLineFormValueChange = useCallback(
    (value) => {
      const { dash, lineWidth, strokeStyle, name, fromArrow, toArrow, ...other } = value;
      const changedValues = {
        line: { rect: other, lineWidth, dash, strokeStyle, name, fromArrow, toArrow }
      };
      if (changedValues.line) {
        // 遍历查找修改的属性，赋值给原始line
        for (const key in changedValues.line) {
          if (Array.isArray(changedValues.line[key])) {
          } else if (typeof changedValues.line[key] === 'object') {
            for (const k in changedValues.line[key]) {
              selected.line[key][k] = changedValues.line[key][k];
            }
          } else {
            selected.line[key] = changedValues.line[key];
          }
        }
      }
      canvas.updateProps(selected.line);
    },
    [selected]
  );
  ```

  ### 支持预览功能

  当我们编辑完图形后, 需要预览。那么我们可以将画布上的数据通过路由传参(state)传递到新的页面, 最后通过new Topology重新生成一块画布, 将图形渲染上去。

  ```js
    let reader = new FileReader();
    const result = new Blob([JSON.stringify(canvas.data)], { type: 'text/plain;charset=utf-8' });
    reader.readAsText(result, 'text/plain;charset=utf-8');
    reader.onload = (e) => {
      history.push({ pathname: '/preview', state: { data: JSON.parse(reader.result) } });
    }
  ```

  ### 支持锁定,设置全局线的起始和终止箭头

  - 锁定

  ```js
  canvas.lock(2)
  ```

  - 解锁

  ```js
  canvas.lock(0)
  ```
  
  - 设置默认的连线类型

  ```js
  const onHandleSelectMenu = data => {
    setLineStyle(data.item.props.children);
    canvas.data.lineName = data.key;
    canvas.render();
  }
  ```

  - 设置默认的连线起始箭头

  ```js
  const onHandleSelectMenu1 = data => {
    setFromArrowType(data.item.props.children);
    canvas.data.fromArrowType = data.key;
    canvas.render();
  }
  ```

  - 设置默认的连线终止箭头

  ```js
  const onHandleSelectMenu2 = data => {
    setToArrowType(data.item.props.children);
    canvas.data.toArrowType = data.key;
    canvas.render();
  }
  ```

  ### 支持自动排版功能

  如果画出的图形比较乱, 那么可以使用自动居中的功能。首先我们通过 ``` rect.calcCenter(); ``` 获取当前图形的中心点,  然后我们计算出画布中心点与当前图形的中心点的差值,
  最后通过调用  ``` canvas.translate(x, y) ``` 方法对图形进行平移。

  ```js
    const onHandleFit = () => {
      const rect = canvas.getRect();
      rect.calcCenter();
      x = document.body.clientWidth / 2 - rect.center.x;
      y = (document.body.clientHeight - 66) / 2 - rect.center.y;
      canvas.translate(x, y);
    };
  ```

## 结尾

   虽然[Topology](https://www.yuque.com/alsmile/topology/about)的官网有各个API的详细说明, 但是从API转化到实际业务中, 还是需要耗费蛮多时间。其次官方的React版本写的比较复杂对于新手上手的成本比较高, 因此就萌生了想要写一版简单的```topology-react``` 帮助大家快速上手。

   最后的最后, 感谢[Alsmile](https://github.com/Alsmile)开源的绘图引擎。如果对你有帮助, 别忘了给一个小小的[star](https://github.com/Summer-andy/topology-react)哦, 谢谢啦~
   
  ![](https://imgkr2.cn-bj.ufileos.com/888422c9-6650-4783-965e-e44662938a7e.jpg?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=RkEupJdxNdmF8P1peiti1ITB%252FaM%253D&Expires=1603901954)
