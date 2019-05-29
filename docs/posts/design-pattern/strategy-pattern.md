---
title: 策略模式
tags: [JavaScript, 设计模式]
categories: [design-pattern]
---
### 定义
定义一系列算法，把它们一个个封装成策略类，具体的算法封装在策略类的内部方法里，并且使这些策略类可以互相替换。一个基于策略模式的设计至少由两部分组成，第一部分是一组策略类，每个策略类里封装了具体的算法。第二部分是环境类Context，Context主要接受客户的请求，然后把请求委托给某一个策略类。

### 应用
下面主要通过两个具体的案例来介绍策略类的使用。
#### 使用策略模式计算奖金
很多公司都设有年终奖，而且年终奖一般跟员工的月工资基数和绩效有关。如果绩效为S，发4个月年终奖；绩效A发3个月；绩效为B，发2个月。用代码计算奖金如下：
```javascript
const calculateBonus = function (performanceLevel, salary) {
  if (performanceLevel === 'S') {
    return salary * 4
  }
  if (performanceLevel === 'A') {
    return salary * 3
  }
  if (performanceLevel === 'B') {
    return salary * 2
  }
}
```
用简单的代码配合if语句就能实现该功能，但是却有很多的缺点。
* calculateBonus函数庞大，有很多的if语句。
* calculateBonus缺乏弹性，如果再增加一种新的绩效等级C，或者修改其中的一种绩效的计算方式，则必须深入calculateBonus的内部实现，违法了开闭原则。
* 复用性差，如果其它地方需要重用到这些计算奖金的算法，只能通过复制和粘贴
<br>

下面使用策略模式重构代码。第一步，定义策略类：
```javascript
// S
class PerformanceS {
  constructor (salary) {
    this.salary = salary
  }

  calculate () {
    return this.salary * 4
  }
}

// A
class PerformanceA {
  constructor (salary) {
    this.salary = salary
  }

  calculate () {
    return this.salary * 3
  }
}

// B
class PerformanceB {
  constructor (salary) {
    this.salary = salary
  }

  calculate () {
    return this.salary * 2
  }
}
```
第二步，定义环境类，Bonus：
```javascript
class Bonus {
  constructor (salary) {
    this.salary = salary
  }

  setStrategy (Strategy) {
    this.strategy = new Strategy(this.salary)
  }

  getBonus () {
    return this.strategy.calculate()
  }
}
```
使用：
```javascript
const bonus = new Bonus(7000)
bonus.setStrategy(PerformanceS)
bonus.getBonus() // 28000
```
重构完之后，我们发现代码更加清晰，每个类的职责也更加鲜明。

#### JavaScript版本的设计模式
上面我们是用面向对象的方式来实现策略模式，在JavaScript中，函数也是对象，所以更加直接的做法是：
```javascript
const strategies = {
  'S': function (salary) {
    return salary * 4
  },
  'A': function (salary) {
    return salary * 3
  },
  'B': function (salary) {
    return salary * 2
  }
}

const calculateBonus = function (performanceLevel, salary) {
  return strategies[performanceLevel](salary)
}
```

#### 表单校验
策略模式中的策略类主要是用来封装算法的，但是如果只封装算法，有点大材小用。在实际开发中，我们可以把算法定义变得更广，比如一系列的业务规则，这些业务规则的目标一致，并且可以被相互替换使用。下面通过策略模式来编写一个表单校验的例子。
<br>
<br>
需求是这样的，我们在编写一个注册的页面，在点击注册按钮之前，有如下几条校验规则：
* 用户名长度不能为空。
* 密码长度不能少于6位。
* 手机号必须符合格式。
  
**第一个版本**
```javascript
const registerForm = document.getElementById('registerForm')

registerForm.onsubmit = function () {
  if (registerForm.userName.value === '') {
    alert('用户名不能为空')
    return
  }
  if (registerForm.password.value.length < 6) {
    alert('用户密码不能少于6位')
    return
  }
  if (!/(^1[3|5|7|8][0-9]{9}$)/.test(registerForm.phone.value)) {
    alert('用户手机格式不正确')
    return
  }
}
```
它的缺点跟计算奖金的第一个版本差不多，缺乏弹性，违反开闭原则，复用性差。
<br>
<br>
**用策略模式重构**
<br>
定义校验规则的策略：
```javascript
const strategies= {
  isNonEmpty (value, errMsg) {
    if (value === '') {
      return errMsg
    }
  },
  minLength (value, length, errMsg) {
    if (value.length < length) {
      return errMsg
    }
  },
  isMobile (value, errMsg) {
    if (!/(^1[3|5|7|8][0-9]{9}$)/.test(value)) {
      return errMsg
    }
  }
}
```
先看具体怎么使用Validator：
```javascript
const validatorFunc = function () {
  const validator = new Validator()
  // 添加校验规则
  validator.add(registerForm.userName, 'isNonEmpty', '用户名不能为空')
  validator.add(registerForm.password, 'minLength:6', '用户密码不能少于6位')
  validator.add(registerForm.mobile, 'isMobile', '用户手机格式不正确')

  const errMsg = validator.start()  // 获得校验结果
  return erMsg
}

const registerForm = document.getElementById('registerForm')
registerForm.onsubmit = function () {
  const errMsg = validatorFunc()

  if (errMsg) {
    alert(errMsg)
    return
  }
}
```
定义环境类Validator类:
```javascript
class Validator {
  static rules = []
  
  add (dom, rule, errMsg) {
    const ary = rule.split(':')
    this.rules.push(function () {
      const rule = ary.shift()
      ary.unshift(dom.value)
      ary.push(errMsg)
      return strategies[rule].apply(dom, ary)
    })
  }

  start () {
    for (let i = 0; i < this.rules.length; i++) {
      const validatorFunc = this.rules[i]
      const errMsg = validatorFunc()
      if (errMsg) {
        return errMsg
      }
    }
  }
}
```
通过策略模式重构之后，只需要通过配置就可以完成表单的校验，这些校验规则还可以在任何地方复用。如果需要进行修改，比如改校验规则或者提示，也是成本很低的。

#### 策略模式的优缺点
**优点：**
* 策略模式利用组合、委托和多态等技术和思想，避免多重if-else语句。
* 提供了对开发-关闭原则的完美支持，将算法封装在策略类中，易于修改，易于扩展。
* 由于策略模式是将算法封装在策略类中，所以这些算法可以在项目中的任何地方复用。
* 利用组合和委托让Context拥有执行算法的能力，也是继承的一种替代方案。
<br>

**缺点：**
* 首先，使用策略模式会在程序中增加很多的策略类，增加了项目的代码。
* 其次，使用策略模式，必须了解所有的strategy类，这样才能知道使用哪个策略类。所以策略类必须向客户暴露它的所有实现，违反了最少知识原则。