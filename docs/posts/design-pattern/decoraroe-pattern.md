---
title: 装饰者模式
tags: [JavaScript, 设计模式]
categories: [design-pattern]
---
### 定义
装饰者模式可以动态地给某个对象添加一些额外的职责，而不会影响这个类中派生的其他对象。装饰模式能够在不改变对象自身的基础上，在程序远行期间给对象动态地添加职责，跟继承相比，装饰者更加轻便灵活。

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
可以看到装饰者对象和它所装饰的对象拥有一致的接口，所以它们对使用该对象的客户来说是透明的，被装饰对象也不需要了解它曾经被装饰过，这种透明性使得我们可以嵌套任意多个装饰对象。

### JavaScript中的装饰者
JavScript语言动态改变对象很容易，我们可以直接改写对象或者某个对象的方法，并不需要用“类”来装饰，使用JavaScript实现上面例子的代码如下：
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
在实际开发中，这也是一种常见的做法。比如我们想给window绑定onload事件，但是不确定这个事件是不是被其它人绑定过，于是为了之前的不被覆盖，有如下代码：
```javascript
window.onload = function () {
  console.log(1)
}

let _onload = window.onload || function () {}
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