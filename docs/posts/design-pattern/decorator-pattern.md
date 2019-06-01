---
title: 装饰者模式
tags: [JavaScript, 设计模式]
categories: [design-pattern]
---
### 定义
装饰者模式可以动态地给某个对象添加一些额外的职责，而不会影响这个类中派生的其他对象。装饰模式能够在不改变对象自身的基础上，在程序运行期间给对象动态地添加职责，跟继承相比，装饰者更加轻便灵活。

### 使用面向对象实现装饰者模式
假设我们编写一个飞机大战的游戏，飞机会根据经验值的增加升级子弹的类型，一开始飞机只能发射普通子弹，升到二级可以发射导弹，升到三级可以发射原子弹。用代码实现如下：
```javascript
var Plane = function () {}

Plane.prototype.fire = function () {
  console.log('发射子弹')
}

var MissleDecorator = function (plane) {
  this.plane = plane
}

MissleDecorator.prototype.fire = function () {
  this.plane.fire()
  console.log('发射导弹')
}

var AtomDecorator = function (plane) {
  this.plane = plane
}

AtomDecorator.prototype.fire = function () {
  this.plane.fire()
  console.log('发射原子弹')
}

// 应用
let plane = new Plane()
plane = new MissleDecorator(plane)
plane = new AtomDecorator(plane)
plane.fire() // 发送普通子弹、发送导弹、发送原子弹
```
导弹和原子弹装饰类的构造函数都接受plane对象，并且保存这个参数，在它们的fire方法中，除了自身的操作，还要调用plane对象的fire方法。这种方式没有改变plane对象的自身，而是将对象传递给另一个对象，这些对象以一条链的方式进行引用，形成聚合对象。
<br>
可以看到装饰者对象和它所装饰的对象拥有一致的接口，所以它们对使用该对象的客户来说是透明的，被装饰对象也不需要知道它曾经被装饰过，这种透明性使得我们可以嵌套任意多个装饰对象。

### JavaScript中的装饰者
JavaScript语言的动态性使得改变对象很容易，我们可以直接改写对象或者某个对象的方法，并不需要用“类”来装饰，使用JavaScript实现上面例子的代码如下：
```javascript
const plane = {
  fire () {
    console.log('发射子弹')
  }
}

const missleDecorator = function () {
  console.log('发射导弹')
}

const atomDecorator = function () {
  console.log('发射原子弹')
}

const copyFire1 = plane.fire
plane.fire = function () {
  copyFire1()
  missleDecorator()
}

const copyFir2 = plane.fire
plane.fire = function () {
  copyFire2()
  atomDecorator()
}

plane.fire() // 发送普通子弹、发送导弹、发送原子弹
```

### 装饰函数
在JavaScript中，几乎一切都是对象，函数又被称为一等对象。在JavaScript中可以很方便地修改对象的属性和方法，所以要为函数添加功能，最简单粗暴的方式是直接改写函数，但是这违反开放-封闭原则。比如下面的例子：
```javascript
var a = function () {
  console.log(1)
}
// 改成
var a = function () {
  console.log(1)
  console.log(2)
}
```
但是如果某个函数很复杂，而且之前可能也不是你维护，随便修改很可能产生难以预料的Bug，于是我们从装饰者模式中找到了一种答案，保存原函数的引用，然后添加新的功能：
```javascript
var a = function () {
  console.log(1)
}

var _a = a

a = function () {
  _a()
  console.log(2)
}
```
在实际开发中，这也是一种常见的做法。比如我们想给window绑定onload事件，但是不确定这个事件是不是被其他人绑定过，于是为了之前的函数不被覆盖，有如下代码：
```javascript
window.onload = function () {
  console.log(1)
}

var _onload = window.onload || function () {}
window.onload = function () {
  _onload()
  console.log(2)
}
```
这样的代码是符合开放-封闭原则的，我们增加新的功能的时候，没有修改原来的代码。但这种方式有一些缺点：
- 必须维护_onload这个中间变量，如果函数的装饰链较长，或者装饰的函数变多，这些中间变量的数量也会越来越多。
- 还会有this被劫持的问题，在上面的例子中没有问题，因为调用普通函数_onload，this也指向window，现在把window.onload改成document.getElementById，代码如下：
```javascript
var _getElementById = document.getElementById

document.getElementById = function (id) {
  console.log(1)
  return _getElementById(id)
}

var button = document.getElementById('button')
```
执行这段代码，控制台在打印1后，抛出如下异常:
```javascript
// Uncaught TypeError: Illegal invocation
```
异常的原因就是此时_getElementById是一个全局函数，调用全局函数时，this指向window的，而document.getElementById内部this预期的指向是document。所以我们需要改进代码:
```javascript
var _getElementById = document.getElementById

document.getElementById = function (id) {
  console.log(1)
  return _getElementById.call(document, id)
}

var button = document.getElementById('button')
```

