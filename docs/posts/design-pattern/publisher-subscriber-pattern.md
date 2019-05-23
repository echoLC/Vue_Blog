---
title: 发布-订阅模式
tags: [JavaScript, 设计模式]
categories: [design-pattern]
---
### 定义
发布-订阅模式是观察者模式的一种，它定义一个对象和多个对象之间的依赖关系，当对象的状态发生改变时，所有依赖它的对象都会收到通知。在JavaScript中，我们一般使用事件模型来代替传统的发布-订阅模式。
### DOM事件
在DOM编程中，我们经常会监听一些DOM事件，相当于订阅这个事件，然后用户触发这个事件，我们就能在回调中做一些操作。例如：
```javascript
document.body.addEventListener('click', function (e) {
  console.log('clicked')
}, false)

document.body.click()   // 模拟用户点击
```
我们不知道什么时候用户会触发点击事件，我们只需要订阅它，然后等到事件触发，就能收到通知。

### 实现发布-订阅模式
**简单的版本**
```javascript
const event = {
  clientList: [],
  listen: function (fn) {
    this.clientList.push(fn)
  },
  trigger: function () {
    for (let i = 0, len = this.clientList.length; i < len; i++) {
      const fn = this.clientList[i]
      fn.apply(this, arguments)
    }
  }
}
```
但是这个简单的版本有一些问题，如果订阅者A和订阅B它们对发布者的感兴趣的事件不一样，但是无论发布者触发什么事件，A和B都会收到通知。所以我们添加eventChannel，对不同的订阅者进行分类：
```javascript
const event = {
  clientList: {},
  listen: function (channel, fn) {
    if (!this.clientList[channel]) {
      this.clientList[channel] = []
    }
    this.clientList[channel].push(fn)
  },
  trigger: function () {
    const channel = arguments[0]
    const clientList = this.clientList[channel] || []
    if (clientList.length === 0) {
      return
    }
    for (let i = 0, len = clientList.length; i < len; i++) {
      const fn = clientList[i]
      fn.apply(this, arguments)
    }
  }
}
```
**取消订阅**
<br>
如果某个订阅者对之前订阅的channel不感兴趣了，还需要提供一个方法取消订阅。
```javascript
event.remove = function (channel, fn) {
  let clientList = this.clientList[channel] || []
  if (clientList.length === 0) {
    return
  }
  if (!fn) {
    clientList = []
  } else {
    for (let i = 0, len = clientList.length; i < len; i++) {
      const _fn = clientList[i]
      if (_fn === fn) {
        clientList.splice(i, 1)
      }
    }
  }
}
```
### 应用
假设我们接到一个需求，用户登录之后，需要更新网站的header头部、nav导航、购物车、消息列表等模块的用户信息。更新上面所列举的模块的前提条件就是通过ajax异步获取用户的登录信息，因为ajax是异步的，什么时候返回登录信息我们是不知道的，最常用的做法是通过回调来解决，于是有如下代码：
```javascript
login.success(function(data) {
  header.setAvatar(data.avatar)
  nav.setAvatar(data.avatar)
  message.refresh()
  cart.refresh()
})
```
上面代码的问题是，如果我负责的是登录模块，上面的其它header、nav、购物车模块是其它同事负责的，我必须还得了解其它模块的api，比如header模块的setAvatar等等，这种耦合性使程序变得僵硬。如果哪天要重构其它模块的代码，那api的名字不能随便修改，模块名也不能随意修改。如果项目又新增了一个地址模块，这个模块在用户登录之后也需要刷新，但是地址模块是其它同事负责的，那这个同事还得找到你，叫你在登录成功之后刷新地址列表。于是又增加了代码：
```javascript
login.success(function(data) {
  header.setAvatar(data.avatar)
  nav.setAvatar(data.avatar)
  message.refresh()
  cart.refresh()
  address.refresh()
})
```
这种修改会让人疲倦，让开发人员失去耐心。这个时候，就需要发布-订阅模式出场，重构代码。
<br>
使用发布-订阅模式重构的思路是，在用户登录成功之后，发布一个登录成功的消息，需要刷新用户数据的模块就可以订阅这个事件，然后去调用自己的方法更新数据或者做其它的业务处理，从而解耦了登录模块和其它模块，登录模块不用关心其它模块需要做什么，也不用关心各模块的内部细节。重构的代码如下：
```javascript
$.ajax('http://xxx.com?login', function (data) {
  login.trigger('loginSuccess', data)
})
```
各模块监听登录成功的消息：
```javascript
const header = (function () {
  login.listen('loginSuccess', function (data) {
    header.setAvatar(data.avatar)
  })
  return {
    setAvatar: function (data) {
      console.log('设置header模块的头像')
    }
  }
})()
```
这样就算其它模块修改方法的名字或者哪一天又新增了模块需要更新用户数据，登录模块不需要关心，各个模块自己处理就行了。

### 总结
通过上面的应用我们得出发布-订阅模式的优点，一为时间上的解耦，订阅者不需要关心什么时候发布者会发布事件；二为对象之间的解耦，上面的登录功能完美验证了这个点。发布-订阅模式应用非常广泛，既可以应用异步编程，也可以帮助我们完成更松耦合的代码编写。
<br>
<br>
发布-订阅模式也不是完美的，它也有自己的缺点。首先，创建订阅者就要消耗时间和内存，当你订阅一个消息，如果这个消息始终没有发生，那这个订阅者也会一直在内存中。它虽然弱化了对象之间的联系，但如果过度使用，对象和对象之间的必要联系也会深埋在背后，导致程序难以跟踪维护和理解。特别是如果多个发布者和订阅者嵌套在一起的时候，跟踪bug也变得更加困难。