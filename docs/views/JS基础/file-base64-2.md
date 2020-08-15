---
title: 基于Base64的探索与实践
date: 2020-04-20
tags:
  - js基础
categories:
  - 前端基础
---

## 前言

::: tip
 咱们接着上一章的话题,继续讨论一下我们前端拿到 Base64 后的数据如何处理它,并且让它正确无误的显示在我们眼前。本文将会以 txt 文件为例,来详细讲解一下转化过程以及一些需要注意的地方。
:::
### 来吧亮出你的 base64。
   base64: 哈哈这就是我,你们知道我的真身是啥不？

```js
dHh05paH5Lu2
```

### 初尝解密

我们都知道atob方法可以帮我们解码base64的字符串,但是你以为真的那么简单么？
我们来试试看atob方法到底能不能帮我们识别这个base64?

```js
var str = 'dHh05paH5Lu2'
window.atob(str)
// "txtæä»¶"
```

啊, 我们失败了,txt后面的是啥呀?该不会这个atob方法还有其他手法,让我们传utf-8等编码规则进去吧, 我们打开MDN上的文档, 发现这个函数只有一个地方入参呀, 我去, 那这个方法不是坑我了么？我们仔细查看它的文档,发现他是不支持中文字符传输的。那怎么办呢？当然如果你只是想单纯的输出中文的话, 那么你可以用encodeURIComponent, decodeURIComponent方法来转义中文字符, 但是我们要的不仅仅是这样, 我们的目标是星辰大海(txt文件预览)。

### 大步向前走

我们需要再次明确我们的目标: 星(txt文)辰(件)大(预)海(览), 因此我们可以考虑使用URL.createObjectURL这个API,它可以用来创建URL的File对象, Bolb对象,  MediaSource对象。很明显这里最适合我们的就是Blob对象了,我们可以在MDN上查阅到Blob接收二个参数。

``` js
      var aBlob = new Blob( array, options );
```

首先第一个参数是array 是由ArrayBuffer, ArrayBufferView, Blob, DOMString 等对象构成的 Array。而第二个参数options中有二个属性, 一般我们只用到了第一个属性 type, 默认值为 ""，它代表了将会被放入到blob中的数组内容的MIME类型。 如果你的文件类型是txt的那么这个type的为"text/plain;charset=utf-8", 如果是图片类型那么type就是"image/jpeg"...具体哪种文件类型对应哪种MIME类型可以自行去手册查看,这里就不做详细讨论了。我们这里来关注一下第一个参数array,我们解密base64字符串后获得是二进制的数据或者字符串。那么如果我们需要操作这个二进制数据, 首先我们必须定义一个缓冲区ArrayBuffer, 该缓冲区用于存储各种类型化数组的数据。是最基础的原始数据容器，无法直接读取或写入，我们需用通过视图来操作它。可能有的同学到这里会比较困惑了, 什么是ArrayBuffer, 什么是视图。

#### ArrayBuffer: ArrayBuffer是一个固定长度的字节序列, 我们通常使用new ArrayBuffer(length)来创建一个空间, 他的内存分配是连续的与普通的Array不太一样。由于ArrayBuffer是连续的内存,因此对于那种高密度的访问比如音频数据会比普通的Array快很多。

#### 视图(TypedArray): ArrayBuffer作为内存区域,可以存放多种数据类型。不同类型的数据有不同的存储方式,这就叫做视图。目前js暂且只支持11种视图,

- Int8Array：8位有符号整数，长度1个字节。
- Uint8Array：8 位无符号整数（超出范围后从另一边界循环），长度1个字节。
- Uint8ClampedArray: 8 位无符号整数（超出范围后为边界值)，长度1个字节。
- ...

一般我们的最小单位都是一字节, 我们就选用Uint8Array作为我们视图。

``` js
const buf = new ArrayBuffer();
const view = new Uint8ClampedArray(buf);
```
      
然后我们需要在转化过程保证补码的一致性, 因此我们需要对每一位进行&0xff

``` js
for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
}
```

现在让我们把前面零散的东西给串起来

``` js
const s2ab = s => {
const buf = new ArrayBuffer(s.length);
const view = new Uint8ClampedArray(buf);
for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
}
return buf;
};

const blob = new Blob([s2ab(window.atob('dHh05paH5Lu2'))], { type: 'text/plain;charset=utf-8' });
```

最后我们使用createObjectURL方法创建一个生成一个媒体资源, 并且我们使用a标签模拟跳转预览。

```js
const url = URL.createObjectURL(blob);
const tempLink = document.createElement('a');
tempLink.style.display = 'none';
tempLink.href = url;
tempLink.setAttribute('target', '_blank');
document.body.appendChild(tempLink);
tempLink.click();
document.body.removeChild(tempLink);
window.URL.revokeObjectURL(url);
```

我们可以看到其实页面显示的还是乱码, 那么如何解决呢？本文将会提供一种思路, 首先在上一节,我们已经知道了, base64加密后的字符串是可以被解密的。那么我们在解密后的字符串前面加一个字节顺序标记。他的英文名也叫做BOM.注意这个BOM不是MES里面的BOM哦，这里面的BOM(Byte Order Mark)指的是文件编码头，即 字节顺序标记。BOM用于标记一个文本文件使用Unicode编码，其本身是一个Unicode字符（"\uFEFF"），位于文本文件头部。可能有的同学在Blob里面的第二个参数改为text/json,虽然在mac环境下没问题, 但是在windows环境却还是乱码。以下是所有代码(经测试在任何环境下都能正常显示)

``` js
const s2ab = s => {
const buf = new ArrayBuffer(s.length);
const view = new Uint8ClampedArray(buf);
for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff;
}
return buf;

};

const blob = new Blob([s2ab(atob(Base64.encode(`\ufeff${Base64.decode('dHh05paH5Lu2')}`)))], { type: 'text/plain;charset=utf-8' });

const url = URL.createObjectURL(blob);

const tempLink = document.createElement('a');
tempLink.style.display = 'none';
tempLink.href = url;
tempLink.setAttribute('target', '\_blank');
document.body.appendChild(tempLink);
tempLink.click();
document.body.removeChild(tempLink);
window.URL.revokeObjectURL(url);

```