### 使用AOP装饰函数
首先定义两个函数Function.prototype.before和Function.prototype.after：
```javascript
Function.prototype.before = function (beforeFn) {
  var self = this

  return function () {
    beforeFn.apply(this, arguments)

    return self.apply(this, arguments)
  }
}

Function.prototype.after = function (afterFn) {
  var self = this

  return function () {
    const ret = self.apply(this, arguments)
    afterFn.apply(this, arguments)

    return ret
  }
}
```
Function.prototype.before接受一个函数作为参数，这个函数即为要添加的装饰函数，它里面有需要添加的新功能的代码。
<br>
接着把当前的this保存起来，这个this指向原函数，返回一个代理函数。这个代理函数的作用是把请求分别转发给新添加的函数和原函数，并且保证它们的执行顺序，让新添加的函数在原函数之前执行，也叫前置装饰，这样就实现了动态装饰的效果。
<br>
因为我们在函数中保存了this，通过apply函数绑定正确的this，保证函数在被装饰之后，this不会被劫持。于是前面的例子，我们可以这样写：
```javascript
 document.getElementById = document.getElementById.before(function () {
   console.log(1)
 })

 console.log(document.getElementById('button'))
```

### AOP应用
#### 1.数据统计上报
分离业务代码和数据统计代码，无论在什么语言中，都是AOP的经典应用之一。在项目的开发结尾的时候，我们一般需要加一些统计数据的代码，这些过程可能让我们被迫改动已经封装好的函数。比如，页面中有登录按钮，点击登录按钮，弹出登录弹窗的同时还要上报数据，来统计有多少用户点击了登录按钮。下面简单的代码实现：
```javascript
function showLoginModal () {
  console.log('打开登录弹窗')
  log('传入一些按钮信息')
}

function log (info) {
  console.log('上报用户信息和按钮信息到服务器')
}

document.getElementById('loginBtn').onclick = showLoginModal
```
可以看到，在showLogin函数里，既要负责打开弹窗的功能，又要负责数据上报，这两个不同层面的代码耦合在一起，我们可以使用AOP进行优化：
```javascript
var showLoginModal = function () {
  console.log('打开登录弹窗')
  log('传入一些按钮信息')
}

function log (info) {
  console.log('上报用户信息和按钮信息到服务器')
}

showLoginModal = showLoginModal.after(log)  // 打开弹窗之后上报数据

document.getElementById('loginBtn').onclick = showLoginModal
```

