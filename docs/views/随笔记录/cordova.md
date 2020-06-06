<!-- ---
title: 基于Cordova插件开发webApp最佳实践
date: 2020-04-27
tags:
 - 随笔记录
categories:
 - 前端基础
---

### 前言:
    
  ```js
  configurations.all {
  resolutionStrategy.eachDependency { DependencyResolveDetails details ->
        def requested = details.requested
        if (requested.group == 'com.android.support') {
            if (!requested.name.startsWith("multidex")) {
                details.useVersion '26.0.0'
            }
        }
    }
  }
  ``` -->
