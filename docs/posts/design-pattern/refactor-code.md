---
title: 代码重构
tags: [JavaScript, 重构代码]
categories: [design-pattern]
---
### 背景
到目前，JavaScript常见的设计模式系列我已经写得差不多了。在设计模式的一系列文章中，总是先写一段反例代码，然后再通过设计模式重构之前的代码，这种强烈的对比会加深我们对该设计模式的理解。
<br>
<br>
设计模式和重构之间有着与生俱来的关系，从某种角度来看，设计模式的目的就是为了重构代码。在日常开发中，除了使用设计模式进行重构之外，还有一些常见的容易忽略的细节，这些细节可以帮助我们写出更好的、容易维护的代码。下面我们一一介绍这些细节。

### 提炼函数
在日常开发中，我们大部分时间都是跟函数打交道，所以我们希望这些函数有着良好的命名，函数的功能单一，函数的逻辑清晰明了。如果一个函数过长，而且需要加注释才能让这个函数易读，那这个函数就很有必要进行重构了。把代码独立出来，封装成函数，有如下的优点：
- 避免出现超大函数。
- 独立出来的函数有助于代码复用。
- 独立出来的函数更容易被修改覆写。
- 独立出来的函数如果拥有良好的命名，它本身就起到了注释的作用。
  
 看下面负责获取用户信息的函数，获取用户信息后还需要打印用户信息有关的log，那么打印log相关的代码就可以封装在一个函数里面：
 ```javascript
 function getUserInfo () {
   ajax('http://xxx.com/getUserInfo', function (data) {
     console.log('userId' + data.userId)
     console.log('userName' + data.name)
     console.log('nickName' + data.nickName)
   })
 }
 ``` 
 改成: 
  ```javascript
 function getUserInfo () {
   ajax('http://xxx.com/getUserInfo', function (data) {
     printUserInfo(data)
   })
 }

 function printUserInfo (data) {
    console.log('userId' + data.userId)
    console.log('userName' + data.name)
    console.log('nickName' + data.nickName)
 }
 ``` 

 ### 合并重复的条件片段
如果一个函数中有一些条件分支语句，而这些条件语句内部散布了一些重复代码，那么就有必要去合并重复的代码。如下面的分页函数paging：
```javascript
function paging (currentPage) {
  if (currentPage <= 0) {
    currentPage = 0
    jump(currentPage)
  } else if (currentPage >= totalPage) {
    currentPage = totalPage
    jump(currentPage)
  } else {
    jump(currentPage)
  }
}
```
jump(currentPage)在每个分支中都出现了，可以分离出来，优化后：
```javascript
function paging (currentPage) {
  if (currentPage <= 0) {
    currentPage = 0
  } else if (currentPage >= totalPage) {
    currentPage = totalPage
  }
  jump(currentPage)
}
```

### 将条件分支语句提炼成函数
在程序设计中，复杂的条件分支语句导致程序难以阅读和理解，而且容易形成一个庞大的函数。假设有一个需求是编写一个计算商品价格的函数getPrice，商品的计算有一个规则：当商品在夏季的时候，商品八折出售，代码如下：
```javascript
function getPrice (price) {
  var date = new Date()
  if (date.getMonth() >= 6 && date.getMonth() <= 9) {
    return price * 0.8
  }
  return price
}
```
代码date.getMonth() >= 6 && date.getMonth() <= 9表达的意思很简单，就是判断当前日期是否处于夏天，但是阅读代码的人想要马上理解代码，还需要多花一点精力。优化之后：
```javascript
function getPrice (price) {
  if (isSummer()) {
    return price * 0.8
  }
  return price
}

function isSummer () {
  var date = new Date()
  return date.getMonth() >= 6 && date.getMonth() <= 9)
}
```
isSummer函数本身就起到了注释的作用，这样阅读代码的人一看就能理解。

### 合理使用循环
在函数体内，如果有些代码实际上负责一些重复性的工作，那么合理利用循环不仅可以完成同样的功能，还可以减少代码量。下面看一个创建XHR对象的代码：
```javascript
function createXHR () {
  var xhr;
  try {
    xhr = new ActiveObject('MSXML2.XMLHttp.6.0')
  } catch (e) {
    try {
      xhr = new ActiveObject('MSXML2.XMLHttp.3.0')
    } catch (e) {
      xhr = new ActiveObject('MSXML2.XMLHttp')
    }
  }
  return xhr
}
```
利用循环优化：
```javascript
function createXHR () {
  var versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp']
  for (var i = 0, version; version = versions[i++]; ) {
    try {
      return new ActiveObject(version)
    } catch (e) {
      
    }
  }
}
```

### 提前让函数退出代码嵌套条件分支
很多开发都有一种观点：每个函数只能有一个入口和一个出口，现代编程语言一般都限制函数只有一个入口，但是对于一个函数出口，则可以根据实际情况不同对待，下面是一个遵循函数只有一个出口地典型代码：
```javascript
function del (obj) {
  var ret
  if (!obj.isReadOnly) {
    if (obj.isFolder) {
      ret = delFolder(obj)
    } else if (obj.isFile) {
      ret = deleteFile(obj)
    }
  }
  return ret
}
```
嵌套的条件语句对于代码维护者来说绝对是噩梦，对于阅读代码的人来说，嵌套的if、else语句相比平铺的if、else，在阅读和理解上更加困难，有时候一个外层if分支的左括号和右括号相距一屏才能看完的代码。用《重构》里的话说，嵌套的条件语句往往是由一些深信“每个函数只能有一个出口”程序员写出的。下面优化代码：
```javascript
function del (obj) {
  if (!obj.isReadOnly) {
    return 
  }
  if (obj.isFolder) {
    return delFolder(obj)
  }
  if (obj.isFile) {
    return deleteFile(obj)
  }
}
```

