# 一键部署阿里云域名证书

如果用阿里云的[云产品部署](https://yundun.console.aliyun.com/?p=cas#/deployuser/user)证书, 每部署一个产品就要收30块钱, 真的阿里云怎么不去抢呢?

所以我编写了这个工具, 方便快捷的部署自己所拥有的证书

安全从来不是可选项, 而阿里云这种提高安全成本的手段正在摧毁安全

# 使用

首先[去阿里云创建要用到的 AccessKey](https://ram.console.aliyun.com/users)

该 `AccessKey` 需要下列权限

- 只读访问云盾证书服务的权限
- 管理全站加速（DCDN）的权限
- 管理CDN的权限

接着运行此工具

```sh
docker run --rm -ti --net host -e ORIGIN=http://127.0.0.1:3000 shynome/tls-deploy:v0.0.3
```

然后就是打开浏览器: http://127.0.0.1:3000 , 登录后部署自己所拥有的证书
