---
title: 职责链模式
tags: [JavaScript, 设计模式]
categories: [design-pattern]
---
### 定义
职责链模式的定义：使多个对象都有机会处理请求，从而避免了请求的发送者与多个接收者直接的耦合关系，将这些接收者连接成一条链，顺着这条链传递该请求，直到找到能处理该请求的对象。

### 应用
假设我们负责一个售卖手机的网站，需求的定义是：经过分别缴纳500元定金和200元定金的两轮预订，现在到了正式购买阶段。公司对于交了定金的用户有一定的优惠政策，规则如下：缴纳500元定金的用户可以收到100元优惠券；纳200元定金的用户可以收到50元优惠券；而没有缴纳定金的用户进入普通购买模式，没有优惠券，而且在库存不足的情况下，不一定能保证买得到。下面开始设计几个字段，解释它们的含义：
- orderType：表示订单类型，值为1表示500元定金用户，值为2表示200元定金用户，值为3表示普通用户。
- pay：表示用户是否支付定金，值为布尔值true和false，就算用户下了500元定金的订单，但是如果没有支付定金，那也会降级为普通用户购买模式。
- stock：表示当前用户普通购买的手机库存数量，已经支付过定金的用户不受限制。

下面把上面的需求用代码实现：
```javascript
const order = function (orderType, pay, stock) {
  if (orderType === 1) {
    if (pay === true) {
      console.log('500元定金预购，得到100元优惠券')
    } else {
      if (stock > 0) {
        console.log('普通用户购买，无优惠券')
      } else {
        console.log('手机库存不足')
      }
    } else if (orderType === 2) {
      if (pay === true) {
        console.log('200元定金预购，得到50元优惠券')
      } else {
        if (stock > 0) {
          console.log('普通用户购买，无优惠券')
        } else {
          console.log('手机库存不足')
        }
      }
    } else if (orderType === 3) {
      if (stock > 0) {
          console.log('普通用户购买，无优惠券')
        } else {
          console.log('手机库存不足')
      } 
  }
}

order(1, true, 500)  // 输出：500元定金预购，得到100元优惠券'
```
虽然通过上面代码我们得到了想要的结果，但是代码难以阅读，维护起来也很困难，如果需要修改需求，那代价无疑是巨大的。
<br>
<br>
**使用职责链模式重构**
<br>
下面我们使用职责链模式重构，先把500元订单、200元订单以及普通购买拆分成三个函数。代码如下：
```javascript
function order500 (orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500元定金预购，得到100元优惠券')
  } else {
    order200(orderType, pay, stock)
  }
}

function order200 (orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('200元定金预购，得到50元优惠券')
  } else {
    order200(orderType, pay, stock)
  }
}

function orderNormal (orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通用户购买，无优惠券')
  } else {
    console.log('手机库存不足')
  }
}

// 测试
order500(1, true, 500)  // 500元定金预购，得到100元优惠券
order500(1, false, 500)  // 普通用户购买，无优惠券
order500(2, true, 500)  // 200元定金预购，得到50元优惠券
order500(3, false, 500)  // 普通用户购买，无优惠券
order500(3, false, 0)   // 手机库存不足
```
可以看到，重构后的代码已经清晰很多，减少了大量的if-else嵌套，每个函数的职责分明。但是还不够，虽然我们把大函数拆分成了三个小函数，但是请求在链条中传递的顺序很僵硬，传递请求的代码跟业务代码耦合在一起，如果有一天要增加300元定金的预订，那么就要切断之前的链条，修改订单500函数的代码，重新在500和200之间加一根新的链条，这违反了开放-封闭原则。
<br>
<br>
**灵活可拆分的职责链节点**
<br>
首先修改三个函数，如果某个节点不能处理请求，则返回一个特定的字符串“nextSuccessor”来表示请求需要继续往后传递：
```javascript
function order500 (orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500元定金预购，得到100元优惠券')
  } else {
    return 'nextSuccessor'
  }
}

function order200 (orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('200元定金预购，得到50元优惠券')
  } else {
    return 'nextSuccessor'
  }
}

function orderNormal (orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通用户购买，无优惠券')
  } else {
    console.log('手机库存不足')
  }
}
```
接下来需要定义一个Chain类将三个函数包装进职责链节点：
```javascript
class Chain {
  construct (fn) {
    this.fn = fn
    this.successor = null
  }

  setNextSuccessor (successor) {
    return this.successor = successor
  }

  passRequest () {
    const res = this.fn.apply(this, arguments)

    if (res === 'nextSuccessor') {
      return this.successor && this.successor.passRequest.apply(this.successor, arguments)
    }
    return res
  }
}

// 包装三个订单函数
const chainOrder500 = new Chain(order500)
const chainOrder200 = new Chain(order200)
const chainOrderNormal = new Chain(orderNormal)

// 指定节点在职责链中的位置
chainOrder500.setNextSuccessor(chainOrder200)
chainOrder200.setNextSuccessor(chainOrderNormal)

// 最后把请求传递给第一个节点
chainOrder500.passRequest(1, true, 500)   // 500元定金预购，得到100元优惠券
chainOrder500.passRequest(2, true, 500)   // 200元定金预购，得到50元优惠券
chainOrder500.passRequest(3, true, 500)   // 普通用户购买，无优惠券
chainOrder500.passRequest(1, false, 0)    // 手机库存不足
```
改进之后的代码，我们可以灵活地增加、移除和修改链中的节点顺序，如果后面增加了300预定金的类型，只需要在链中增加一个节点：
```javascript
function order300 () {
  // 省略代码
}

const chainOrder300 = new Chain(order300)
chainOrder500.setNextSuccessor(chainOrder300)
chainOrder300.setNextSuccessor(chainOrder200)
```
这样的修改简单容易，完全不用理会原来其它订单的代码。

