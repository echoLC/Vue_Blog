---
title: 设计模式中的一些原则
tags: [JavaScript, 设计模式]
categories: [design-pattern]
---
### 单一职责原则
#### 定义
对于一个类而言，应该只有一个引起它变化的原因。在JavaScript中，单一职责原则更多地是被运用在对象或者方法级别上。单一职责原则（SRP）的职责定义为“引起变化的原因”，如果我们有多个动机去改写一个方法，那这个方法就对应多个职责。如果一个方法承担了过多职责，在需求的变迁过程中，需要改写这个方法的可能性就越大。因此我们可以总结SRP原则：一个对象或者方法只做一件事。

#### 设计模式中的SRP原则
SRP原则在很多模式中有着广泛的应用，例如代理模式、装饰者模式等。
<br>
<br>
**代理模式**
<br>
在我写的[代理模式](https://echolc.github.io/posts/design-pattern/proxy-pattern.html)一文中，有一个图片预加载的例子，通过增加虚拟代理的方式，把图片预加载的职责放到代理对象中，而本体仅仅负责往页面添加img标签。
<br>
myImage负责往页面添加img标签：
```javascript
var myImage = (function () {
  var imgNode = document.createElement('img')

  document.body.appendChild(imgNode)

  return {
    setSrc (src) {
      imgNode.src = src
    }
  }
})()
```
proxyImage负责预加载图片，并加载完图片后把请求交给本体myImage:
```javascript
var proxyImage = (function () {
  var img = new Image()

  img.onload = function () {
    myImage.setSrc(this.src)
  }

  return {
    setSrC (src) {
      myImage.setSrc('loading.gif') 
      img.src= src
    }
  }
})()

proxyImage.setSrc('http://xxx.com/01.jpg')
```
这样把向页面添加img标签的功能和预加载图片的职责分开放到两个对象中，每个对象只有一个被修改的意图，而且修改其中一个对象也不会影响另一个对象。
<br>
<br>
**装饰者模式**
<br>
使用装饰者模式的时候，我们通常让类或者对象只有一些基础的职责，更多的职责在代码运行时被动态地装饰到对象上，这也是分离职责的一种方式。
<br>
在[装饰者模式](https://echolc.github.io/posts/design-pattern/decorator-pattern.html)这篇文章中，我们把数据上报的功能单独放在一个函数里，然后把这个函数动态地装饰到业务函数上：
```javascript
Function.prototype.after = function (fn) {
  var self = this
  return function () {
    var ret = _self.apply(this, arguments)
    fn.apply(this, arguments)

    return ret
  }
} 

var showLogin = function () {
  console.log('打开登录弹窗')
}

var log = function () {
  console.log('上报数据')
}

document.getElementById('loginBtn').onclick = showLogin.after(log)
```

#### 何时分离职责
首先明确一点，并不是所有的职责都应该一一分离。
<br>
如果随着需求的变化，有两个职责总是同时变化，那就不分离他们。比如在ajax请求的时候，创建xhr对象和发送xhr请求几乎都是一起的，那么这两个职责就没有必要分离。
<br>
职责的变化轴线仅当它们确定会发生变化时才具有意义，即使两个职责已经被耦合在一起，但它们没有发生改变的预兆，也没有必要主动分离它们，等代码重构时分离也不迟。

#### 违反SRP原则
在人的常规思维中，总是习惯性地把一组相关行为放到一起，如何正确地分离职责不是容易的一件事情。
<br>
<br>
一方面，我们接受SRP原则的指导，另一方面，我们也没有必要任何时候都一成不变地遵守规则。
在实际开发中，因为种种原因违反SRP原则的情况并不少见。比如jQuery的attr等方法，即负责赋值，又负责取值，这明显违反了SRP原则。对于jQuery维护者来说，会有一定困难，但是对用户来说，却简化了api的使用。
<br>
<br>
**在方便性与稳定性之间要有一些取舍，具体是选择方便性还是稳定性，取决于具体的应用场景**。

#### SRP原则的优缺点
SRP的优点是**降低了单个类或者对象的复杂度，按照职责把对象分解成更小的粒度，这有助于代码复用和进行单元测试**。
<br>
它最明显的缺点就是会**增加编写代码的难度**。其次，当我们按职责把对象分解成小的粒度之后，实际上也增加了对象之间互相联系的难度。

### 最小知识原则
#### 定义

最少知识原则（LKP）说的是一个软件实体应当尽量减少与其它实体发生相互作用，在面向对象中，指的就是在程序设计的时候，应当尽量减少对象之间的交互。如果两个对象不必直接通信，那么这两个对象就不要发生直接的相互联系。

#### 设计模式中的最小知识原则
最少知识原则在设计模式中体现最多的是中介者模式和外观模式，但是外观模式在JavaScript中很少用，所以这里就不介绍了。
<br>
<br>
**中介者模式**
<br>
在[中介者模式](https://echolc.github.io/posts/design-pattern/mediator-pattern.html)一文中，我们通过一个泡泡糖游戏的例子来学习中介者模式。当游戏有成千上万的玩家对战的时候，如果通过玩家互相引用达到通知游戏状态的目的，那实现起来代码将无法维护。但是通过引入一个中介者的方式，解耦所有玩家之间的直接联系，当一个玩家的状态改变时，只需要通过中介者对象来通知即可。
<br>
<br>
**封装在最少知识原则中的体现**
<br>
封装在很大程度上表达的是数据隐藏，一个模块或者对象将内部的数据或者实现细节隐藏起来，只暴露必要的接口给外界访问。对象之间难免产生联系，当一个对象必须引用另一个对象，通过只暴露必要的接口从而让对象之间的联系限制在最小的范围之内。

### 开放-封闭原则
#### 定义
在面向对象程序中，**开放-封闭原则是最重要的一条原则**。很多时候，一个程序具有良好的设计，它通常是符合开放-封闭原则的。开放封闭原则指的就是：**一个对象（类、函数、模块）等应该是可以扩展的，但是不可修改**。

#### 扩展onload函数
假如我们在维护一个大型的web项目，这个项目已经有一定的历史，也有很多人维护，代码已经有十万行。这时候，你接到一个需求，需要在window.onload之后，上报一定的数据。这个对开发来说当然没什么难度，于是打开页面代码加上一行：
```javascript
window.onload = function () {
  log('上报数据')
}
```
在需求变更的过程中，我们经常是找到相关代码，然后修改它，这似乎是理所当然的。但是如果想象一下，目前的window.onload函数是一个有几百行代码的巨型函数，里面遍布着各种变量和业务逻辑，如果需求更复杂，就可能会改好一个bug，产生5个bug。于是，我们通过在AOP来动态地给window.onload增加新功能：
```javascript
Function.prototype.after = function (fn) {
  var self = this
  return function () {
    var ret = _self.apply(this, arguments)
    fn.apply(this, arguments)

    return ret
  }
} 

window.onload = (window.onload || function () {}).after(function () {
  // 添加我们新的业务代码
})
```
通过动态装饰函数的方式，我们完全不用理会从前window.onload函数的内部实现。

#### 用对象的多态性消除分支语句
过多的条件分支是造成程序违反开放-封闭原则的一个常见原因，每当需要增加一个新的if语句时，都被迫要改动原函数。把if换成switch是没有用的，这是一种换汤不换药的做法。实际上，当我们看到大量的if或者switch语句时，就可以考虑使用对象的动态性来重构它们。
<br>
<br>
下面是一种反例的实现：
```javascript
var makeSound = function (animal) {
  if (animal instanceof Duck) {
    console.log('嘎嘎嘎')
  } else if (animal instanceof Chicken) {
    console.log('咯咯咯')
  }
}

var Duck = function () {}
var Chicken = function () {}

makeSound(new Duck())      // 嘎嘎嘎
makeSound(new Chicken())   // 咯咯咯
```
增加了一种狗的类型，必须修改代码:
```javascript
var makeSound = function (animal) {
  if (animal instanceof Duck) {
    console.log('嘎嘎嘎')
  } else if (animal instanceof Chicken) {
    console.log('咯咯咯')
  } else if (animal instanceof Dog) {
    console.log('汪汪汪')
  }
}

const Dog = function () {}
makeSound(new Dog())   // 汪汪汪
```
利用多态的实现，把程序中不变的部分隔离出来（动物会叫），然后把可变的部分封装起来（不同的动物发出不同的叫声），这样程序就有了扩展性：
```javascript
var makeSound = function (animal) {
  animal.sound()
}

var Duck = function () {}
Duck.prototype.sound = function () {
  console.log('嘎嘎嘎')
}

var Chicken = function () {}
Chicken.prototype.sound = function () {
  console.log('咯咯咯')
}

var Dog = function () {}
Dog.prototype.sound = function () {
  console.log('汪汪汪')
}

makeSound(new Duck())      // 嘎嘎嘎
makeSound(new Chicken())   // 咯咯咯
makeSound(new Dog())       // 汪汪汪
```

#### 找出变化的地方
指导我们实现开放-封闭原则的规律就是：找出程序中经常发生变化的地方，然后把变化封装起来。
<br>
通过封装变化，我们可以把系统中稳定的部分和容易变化的部分隔离开来，在系统的演变过程中，我们只需要替换那些容易变化的部分，因为这部分已经封装好了，所以替换起来也相对容易。
<br>
<br>
除了利用对象的多态性之外，下面还有一些方式可以帮助我们编写遵守开放-封闭原则的代码：
- 放置挂钩（hook）
<br>
放置挂钩也是一种分离变化的方式。我们在程序有可能变化的地方放置一个hook，根据hook返回的结果来决定程序下一步走向。这样一来，原本代码的执行路径上就出现了分叉路口，程序未来的执行方向有了多种可能。关于hook的应用，可以参考[模板方法模式](https://echolc.github.io/posts/design-pattern/template-way-pattern.html)中hook的应用。 
- 使用回调函数
<br>
在JavaScript中，函数可以作为参数传递给另外一个函数，这也是高阶函数的应用之一。在这种情况下，我们通常把这个函数称为回调函数，在JavaScript中，[命令模式](https://echolc.github.io/posts/design-pattern/command-pattern.html)和[策略模式](https://echolc.github.io/posts/design-pattern/strategy-pattern.html)都可以使用回调函数轻松实现。
<br>
回调函数是一种特殊的挂钩，我们可以把容易变化的逻辑封装在回调函数里，然后把回调函数当作参数传入一个稳定和封闭的函数中。当函数执行，程序就可以根据回调函数的内部逻辑不同，产生不同的结果。
<br>
例如，在ajax异步请求用户信息之后要做一些事，请求用户信息的过程是不变的，但是获取到用户信息之后要做的操作，则是可能变化的：
```javascript
var getUserInfo = function (callback) {
  $.ajax('http://xxx.com/getUserInfo', callback)
}

getUserInfo(function (data) {
  console.log('更新cookie')
})

getUserInfo(function (data) {
  console.log('更新个人主页信息')
})
```

#### 开放-封闭原则的相对性
在[职责链模式](https://echolc.github.io/posts/design-pattern/chain-of-responsibility.html)中，也许会有人疑问：开放-封闭原则要求我们只能通过增加源码的方式来扩展程序的功能，而不允许修改源码。当我们往职责链增加一个新的订单100节点时，也必须要改动链条的代码：
```javascript
order500.setNextSuccessor(order200).setNextSuccessor(orderNormal)
// 修改：

order500.setNextSuccessor(order200).setNextSuccessor(order100).setNextSuccessor(orderNormal)
```
实际上，让程序保持完全封闭是很难做到的，就算能做到也需要花太多时间和精力。而且让程序符合开放-封闭原则的代价是引入更多抽象层次，这也会增加代码的复杂度。在有些情况下，我们无论如何都是做不到完全封闭的，这时候我们就要明白下面两点：
- 挑选出最容易发生变化的地方，然后构造抽象来封装这些变化。
- 在不可避免发生修改的时候，尽量修改那些相对容易修改的地方。拿开源库来说，修改它提供的配置文件，总比修改它的源码简单。

#### 接受第一次愚弄
引用Bob大叔的《敏捷软件开发原则、模式与实践》：
> 有句古老的谚语：“愚弄我一次，应该羞愧的是你。再次愚弄我，应当羞愧的是我。”这也是一种有效对待软件设计的态度。为了防止软件背着不必要的复杂性，我们允许自己被愚弄一次。

让程序一开始就尽量遵守开放-封闭原则，并不是一件容易的事情。首先，我们需要知道程序哪些地方会发生变化，这要求我们能提前预想到将来的一些需求变化。其次，留给开发程序员的需求开发周期是有限的，所以我们可以说服自己接受不合理代码的第一次愚弄。在需求开发的时候，我们可以先迅速完成需求，然后再回头找出变化的地方封装起来。
