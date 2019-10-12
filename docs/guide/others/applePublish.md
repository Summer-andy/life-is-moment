### 使用apple开发者证书和发布证书完成app从打包到提交审核的一系列流程


#### 本文参考[Dcloud官方文档](https://ask.dcloud.net.cn/docs/#/ask.dcloud.net.cn/article/152),由于DCloud的官方文档有些步骤写的比较模糊并且步骤的截图(apple官网网站)也是很早之前的。为了节省大家的打包提交审核时间,我打算在官方文档的基础上,进一步优化一下。

#### 前置准备
  - apple开发者账号, 并且加入了“iOS Developer Program”(注意角色需要是)
  - mac电脑(用于生成p12文件)
  
#### 登录ios Dev Center
  - [打开IOSDevCenter](https://developer.apple.com)
  - 登录成功后,滑到底部可以看到 ![image](./imgs/apple1.jpg)
  - 点击红色部分后我们可以看到 ![image](./imgs/apple2.jpg)
  - 在左侧我们可以看到我们创建的证书,appleId,设备,描述文件等等 ![image](./imgs/apple3.jpg)
  
#### 申请Apple ID
  - [此步骤可以参考DCloud申请Apple ID](https://ask.dcloud.net.cn/docs/#/ask.dcloud.net.cn/article/152)

#### 生成证书请求文件
  - 不管是申请开发(Development)证书还是发布(Distribution)证书，都需要使用证书请求(.certSigningRequest)文件，证书请求文件需在Mac OS上使用“Keychain Access”工具生成。
  - 在“Spltlight Search”中搜索“Keychain”并打开“Keychain Access”工具
  - 打开菜单“Keychain Access”->“Certificate Assistant”，选择“Request a Certificate From a Certificate Authority...” ![image](./imgs/apple4.jpg)
  - 打开创建请求证书页面，在页面中输入用户邮件地址(User Email Address)、证书名称(Common Name)，请求类型（Request is）选择保存到磁盘(Saved to disk). 我一般保存在桌面, 因为找起来方便。 ![image](./imgs/apple5.jpg) ![image](./imgs/apple6.jpg)
  - 我们可以在桌面上看到证书请求文件 ![image](./imgs/apple7.jpg)

#### 申请开发证书和描述文件(只能用于打包生成ipa文件,不能用于后续构建apple应用)
  - [此步骤可以参考DCloud申请开发者证书](https://ask.dcloud.net.cn/docs/#/ask.dcloud.net.cn/article/152)

#### 申请发布证书和描述文件(可以用于打包生成ipa文件也可以用于后续构建apple应用)
  - [此步骤可以参考DCloud申请发布证书](https://ask.dcloud.net.cn/docs/#/ask.dcloud.net.cn/article/152)

#### 总结: 其实苹果上架审核这一整套下来还是稍微有点繁琐。但是呢, 只要我们搞清楚审核需要什么文件,以及文件之间的对应关系。大部人构建apple或者打包apple应用大部分出现的问题, 都是证书和描述文件没有对应好。我简单总结一下: 1.先创建证书后创建描述文件 2.创建描述文件的时候关联证书。证书和描述文件就是靠这一步对应好的 3.每个app 都只能绑定一个apple id 4.提交审核构建app的时候, 一定要用发布证书和描述文件来打包app 5. 打包的时候一定要改一下版本,不然构建的时候会失败。