### 传递对象参数代替过长的参数列表
有时候一个函数可能接收多个参数，而参数的数量越多，函数就难以理解、使用和测试。下面看一个函数：
```javascript
function setUserInfo (id, name, address, sex, mobile) {
  console.log('id' + id)
  console.log('name' + name)
  console.log('address' + address)
  console.log('sex' + sex)
  console.log('mobile' + mobile)
}

setUserInfo(12, 'sven', 'guangzhou', 'mail', '137****')
```
使用这个函数的时候得小心翼翼，如果搞反了某两个参数的位置，那么将得到不同的结果。这个时候可以把参数放在一个对象里传递：
```javascript
function setUserInfo (userInfo) {
  console.log('id' + userInfo.id)
  console.log('name' + userInfo.name)
  console.log('address' + userInfo.address)
  console.log('sex' + userInfo.sex)
  console.log('mobile' + userInfo.mobile)
}
setUserInfo({
  id: '12',
  name: 'sven',
  address: 'guangzhou',
  sex: 'mail',
  mobile: '137***'
})
```

### 少用三元运算符
一些程序员喜欢大规模使用三元运算符代替传统的if-else语句，理由是三元运算性能高、代码量少，其实这些理由很难站住脚。
<br>
即使三元运算符真的比if-else效率高，这一点差距也是可以忽略的，在实际的开发中，把一段代码循环一百万次，使用三元运算符和if-else的时间开销在同一个级别里。同样损失了代码的可读性和可维护性，三元运算符节省的代码量也可以忽略不计。如果条件逻辑简单且清晰，我们可以使用三元运算符：
```javascript
var global = typeof window !== 'undefined' ? window : this
```
如果逻辑分支非常复杂，我们还是使用if-else，如下例子：
```javascript
if (!aup || !bup) {
  return a === doc ? -1 :
    b === doc ? 1 :
    aup ? -1 : 
    bup ? 1 : 
    sortInput ? (indexOf.call(sortInput, a) - ndexOf.call(sortInput, b) ) : 0
}
```

### 合理使用链式调用
经常使用jQuery的程序员很喜欢使用链式调用，在JavaScript中，很容易实现链式调用，即让方法调用结束后返回对象自身，看下面代码：
```javascript
function User () {
  this.id = null
  this.name = null
}

User.prototype.setId = function (id) {
  this.id = id
  return this
}

User.prototype.setName = function (name) {
  this.name = name
  return this
}

console.log(new User().setId(12).setName('seven'))
```
使用链式调用不会造成太多阅读上的困难，也能节省一些字符和中间变量，但是链式调用带来的坏处就是在调试的时候非常不方便，如果我们发现其中一条链有错误，必须得先把链拆开才能加上一些调试log或者增加断点，这样才能定位错误出现的地方。如果该链的结构相对稳定，后期不容易修改，可以考虑使用链式调用。

### 分解大型类
在一个H5版本的“街头霸王”游戏中，其中有一个负责创建游戏人物的Spirit类，这个类非常庞大，不仅要负责创建人物精灵，还包括了人物的攻击、防御等动作方法，代码如下：
```javascript
function Spirit (name) {
  this.name = name
}

Spirit.prototype.attack = function (type) {
  if (type === 'waveBoxing') {
    console.log(this.name + ': 使用波动拳')
  } else if (type === 'whirlKick') {
    console.log(this.name + ': 使用旋风腿')
  }
}

var spirit = new Spirit('RYU')
spirit.attack('waveBoxing')
spirit.attack('whirlKick')
```
后来发现attack方法越来越庞大，所以，它可以作为一个单独的类存在。面向对象设计鼓励将行为分布在合理数量的更小对象之中：
```javascript
function Attack (spirit) {
  this.spirit = spirit
}

Attack.prototype.start = function (type) {
  return this.list[type].call(this)
}

Attack.prototype.list = {
  waveBoxing: function () {
    console.log(this.spirit.name + ': 使用波动拳')
  },
  whirlKick: function () {
    console.log(this.spirit.name + ': 使用旋风腿')
  }
}
```
将Attack封装成单独的类，现在Spirit类变得精简了许多，只需要把攻击方法委托给Attack类，这也是策略模式的运用之一：
```javascript
function Spirit (name) {
  this.name = name
  this.attackObj = new Attack(this)
}

Spirit.prototype.attack = function (type) {
  this.attackObj.start(type)
}

var spirit = new Spirit('RYU')
spirit.attack('waveBoxing')
spirit.attack('whirlKick')
```

### 用return 退出多重循环
在一个函数体内，如果有两重循环语句，当到达某个临界条件时退出外层的循环。我们可以引入一个控制标记变量：
```javascript
function func () {
  var flag  = false
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      if (i * j > 30) {
        flag = true
        break
      }
    }
    if (flag === true) {
      break
    }
  }
}
```
第二种方式，设置循环标记：
```javascript
function func () {
  outerloop:
  for (var i = 0; i < 10; i++) {
    innerloop:
    for (var j = 0; j < 10; j++) {
      if (i * j > 30) {
        break outerloop
      }
    }
  }
}
```
更简单的做法是直接使用return退出整个方法：
```javascript
function func () {
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      if (i * j > 30) {
        return
      }
    }
  }
}
```
如果在循环结束之后还有代码还要执行，可以这样写：
```javascript
function func () {
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      if (i * j > 30) {
        return doSomething()
      }
    }
  }
}

function doSomething () {
  console.log('do something')
}
```