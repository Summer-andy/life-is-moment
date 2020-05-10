---
title: 基于Antd表单的思考
date: 2020-05-10
tags:
 - 随笔记录
categories:
 - 前端基础
---

:::tip
贺兰山的积雪融化着,

腾格里的沙子飘飞着。 

额济纳的胡杨挺拔着,

巴丹吉林的黑城屹立着。

只有骆驼还在迁徙,

骏马还在奔腾,

鸿雁在返乡的路上,

牧人在孤独地彷徨。
:::

## 前言 
   在后台管理系统开发的过程中,各种按钮、输入框、表格等控件的使用频率是非常高的。那么当组件库的控件不太满足我们的业务的时候, 我们就需要自己改造一下组件。本文是我在开发过程中对于Table组件的一些思考。


### 示例1
  
  ![image](./imgs/table1.png)
  
   当数据源的格式长度都不能确定的时候,往往会出现上图的情况，表格不规整,并且由于某一个数据特别的长,导致表格的高度拉长,原本一页可以显示20条表格数据的, 结果现在可能只能显示10几条数据了。假如Age字段是关键信息, 那么按照上图这么显示,是不是会影响我们的观感呢,等等一系列的问题都会让我们的系统变的很不Nice。不好的地方我也不多说了, 我们直接开始进入正题吧。


   我先说一下我的个人想法:
   当我们能确定表格某一列大致宽度的时候, 我们尽量定个宽度。那么很多时候,对于某些字段的宽度我们是确定不了的。那么这个时候，我们该如何处理呢？
  
   - 获取Table的宽度
   - 计算出已经定义宽度的column的宽度总和, 由于antd的table中td自带padding 左右各16px,因此我们算的时候需要加上32px
   - 计算未设置column的数量
   - 计算出未设置column合适的宽度

  ```js
    const arr = []; // 定义一个数组存储新的column
    const totalWidth = document.getElementById(uuid) ? document.getElementById(uuid).clientWidth : 80; // 计算Table的宽度
    const hasWidth = props.columns.reduce((pre,cur) => { return (cur.width + 32 || 0) + pre }, 0); // 计算已有宽度总和(32是每个td内容前后padding各16)
    const hasNoWidthNumber = props.columns.filter(item => !item.width).length; // 计算未设置width的columns数量
    const columnWidth = parseInt((totalWidth - hasWidth) / hasNoWidthNumber, 10) - 32; // 计算出column的宽度

    props.columns.forEach(element => {
      if (!element.render) {
        element['render'] = ele => {
          if (element.showOverflowTooltip === false) {
            return ele;
          }
          return (
            <Tooltip placement="leftTop" title={ele}>
              <div
                style={{
                  width: element.width || columnWidth,
                  ...columnStyle
                }}
              >
                {ele}
              </div>
            </Tooltip>
          );
        };
      }
      arr.push(element);
    });
  ```



  我们来看一下效果:

  ![image](./imgs/table2.png)

  我们将Name和Age这种能够确定的定宽后, 让剩余不确定column宽度的Address和Tags按照我们的算法给他适合的宽度。当Address或者Tags中的内容很长的时候, 他会自动的帮我们添加省略号,并且当我们鼠标移入的时候, 可以显示tooltip看到所有的内容。

  似乎我们最开始的问题已经得以解决。那么我们来思考一个问题,实现这个效果最关键的点在哪儿呢？是表格内容宽度的计算，也就是columnWidth的计算。因此问题点就来了,columnWidth的值是依赖当前表格显示的宽度, 那么当我们拉伸界面的时候, Table的宽度高度也会发生变化。那么这个columnWidth的值 是不是应该也要随之变化呢？这会导致一个问题,我们需要实时监听Table的尺寸,那么这不是很消耗性能么？还有一个问题,如果内容的宽度没有超过columnWidth, 我们最好不显示Tooltip, 那么我们必须在Dom渲染前就要判断好, 当前td是否需要用到Tooltip组件。对于这个问题, 我们可以参考一下element-ui的设计。