---
title: 如何构建一套简易的可视化物流监控地图
date: 2020-08-27
tags:
  - React基础
categories:
  - React
---


## 前言
  
  前些日子刚刚好也在做可视化监控相关的项目, 刚刚好想借着掘金的技术专题来跟大家分享一下整个搭建过程。
  可视化编辑器如下:

  ![image](./img/map.png)


## 技术栈

  - React: 前端主流框架(react,vue,angular)之一,更适合开发灵活度高且复杂的应用
  - Ant Design: The world's second most popular React UI framework, 一般是React开发的标配UI库
  - Topology: 一款开源的基于canvas+typescript的绘图引擎


## 项目背景
 
   在自动化程度高的工厂中, 我们需要监控当前机器人或者小车的运行情况。但是由于不同的硬件供应厂商提供的地图接口信息可能会不一样(比如坐标系不一样, 机器人的角度计算规则不一样), 因此我们需要做的就是将所有不同型号的机器人或者小车都整合到一张地图中, 同时监控所有机器人的运行情况。