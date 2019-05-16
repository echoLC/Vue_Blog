---
title: 浅谈http缓存
tags: [http, 缓存]
categories: [http]
---
### 概念
浏览器缓存是在前端开发中经常遇到的问题，它是提升页面性能同时减少服务器压力的有效手段之一。
### 类型
#### 强缓存
   请求资源时不会向服务器发送请求，直接从缓存中读取资源，在chrome控制台的network中看到请求返回200的状态码，并且status code后面显示from disk cache 或者from memory cache；
#### 协商缓存
   向服务器发送请求，服务器会根据这个请求的request header一些参数来判断是否符合协商缓存类型，如果符合在返回304状态码并带上新的response header通知浏览器从缓存中读取资源。
    >>两者的共同点都是从客户端缓存中读取资源；不同点就是强缓存不会发请求，协商缓存会发送请求。

### 缓存有关的header
####强缓存
**Expires**：response header里的过期时间，浏览器再次加载资源时，如果在这个时间内，则会使用强缓存；

**Cache-Control**：当值设为max-age = 300时，则代表在这个请求正确返回时间的5分钟内再次加载资源，就会启用强缓存。这个参数的设置和Expires作用是差不多的，只不过Expire是http1.0就有的，Cache-Control是http1.1才有的，Cache-Control的优先级高。**现在配置Expires是为了兼容不能支持http1.1的环境**。

####协商缓存
**Etag和If-None-Match**：Etag是上一次加载资源时，服务器返回的对该资源的唯一标识，只要资源有变化，Etag就会重新生成。浏览器在下一次加载资源向服务器发送请求时，会将上一次返回的Etag值放到request header里的If-None-Match里，服务器接受到If-None-Match的值后，会拿来跟该资源文件的Etag值做比较，如果相同，则表示资源文件没有发生改变，命中协商缓存。

**Last-Modified和If-Since-Modified**：Last-Modified是该资源文件最后一次更改时间，服务器会在response header里返回，同时浏览器会将这个值保存起来，在下一次发送请求时，放到request header里的If-Modified-Since里，服务器在接收到后也会做比对，如果相同则命中协商缓存。
>>ETag和Last-Modified的作用和用法差不多。对比下他们的不同。
     1.首先在精度上，ETag要优于Last-Modified。Last-Modifed的时间单位是秒，如果某个文件在1秒内修改了很多次，那么他们的Last-Modified其实没有体现出来修改，但是ETag每次都会改变确保了精度，如果是负载均衡的服务器，各个服务器生成的Last-Modified也可能不一致。
   2.其次在性能上，ETag要逊于Last-Mdified，毕竟Last-Modified只需要记录时间，而Etag需要通过算法计算出来一个hash值。
   3.最后在优先级上，服务器经验优先考虑ETag。

### 用户行为对浏览器缓存的控制
*  地址栏访问，链接跳转是正常用户行为，将会触发浏览器缓存机制；
*  F5刷新，浏览器会设置max-age = 0，跳过强缓判断，会进行协商缓存判断；
*  ctrl+F5，跳过强缓存和协商缓存判断，直接从服务器拉取资源。

### 补充
补充对几个其它响应体字段的介绍。
#### Age
出现此字段，表示命中代理服务器的缓存，它的值指的是代理服务器对于请求资源的已缓存时间，单位为妙。
#### Date
指的是相应生成的时间，请求经过代理服务器时，返回的Date未必是最新的，所以通常这个时候，代理服务器增加一个Age字段告知该资源已缓存了多久。
#### Vary
对于服务器而言，资源文件可能有压缩和未压缩版本，针对不同的客户端，返回不同的资源版本。有些老式浏览器不支持解压缩，这时候需要返回未压缩版本；对于新浏览器，支持压缩的，返回压缩版本，节省带宽，提升体验。这时候用Vary来区分这个资源版本。服务器通过指定Vary：Accept-Encoding，告知代理服务器，需要缓存两个版本：压缩和未压缩。
#### s-max-age
也是cache-control的一个参数，优先级比max-age高，设置这个参数就代表使用的是公共缓存，例如通过代理服务器的缓存（比如CDN）。
#### no-cache
设置这个参数表示每次请求不是从浏览器直接获取缓存数据，而是通过向服务器发送请求，根据服务器返回的response header信息来决定是不是可以使用浏览器中缓存的数据。
#### no-store
设置这个参数表示不使用缓存。
#### 怎么控制让浏览器不缓存静态资源
有时候，很多工作场景需要避免浏览器缓存，除了浏览器浏览器隐身模式，请求时要禁用缓存：
*  设置请求头：Cache-control：no-cache，no-store，must-revalidate；
*  给资源加一个版本号，这样你就可以自由控制什么时候加载最新的资源:
```
<link rel="stylesheet" type="text/css" href="../css/style.css?version=1.8.9"/>
```
*  HTML禁用缓存，在页面上写:
```html
<meta http-equiv="Cache-Control"  content="no-cache, no-store, must-revalidate"/>
```
但是最后一种方法只有部分浏览器支持，由于代理服务器不解析HTML文档，所以也不支持这种方式。
#### IE8异常表现
上述缓存有关的规律，并非所有浏览器都遵循，比如说IE8。
        
        