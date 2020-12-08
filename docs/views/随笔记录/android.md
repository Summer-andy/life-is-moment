---
title: 安卓打包常见错误汇总
date: 2020-12-08
tags:
 - 随笔记录
categories:
 - 前端基础
---

## Manifest相关的错误

   ```java
   Manifest merger failed : Attribute meta-data#android.support.VERSION@value value=(25.4.0) from [com.android.support:appcompat-v7:25.4.0] AndroidManifest.xml:28:13-35
	 is also present at [com.android.support:support-v4:26.1.0] AndroidManifest.xml:28:13-35 value=(26.1.0).
	 Suggestion: add 'tools:replace="android:value"' to <meta-data> element at AndroidManifest.xml:26:9-28:38 to override
   ```
   
   解决方案: 

   在build.gradle中加入

   ```java
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
   ```
