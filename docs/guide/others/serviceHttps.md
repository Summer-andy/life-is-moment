### 从零部署前端项目

### ![image](./imgs/timg.jpeg)

- 部署的前置准备

  - 阿里云 centos 服务器
  - 已经备案过的域名
  - 构建好的前端项目

- 通过 putty 或者 xshell 等软件连接到阿里云远程服务器(mac 用户可以直接通过 ssh 连接阿里云)

  - mac 用户直接在命令行输入 ssh root@139.196.82.33, 并且回车。 其中 root 是阿里云 ECS 服务器的登录名,后面的 139.###.##.## 是指服务器的公网 ip。
  - 输入密码,进入阿里云服务器。

- 接下来我们进入阿里云服务器了之后, 需要安装一系列的环境。现在大部分的项目,都是前后端独立部署.本文,将以最常用 nginx 服务器来说明如何部署前端项目。

  - 安装编译工具以及库文件 `yum -y install make gcc-c++ libtool`
  - 安装 PCRE(PCRE 的作用是: nginx 的 rewrite 伪静态匹配规则用到正则，PCRE 就是帮我干这个事情的)
    ```
      $ cd /usr/local
      $ wget http://downloads.sourceforge.net/project/pcre/pcre/8.35/pcre-8.35.tar.gz
      $ tar zxvf pcre-8.35.tar.gz
      $ cd pcre-8.35
      $ ./configure
      $ make && make install
      $ pcre-config --version
    ```
  - 安装 zlib 库（nginx 的压缩模块需要 zlib 库）
    ```
      $ cd /usr/local/
      $ wget http://zlib.net/zlib-1.2.11.tar.gz
      $ tar -zxvf zlib-1.2.11.tar.gz
      $ cd zlib-1.2.11
      $ ./configure
      $ make
      $ make install
    ```
  - 安装 ssl(nginx 的 ssl 功能需要 openssl 库)

  ```
      $ cd /usr/local/
      $ wget http://www.openssl.org/source/openssl-1.0.1j.tar.gz
      $ tar -zxvf openssl-1.0.1j.tar.gz
      $ ./config
      $ make

  ```

  - 好啦,我们 nginx 安装的前置工作都完事了,接下来我们开始 nginx 的安装

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

  - 启动 nginx `$ /usr/local/webserver/nginx/sbin/nginx`

  - 打开浏览器,输入公网 ip 如果浏览器窗口出现 welcome to ngxin!那么说明你 nginx 已经启动成功了(nginx 的默认端口为 80)
  - 接下来我们需要把我们的前端项目以及 ssl 证书以及密钥上传到服务器中(要记住项目的目录哦！), 我推荐使用 ftp 软件上传(亲测好用！)
  - 最后我们只需要修改 nginx 里面的配置文件就好
    -. 我们进入 nginx 配置文件的目录 `$ cd /usr/local/webserver/nginx/conf`
    -. 编辑我们 conf 文件 `$ vim nginx.conf`
    -. 修改默认配置为下面所示（记得去阿里云服务器设置安全组）:

    ```
      {
        listen       443;  // http默认端口为443
        server_name  wopaige.cn;  // 域名
        ssl on;  // 开启ssl
        root html;
        index index.html index.htm;
        ssl_certificate cert/2026124_wopaige.cn.pem;  // 此处放ssl的证书
        ssl_certificate_key cert/2026124_wopaige.cn.key;  // 此处放ssl的密钥
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
         #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   /webSrc;   // 项目的目录
            index  index.html index.htm;
        }
    ```

    -. 重启 nginx 服务器 `/usr/local/webserver/nginx/sbin/nginx –s reopen`


    ##### 防火墙的基本使用
    启动： systemctl start firewalld
    关闭： systemctl stop firewalld
    查看状态： systemctl status firewalld 
    开机禁用  ： systemctl disable firewalld
    开机启用  ： systemctl enable firewalld
    查看版本： firewall-cmd --version
    查看帮助： firewall-cmd --help
    显示状态： firewall-cmd --state
    查看所有打开的端口： firewall-cmd --zone=public --list-ports
    更新防火墙规则： firewall-cmd --reload
    添加端口
    firewall-cmd --zone=public --add-port=80/tcp --permanent    （--permanent永久生效，没有此参数重启后失效）
    重新载入
    firewall-cmd --reload
    查看80端口状态
    firewall-cmd --zone= public --query-port=80/tcp
    删除80端口
    firewall-cmd --zone= public --remove-port=80/tcp --permanent