---
title: css 常用选择器用法
date: 2019-09-21
tags:
 - css
categories:
 - 前端基础
---

### before 和 after 选择器

```html
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8 />
<title>before、after</title>
<style>
.box h3{
text-align:center;
position:relative;
top:80px;
}
.box {
width:70%;
height:200px;
background:#FFF;
margin:40px auto;
}

.effect{
position:relative;
box-shadow:0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
}

.effect::before, .effect::after{
content: "";
position:absolute;
z-index: -1;
box-shadow:0 0 20px rgba(0,0,0,0.8);
top:50%;
bottom:0;
left:10px;
right:10px;
-moz-border-radius:100px / 10px;
border-radius:100px / 10px;
}
/* ::before和::after这两个主要用来给元素的前面或后面插入内容，这两个常和"content"配合使用，使用的场景最多的就是清除浮动 */

</style>
</head>
<body>
<div class="box effect">
<h3>Shadow Effect </h3>
</div>
</body>
</html>
```

### checked 选择器

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<style>
form {
  border: 1px solid #ccc;
  padding: 20px;
  width: 300px;
  margin: 30px auto;
}

.wrapper {
  margin-bottom: 10px;
}

.box {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  position: relative;
  border: 2px solid orange;
  vertical-align: middle;
}

.box input {
  opacity: 0;
  position: absolute;
  top:0;
  left:0;
}

.box span {
  position: absolute;
  top: -10px;
  right: 3px;
  font-size: 30px;
  font-weight: bold;
  font-family: Arial;
  transform: rotate(30deg);
  color: orange;
}

input[type="checkbox"] + span {
  opacity: 0;
}

input[type="checkbox"]:checked + span {
  opacity: 1;
}

/* 加号是指选择相邻兄弟的选择器,他们都有同一个父亲 */
</style>
<body>
    <form action="#">
        <div class="wrapper">
          <div class="box">
            <input type="checkbox" checked="checked" id="usename" /><span>√</span>
          </div>
          <lable for="usename">我是选中状态</lable>
        </div>

        <div class="wrapper">
          <div class="box">
            <input type="checkbox"  id="usepwd" /><span>√</span>
          </div>
          <label for="usepwd">我是未选中状态</label>
        </div>
      </form>
</body>
</html>


```

### child 选择器

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<style>
 ol > li {
   height: 100px;
   width: 100%;
 }

 ol > li:first-child{
   background: red;
   color: wheat
 }

 ol > li:nth-child(3n) {
   background: salmon
 }

 ol > li:last-child{
   background: darkmagenta;
   color:cyan
 }

 ol > li:nth-last-child(2) {
  background: black
 }
</style>
<body>
    <ol>
      <li><a href="##">Link1</a></li>
      <li><a href="##">Link2</a></li>
      <li><a href="##">link3</a></li>
      <li><a href="##">Link1</a></li>
      <li><a href="##">Link2</a></li>
      <li><a href="##">link3</a></li>
      <li><a href="##">Link1</a></li>
      <li><a href="##">Link2</a></li>
      <li><a href="##">link3</a></li>
    </ol>
</body>
</html>

```

### empty 选择器

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<style>
p{
  height: 100px;
  width: 100px;
}

p:empty {
  display: none;
}

/* p标签下如果没东西就给其对应的属性,注意空格不算empty哦！ */
</style>
<body>
  <p>我这里有东西</p>
  <p> <!-- 我这里没有东西 --></p>
  <p></p>
  <!-- 我这里没有东西 -->
</body>
</html>

```

### enabled 和 disabled 选择器

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<style>

div {
  margin: 20px;
}

input[type = "text"]:enabled {
  border: 1px solid red;
  background: darkcyan;
  color: rebeccapurple;
}

input[type = 'text']:disabled {
  background: salmon
}

</style>
<body>
  <form action="#">
    <div>
      <label for="name">Text Input:</label>
      <input type="text" name="name" id="name" placeholder="可用输入框" />
    </div>
     <div>
      <label for="name">Text Input:</label>
      <input type="text" name="name" id="name" placeholder="禁用输入框"  disabled="disabled" />
    </div>
  </form>
</body>
</html>

```

### not 选择器

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<style>
div {
  width: 100px;
  height: 100px;
}
div:not([id = "page"]) {
 background: red
}

/* 否定选择器 */

</style>
<body>
  <div id="header">页头</div>
  <div id="page">页体</div>
  <div id="footer">页脚</div>
</body>
</html>

```

### only 选择器

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<style>
.wrapper  > p:only-child {
background: red;
}
.wrapper > div:only-of-type {
  background: darkgoldenrod
}
</style>
<body>
    <div class="wrapper">
        <p>我是一个段落</p>
        <p>我是一个段落</p>
        <p>我是一个段落</p>
        <div>我是一个Div元素</div>
      </div>
      <div class="wrapper">
        <p>我是一个段落</p>
      </div>
</body>
</html>

```

### property 选择器

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<style>
a[class^=icons] {
  background: red
}
/* 匹配所有a标签下的类名中以icons开头的元素 */

a[href$=pdf] {
  background: greenyellow
}

/* 与^=的作用相反,匹配a标签下href属性内的以pdf结尾的元素 */

a[title*=andy] {
  background: fuchsia
}

/* 匹配title中包含andy字符串的元素,不必在乎开头结尾,只是包含 */

</style>
<body>
  <a href="1.pdf">这是pdf文件</a>
  <a href="" class="iconsss" >我的class是icon</a>
  <a href="" title="我的title是andy">我的title是andy</a>
</body>
</html>


```

### root 选择器

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<style>
:root {
  background: red
}
/* 根元素选择器, 其作用效果等同于html { background: :red } */
</style>
<body>
  <h1>我是h1文字</h1>
</body>
</html>


```

### selection 选择器

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<style>
.one ::selection {
  background: salmon;
  color: aqua
}

.three input[type = 'text']:read-only {
  background: rosybrown;
  color: #fff
}

.three input[type = 'text']:read-write {
  background: seagreen;
  color: #fff
}

</style>
<body>
  <div class="one"><p>伪类元素是用来突显元素的</p></div>
  <div class="two"><p>伪类元素是用来突显元素的</p></div>
  <div class="three"><input type="text" name="address" id="address" placeholder="中国上海" readonly="readonly" /></div>
  <div class="three"><input type="text" name="address" id="address" placeholder="中国上海"  /></div>
</body>
</html>

```

### target 选择器

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<style>
#brand:target {
  background: red
}
/* 用于匹配文档中某个标志符号的目标元素 */
</style>
<body>
  <h2><a href="#brand">Brand</a></h2>
  <div class="menuSection" id="brand">
    content for Brand
  </div>
  <h2><a href="#jake">Brand</a></h2>
  <div class="menuSection" id="jake">
  content for jake
  </div>
  <h2><a href="#aron">Brand</a></h2>
  <div class="menuSection" id="aron">
      content for aron
  </div>
</body>
</html>

```

### type 选择器

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<style>
.wrapper > p:first-of-type {
  color: blueviolet;
}
.wrapper > div:nth-of-type(2n) {
  background: salmon
}
.wrapper > p:last-of-type {
  color: seagreen
}

</style>
<body>
    <div class="wrapper">
        <p>我是第一个段落</p>
        <p>我是第二个段落</p>
        <div>我是第一个Div元素</div>
        <div>我是第二个Div元素</div>
        <p>我是第三个段落</p>
        <p>我是第四个段落</p>
        <div>我是第三个Div元素</div>
        <div>我是第四个Div元素</div>
    </div>
</body>
</html>

```
