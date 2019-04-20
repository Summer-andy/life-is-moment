### 从零部署前端项目

- 部署的前置准备  
  + 阿里云centos服务器
  + 已经备案过的域名
  + 构建好的前端项目

- 通过putty或者xshell等软件连接到阿里云远程服务器(mac用户可以直接通过ssh连接阿里云)
  + mac用户直接在命令行输入 ssh root@139.196.82.33, 并且回车。 其中root是阿里云ECS服务器的登录名,后面的139.###.##.## 是指服务器的公网ip。
  + 输入密码,进入阿里云服务器。

- 接下来我们进入阿里云服务器了之后, 需要安装一系列的环境。现在大部分的项目,都是前后端独立部署.本文,将以最常用nginx服务器来说明如何部署前端项目。
  + 安装编译工具以及库文件  ``` yum -y install make  gcc-c++ libtool   ```
  + 安装PCRE(PCRE的作用是: nginx的rewrite伪静态匹配规则用到正则，PCRE就是帮我干这个事情的) 
    ```  $ cd /usr/local
      $ wget http://downloads.sourceforge.net/project/pcre/pcre/8.35/pcre-8.35.tar.gz
      $ tar zxvf pcre-8.35.tar.gz
      $ cd pcre-8.35
      $ ./configure
      $ make && make install
      $ pcre-config --version
    ```
  + 安装zlib库（nginx的压缩模块需要 zlib 库）
    ```
      $ cd /usr/local/ 
      $ wget http://zlib.net/zlib-1.2.11.tar.gz
      $ tar -zxvf zlib-1.2.11.tar.gz
      $ cd zlib-1.2.11
      $ ./configure
      $ make
      $ make install
    ```   
  +  安装ssl(nginx的ssl 功能需要openssl库)

    ```
    $ cd /usr/local/
    $ wget http://www.openssl.org/source/openssl-1.0.1j.tar.gz
    $ tar -zxvf openssl-1.0.1j.tar.gz
    $ ./config
    $ make

    ```
  + 好啦,我们nginx安装的前置工作都完事了,接下来我们开始nginx的安装
   ```
    $ cd /usr/local/
    $ wget http://nginx.org/download/nginx-1.8.0.tar.gz
    $ tar -zxvf nginx-1.8.0.tar.gz
    $ cd nginx-1.8.0  
    $ ./configure --prefix=/usr/local/webserver/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre=/usr/local/pcre-8.35 --with-openssl=/usr/local/openssl-1.0.1j --with-zlib=/usr/local/zlib-1.2.11 
    $ make
    $ make install
    #查看版本
    $ /usr/local/webserver/nginx/sbin/nginx -v

   ``` 

   + 启动nginx ``` $ /usr/local/webserver/nginx/sbin/nginx  ```

   +  打开浏览器,输入公网ip如果浏览器窗口出现welcome to ngxin!那么说明你nginx已经启动成功了(nginx的默认端口为80)
   +  接下来我们需要把我们的前端项目上传到服务器中(要记住项目的目录哦！), 我推荐使用ftp软件上传(亲测好用！)
   +  最后我们只需要修改nginx里面的配置文件就好
      -. 我们进入nginx配置文件的目录 ``` $ cd /usr/local/webserver/nginx/conf ```
      -. 编辑我们conf文件 ``` $ vim nginx.conf ```
      -. 修改 ```location / { root   /root/web/web-us/output; 对应项目的地址  index  index.html index.htm; 首页}  ```
      -. 重启nginx服务器 ``` /usr/local/webserver/nginx/sbin/nginx –s reopen ```  