#### 使用AOP动态改变函数的参数
观察Function.prototype.before函数：
```javascript
Function.prototype.before = function (beforeFn) {
  var self = this

  return function () {
    beforeFn.apply(this, arguments)

    return self.apply(this, arguments)
  }
}
```
可以看到beforeFn函数和原函数共用参数arguments，所以我们在beforeFn中修改参数后，原函数接收的参数也会发生变化。
<br>
现在有一个用于ajax请求的函数，它负责项目中所有的ajax异步请求：
```javascript
var ajax = function (type, url, param) {
  console.dir(param)

  // 这里是发送请求的代码
}

ajax('get', 'http://xxx.com/userInfo', { name: 'uzi' })
```
上面代码表示向服务端发起一个获取用户信息的请求，传递的参数是{ name: 'uzi' }。ajax函数在项目中一直工作良好，突然有有一天，网站遭受了CSRF攻击，解决CSRF的一个办法就是在所有HTTP请求中带上一个token参数。于是我们定义了一个生成token的函数：
```javascript
var getToken = function () {
  return 'token'
}
```
下面给所有请求加上token参数：
```javascript
var ajax = function (type, url, param) {
  param = param || {}
  param.token = getToken()

  // 这里是发送请求的代码
}
```
这样问题就解决了，但是ajax函却变得僵硬了，虽然每个ajax请求都自动带上了token参数，在当前项目是没有什么问题。但是，如果将来要将这个ajax函数封装到公司的通用库里，那这个token参数可能就是多余的了，也许另一个项目不需要token参数，或者生成token的算法不一样，无论怎么样，都需要修改这个ajax函数。我们用AOP来解决这个问题：
```javascript
var ajax = function (type, url, param) {
  console.dir(param)

  // 这里是发送请求的代码
}

var getToken = function () {
  return 'token'
}

// 使用Function.prototype.before装饰ajax函数
ajax = ajax.before(function (type, url, param) {
  param.token = getToken()
})

ajax('get', 'http://xxx.com/userInfo', { name: 'uzi' })  // { name: 'uzi', token: 'token'}
```
这样我们就保证了ajax函数的干净，提高了ajax函数的复用性，并且也满足了添加token的需求。

#### 插件式的表单验证
表单验证在web开发中是一个很常见的需求，比如在一个登录页面，我们在把用户的数据，比如用户名、密码等信息提交给服务器之前，就会经常需要做校验，假设我们现在只需要校验字段是否为空，于是有如下代码：
```javascript
var username = document.getElementById('username')
var password = document.getElementById('password')
var submitBtn = document.getElementById('submitBtn')

function submitHandler () {
  if (username.value === '') {
    return alert('用户名不能为空')
  }
  if (password.value === '') {
    return alert('密码不能为空')
  }
  ajax('post', 'http://xxx.com/login', { username: username.value, password: password.value })
}

submitBtn.onclick = submitHandler
```
上面的submitHandler在此处承担了两个职责，除了ajax的请求之外，还要验证用户输入的合法性，这种函数首先一旦校验的字段很多，代码就会臃肿，而且函数职责也很混乱，无法复用。
下面使用AOP进行优化，首先分离校验相关的代码:
```javascript
function validateField () {
   if (username.value === '') {
    alert('用户名不能为空')
    return false
  }
  if (password.value === '') {
    alert('密码不能为空')
    return false
  }
}

function submitHandler () {
  var params = { username: username.value, password: password.value }
  ajax('post', 'http://xxx.com/login', params)
}
```
改写前面的Function.prototype.before:
```javascript
Function.prototype.before = function (beforeFn) {
  var self = this

  return function () {
    const ret = beforeFn.apply(this, arguments)
    if (ret === false) {
      return
    }

    return self.apply(this, arguments)
  }
}
```
再用validateField前置装饰submitHandler:
```javascript
submitHandler = submitHandler.before(validateField)

submitBtn.onclick = submitHandler
```
这样我们就完美将校验的代码和提交ajax请求的代码完全分离开来，它们不再有耦合关系，这样我们在项目中可以把一些校验函数封装起来，达到复用的目的。

### 装饰者模式和代理模式
装饰者模式和代理模式的结构看起来很像，这两种模式都描述了怎么样为对象提供一定程度上的间接引用，它们的实现部分保留了对另一个对象的引用，并且客户是直接向那个对象发送请求。
<br>
<br>
代码模式和装饰者模式最重要的区别是在于它们的意图和设计目的。代理模式的目的是，当直接访问本体不方便时或者不合符需求时，为本体提供一个替代者。本体定义了核心的功能，而代理提供的作用一个是直接拒绝一些访问，另一个就是在本体之前做一些额外的事情。而装饰者的作用是给对象动态添加行为，可以说代理模式强调一种本体和代替者的一种可以静态表达的关系，这种关系在一开始就基本被确定了。而装饰者模式一开始并不能确定所有的功能，在不同的场景中，可能会根据需要添加不同的装饰者，这些装饰者可以形成一条长长的装饰链。

### 总结
通过上面的三个应场景：数据上报、动态改变函数参数以及表单校验，我们可以看到在JavaScript中，我们了解了装饰函数，了解了AOP，他们就是JavaScript中独特的装饰者模式，这种模式在实际开发中非常有用。