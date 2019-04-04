#### electron是什么？ 

electron是由Github开发，用HTML，CSS和JavaScript来构建跨平台桌面应用程序的一个开源库。Electron通过将Chromium和Node.js合并到同一个运行时环境中，并将其打包为Mac，Windows和Linux系统下的应用来实现这一目的。

#### 解读github上初始化项目的文件目录结构：
- index.html  当了index.html就是渲染进程啦！
- main.js    该文件对应package.json对应的入口,因此main.js执行的脚本进程为主进程
- package.json   一些安装依赖的配置文件
- 其他的文件都是没有什么软用的!
  
#### 解读main.js里面的程序代码：
- ```  const {app, BrowserWindow} = require('electron')  ```  app：控制应用程序的事件的生命周期，当然控制的肯定是主进程啦！BrowserWindow: 创建和控制浏览器的窗口
- ``` app.on('ready', createWindow) ``` 当electron初始化之后执行createWindow,接下里我们看看createWindow里面究竟干了什么事情？
- ``` new BrowserWindow({ width: 800, height: 600, webPreferences: { nodeIntegration: true }}) ``` 首先他定义了宽为800,高为600的浏览器,至于nodeIntegration: true是指在electron内置浏览器里面可以有module和require全局变量
- ```   mainWindow.loadFile('index.html') ``` 加载index.html页面
- ```   mainWindow.on('closed', function () {   mainWindow = null }) ``` 当关闭electron窗口的时候触发, 一般用于删除对已经关闭的窗口的引用对象和避免再次使用它.
- ``` app.on('window-all-closed', function() {  app.quit() }) ``` 当窗口全部关闭时, 终止整个进程
- ``` app.on('acvitate', function() {   createWindow() }) ```  当应用被激活时发出。 各种操作都可以触发此事件, 例如首次启动应用程序、尝试在应用程序已运行时或单击应用程序的坞站或任务栏图标时重新激活它