### 异步的职责链
在上面的例子中，每个节点函数都是同步返回一个特定值来表示是否把请求传递给下一个节点。但是在实际应用中，我们经常会遇到一些异步的问题，比如要在某个节点中通过发起一个ajax异步请求，需要根据异步请求返回的结果才决定是否继续传递请求，这时候我们需要再添加一个函数，手动传递请求给职责链中的下一个节点：
```javascript
class Chain {
  construct (fn) {
    this.fn = fn
    this.successor = null
  }

  setNextSuccessor (successor) {
    return this.successor = successor
  }

  next () {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments)
  }

  passRequest () {
    const res = this.fn.apply(this, arguments)

    if (res === 'nextSuccessor') {
      return this.successor && this.successor.passRequest.apply(this.successor, arguments)
    }
    return res
  }
}
```
看一个异步使用的例子：
```javascript
const fn1 = new Chain(function () {
  console.log(1)
  return 'nextSuccessor'
})

const fn1 = new Chain(function () {
  console.log(2)
  setTimeout(() => {
    this.next()
  }, 1000)
})

const fn3 = new Chain(function () {
  console.log(3)
})

fn1.setNextSuccessor(fn2).setNextSuccessor(fn3)
fn1.passRequest()
```
这样我们得到了一个可以处理异步情况的职责链，异步的职责链加上命令模式，可以很方便地创建一个异步ajax队列库。

### 用AOP实现职责链
前面的例子我们是利用了一个Chain类来把普通函数包装成职责链的节点，利用JavaScript函数式的特性，我们可以实现一种更加方便地方法来创建职责链：
```javascript
Function.prototype.after = function (fn) {
  const self = this
  return function () {
    const res = self.apply(this, arguments)
    if (res === 'nextSuccessor') {
      return fn.apply(this, arguments)
    }
    return res
  }
}

const order = order500.after(order200).after(orderNormal)
order(1, true, 500)   // 500元定金预购，得到100元优惠券
order(2, true, 500)   // 200元定金预购，得到50元优惠券
order(3, true, 500)   // 普通用户购买，无优惠券
order(1, false, 0)    // 手机库存不足
```
使用AOP方式实现职责链简单又巧妙，但这种方式把函数叠加在一起，也增加了函数的作用域，如果链条太长，也会有一定的性能问题。

### 总结
职责链模式的最大优点就是解耦了请求发送者和多个请求接收者之间的关系。其次，使用了职责链模式之后，链中的节点对象可以灵活地拆分重组，增加、删除和修改节点在链中的位置都是很容易地事。它还有一个优点就是，可以手动地指定起始节点，请求并不是一定要从链中的第一个节点开始传递。
<br>
<br>
当然，这种模式并非没有缺点，首先我们不能保证某个请求一定会被链中的节点处理，所以需要在链尾增加一个保底的接受者处理这种情况。另外职责链模式使得程序中多了一些节点对象，可能在某一次请求传递中，大部分节点并没有起作用，所以过长的职责链会带来性能的损耗。
<br>
<br>
在JavaScript中。无论是作用链、原型链，还是DOM节点中的事件冒泡，我们都能从中找到职责链的影子。