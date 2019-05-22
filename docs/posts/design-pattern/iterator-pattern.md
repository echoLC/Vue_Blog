---
title: 迭代器模式
tags: [JavaScript, 设计模式]
categories: [design-pattern]
---
### 定义
迭代器模式就是提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。在JavaScript中，例如forEach的实现就是一种迭代器模式，它可以遍历数组。jQuery中的each方法既可以遍历数组也可以遍历对象，它也是迭代器模式的一种实现。

### 内部迭代器和外部迭代器
#### 内部迭代器
内部迭代器的内部已经定义好了迭代规则，它完全接手整个迭代过程，外部只需要一次初始调用。下面实现一个简单的内部迭代器：
```javascript
const each = function (array, callback) {
  for (let i = 0, len = array.length; i < len; i++) {
    callback(array[i], i, array[i])
  }
}

each([1, 2, 3], function (i, n) {
  console.log(i, n)
})
```
在JavaScript中，forEach和map函数都是内部迭代器的实现。

#### 外部迭代器
外部迭代器必须显示地请求迭代下一个元素。外部迭代器虽然增加了相对的复杂度，但是也增强了迭代器的灵活性，我们可以自己控制迭代器的过程或顺序。在ES6中，Generate函数也是外部迭代器的一种实现。下面简单实现一种外部迭代器：
```javascript
const iterator = function (obj) {
  let current = 0

  const next = function () {
    current += 1
  }

  const isDone = function () {
    return current >= obj.length
  }

  const getCurrentItem = function () {
    return obj[current]
  }

  return {
    next,
    isDone,
    getCurrentItem,
    length: obj.length
  }
}
```
### 迭代数组和对象字面量
迭代器模式不仅可以迭代数组，还可以迭代一些类数组的对象，例如函数中的arguments和通过DOM API查询的NodeList。例如jQuery中的each方法就可以根据对象的类型使用不同的迭代策略：
```javascript
$.each = function (obj, callback) {
  let value,
    i = 0,
    length = obj.length,
    isArray = isArraylike(obj)

  if (isArray) {
    for (let i = 0, len = obj.length; i < len; i++) {
      value = callback(obj[i], i, obj[i])
      if (value === false) {
        break
      }
    }
  } else {
    for (i in obj) {
      value = callback(obj[i], i, obj[i])
      if (value === false) {
        break
      }
    }
  }
  return obj
}
```

### 迭代器的应用
假设我们需要实现一个需求，根据不同的浏览器获取相应的上传组件对象，我们可以通过如下代码来实现：
```javascript
const getUploadObj = function () {
  try {
    return new ActiveXObject('TXFINActiveX.FTMUpload')
  } catch (e) {
    if (supportFlash()) {
      const obj = '<object type="application/x-shockwave-flash"></object>'
      return $(obj).appendTo($('body'))
    } else {
      const input = '<input name="file" type="file"/>'
      return $(input).appendTo($('body'))
    }
  }
}
```
上面的代码，会根据不同的浏览器环境选择不同的上传方式。优先使用控件上传，控件不支持，则选择Flash上传方式，如果Flash也没安装，那就只好使用浏览器原生的表单上传。
<br>
<br>
虽然上面的代码也能实现需求，但是代码里混杂着try catch块和if else语句，首先阅读困难，其次违反了开闭原则。如果我们想增加一种上传方式，比如HTML5上传，这时候唯一的办法就是继续往函数里增加条件分支。
<br>
<br>
梳理下问题，我们可以看到，不管有多少种上传方式，我们都要不断去尝试每一种方式，直到找到合适的方式。于是我们可以把每种upload对象的方法封装在各自的函数里，通过迭代器获取这些upload对象，直到获取到一个可用的为止。下面通过代码来实现：
```javascript
const getActiveUpload = function () {
  try {
    return new ActiveXObject('TXFINActiveX.FTMUpload')
  } catch (e) {
    return false
  }
}

const getFlashUpload = function () {
  if (supportFlash()) {
    const obj = '<object type="application/x-shockwave-flash"></object>'
    return $(obj).appendTo($('body'))
  }
  return false
}

const getFormUpload = function () {
  const input = '<input name="file" type="file"/>'
  return $(input).appendTo($('body'))
}
```
上面封装的三种upload对象，如果被浏览器支持，则返回对应的upload对象，否则返回false，提示迭代器继续进行。下面来实现upload iterator：
```javascript
const iteratorUpload = function () {
  for (let i = 0, len = arguments.length; i < len; i++) {
    const uploadObj = arguments[i]()
    if (uploadObj !== false) {
      return uploadObj
    }
  }
}

const uploadObj = iteratorUpload(getActiveUpload, getFlashUpload, getFormUpload)
```
使用迭代器重构之后，我们可以看到不同上传对象的方法被隔离在不同的函数中，互不干扰，使代码更容易维护，提高了代码的扩展性。如果我们后续还要增加其他的上传方式，只需要定义新的函数，然后再按优先级把不同的上传函数传递给iteratorUpload迭代器。