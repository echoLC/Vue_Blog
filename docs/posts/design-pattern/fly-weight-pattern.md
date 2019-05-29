---
title: 享元模式
tags: [JavaScript, 设计模式]
categories: [design-pattern]
---
### 定义
享元模式是一种用于性能优化的模式，享元模式的核心是运用共享对象的技术来有效支持大量细粒度的对象。如果系统因为创建了大量对象而导致内存占用过高，享元模式就能发挥作用了。

### 一个简单的例子
假设有个制衣工厂，目前的产品有50种男款衣服和50种女款衣服，为了推销产品，工厂决定生产一些塑料模特来穿上他们的衣服拍成广告照片，正常情况下需要50个男模特和50个女模特，用程序表达：
```javascript
class Model {
  constructor (sex, underwear) {
    this.sex = sex
    this.underwear = underwear
  }

  takePhoto () {
    console.log(`sex ${this.sex} underwear ${this.underwear}`)
  }
}

for (let i = 0; i < 50; i++) {
  const maleModel = new Model('male', 'underwear' + i)
  maleModel.takePhoto()
}

for (let j = 0; j < 50; j++) {
  const femaleModel = new Model('male', 'underwear' + j)
  femaleModel.takePhoto()
}
```
上述代码产生了一百个对象，如果将来有10000种的男款和10000种女款的衣服，那程序可能因为存在如此多的对象而崩溃。
<br>
<br>
换种思路，上面的例子中最需要区分的是男女模特，那我们把其它参数从构造函数中移除，只接受sex参数：
```javascript
class Model {
  constructor (sex) {
    this.sex = sex
  }

  takePhoto () {
    console.log(`sex ${this.sex} underwear ${this.underwear}`)
  }
}
```
分别创建一个男模特和一个女模特：
```javascript
const maleModel = new Model('male')
const femaleModel = new Model('female')
```
给男模特依次穿上不同的衣服，并拍照：
```javascript
 for (let j = 0; j < 50; j++) {
  maleModel.underwear = 'underwear' + j
  femaleModel.takePhoto()
}
```
女模特穿衣拍照类似，可以看到，改进代码之后，只需要两个对象便完成了同样的功能。

### 内部状态和外部状态
上面的例子是享元模式的雏形，享元模式要求将对象的属性划分为内部状态和外部状态，状态在这里一般指的是对象的属性。在上面的例子中，内部状态就是模特的性别，外部状态对应模特会变化的不同款的衣服。那么如何划分内部状态和外部状态了？下面有几条经验可以提供一些指导。
- 内部状态存储于对象内部
- 内部状态可以被对象共享
- 内部状态通常独立于具体的场景，通常不会变
- 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享

这样的话，我们就可以把内部状态相同的对象指定为同一个共享的对象，而外部状态从对象中剥离出来，储存在外部。虽然结合外部状态组装成一个完整的对象的过程需要花费一定的时间，但是却可以大大减少系统中对象的数量，所以享元模式也是一种使用时间来换取空间的优化模式。

### 文件上传
**对象爆炸**
<br>
在一个上传模块的开发中，如果没有用享元模式优化，会出现因为对象数量爆炸而到导致内存占用过大的问题。文件上传功能虽然可以依照队列，一个一个地排队上传，但也支持同时选择2000个文件，每一个文件都对应着一个JavaScript上传对象的创建。下面先看下代码实现：
```javascript
let id = 0

window.startUpload = function (uploadType, files) {
  for (let i = 0, file; file=files[i++]) {
    const uploadObj = new Upload(uploadType, file.fileName, file.fileSize)
    uploadObj.init(id++)
  }
}
```
下面实现Upload类：
```javascript
class Upload {
  constructor (uploadType, fileName, fileSize) {
    this.uploadType = uploadType
    this.fileName = fileName
    this.fileSize = fileSize
    this.dom = null
  }

  init (id) {
    const self = this
    this.id = id
    this.dom = document.createElement('div')
    this.dom.innerHTML = `<span>文件名称：${this.fileName}，文件大小：${this.fileSize}</span><button class="delfile">删除</button>`

    this.dom.querySelector('.delfile').onclick = function () {
      self.delFile()
    }
    document.body.appendChild(this.dom)
  }

  delFile () {
    if (this.fileSize < 300) {
      return this.dom.parentNode.removeChild(this.dom)
    }
    if (window.confirm(`确定要删除文件吗？${this.fileName}`)) {
      return this.dom.parentNode.removeChild(this.dom)
    }
  }
}
```
然后我们就可以这样使用：
```javascript
startUpload('plugin', [
  {
    fileName: '1.txt',
    fileSize: 1000
  },
  {
    fileName: '2.txt',
    fileSize: 3000
  },
  {
    fileName: '3.html',
    fileSize: 4000
  }
])

startUpload('flash', [
  {
    fileName: '1.txt',
    fileSize: 1000
  },
  {
    fileName: '2.txt',
    fileSize: 3000
  },
  {
    fileName: '3.html',
    fileSize: 4000
  }
])
```
从上面的代码中可以看出，有多少需要上传的文件，就需要创建多少个upload对象，所以我们可以用享元模式重构它。先确认好对象的内部状态和外部状态，从上面的例子中，我们可以看出，upload必须依赖uploadType属性才能工作，因为插件上传、Flash上传、表单上传的工作原理区别很大，它们各自调用的接口也不一样，所以在创建upload对象时，必须明确到底使用哪种上传类型。下面看具体实现代码。
<br>
**剥离外部状态**
<br>
```javascript
class Upload {
  constructor (uploadType) {
    this.uploadType = uploadType
  }

  delFile (id) {
    uploadManager.setExternalState(id, this)

    if (this.fileSize < 300) {
      return this.dom.parentNode.removeChild(this.dom)
    }
    if (window.confirm(`确定要删除文件吗？${this.fileName}`)) {
      return this.dom.parentNode.removeChild(this.dom)
    }
  }
}
```
**工厂进行上传对象实例化**
<br>
```javascript
const UploadFactory = (function () {
  const createdFlyWeightObjects = {}
  return {
    create (uploadType) {
      if (createdFlyWeightObjects[uploadType]) {
        return createdFlyWeightObjects[uploadType]
      }
      return createdFlyWeightObjects[uploadType] = new Upload(uploadType)
    }
  }
})()
```
**管理封装外部状态**
<br>
```javascript
const uploadManager = (function () {
  const uploadDatabase = {}

  return {
    add (id, uploadType, fileName, fileSize) {
      const flyWeightObj = UploadFactory.create(uploadType)

    const dom = document.createElement('div')
    dom.innerHTML = `<span>文件名称：${fileName}，文件大小：${fileSize}</span><button class="delfile">删除</button>`

    dom.querySelector('.delfile').onclick = function () {
      flyWeightObj.delFile(id)
    }

    document.body.appendChild(dom)

    uploadDatabase[id] = {
      fileName,
      fileSize,
      dom
    }

    return flyWeightObj
    },
    setExternalState (id, flyWeightObj) {
      const uploadData = uploadDatabase[id]
      for (const key in uploadData) {
        flyWeightObj[key] = uploadData[key]
      }
    }
  }
})()
```
最后改写startUpload函数：
```javascript
let id = 0

window.startUpload = function (uploadType. files) {
  for (let i = 0, file; file = files[i++]) {
    const uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize)
  }
}
```
最后测试使用：
```javascript
startUpload('plugin', [
  {
    fileName: '1.txt',
    fileSize: 1000
  },
  {
    fileName: '2.txt',
    fileSize: 3000
  },
  {
    fileName: '3.html',
    fileSize: 4000
  }
])

startUpload('flash', [
  {
    fileName: '1.txt',
    fileSize: 1000
  },
  {
    fileName: '2.txt',
    fileSize: 3000
  },
  {
    fileName: '3.html',
    fileSize: 4000
  }
])
```
使用享元模式重构之前，一共创建了6个upload对象，而重构之后，对象的数量减少为2，而且就算上传的文件有2000个，upload对象数量依旧是2。

### 对象池
对象池维护一个装载空闲对象的池子，如果需要对象的时候，不是直接创建，而是从对象池里获取。如果对象池里没有空闲对象，则创建一个新的对象，当获取的对象完成它的职责之后，再进入池子等待下次获取。对象池的应用广泛，HTTP连接池和数据库连接池都是代表应用，在Web前端开发中，对象池使用的场景大多是跟DOM相关，因为创建DOM和操作DOM既耗费空间也耗费时间。
<br>
<br>
**地图小气泡对象池**
<br>
假设我们开发一个地图应用，地图上经常会出现一些标志地面建筑的小气泡，我们称呼为tooltip。假设我们在搜附近的网吧时地图上出现了两个小气泡，然再搜附近的便利店，页面上出现了6个气泡。使用对象池实现的思想，第一次搜创建的2个气泡不会被删除，而是它们放在对象池中，在第二次搜索的时候，就可以复用前面2个，只需要再创建4个气泡。下面看代码实现：
```javascript
const tooltipFactory = (function () {
  const tooltipPool = []

  return {
    create () {
      // 对象池为空则创建
      if (tooltipPool.length === 0) {
        const div = document.createElement('div')
        document.body.appendChild(div)
        return div
      } else {
        return tooltipPool.shift()  // 从对象池里取出一个
      }
    },
    recover (tooltip) {
      return tooltipPool.push(tooltip)
    }  
  }
})()
```
第一次搜索的时候，创建两个tooltip，创建ary数组保存tooltip，方便下次搜索绘制前回收:
```javascript
let ary = []
const tooltips = ['A', 'B']
for (let i = 0, len = tooltips.length; i < len; i++) {
  const tooltip = tooltipFactory.create()
  tooltip.innerHTML = tooltips[i]
  ary.push(tooltip) 
}
```
第二次搜索绘制前，先回收前面两个tooltip:
```javascript
for (let i = 0, len = ary.length; i < len; i++) {
  tooltipFactory.recover(ary[i])
}
```
再创建6个气泡：
```javascript
const tooltips = ['A', 'B', 'C', 'D', 'E', 'F']
for (let i = 0, len = tooltips.length; i < len; i++) {
  const tooltip = tooltipFactory.create()
  tooltip.innerHTML = tooltips[i]
}
```
对象池跟享元模式思想有点相似，虽然innerHTML的值也可以看作tooltip的外部状态，但在这里我们并没有主动分离内部状态和外部状态。
<br>
<br>
**通用对象池的实现**
```javascript
const objectPollFactory = function (createObjFn) {
  const objectPool = []

  return {
    create () {
      // 对象池为空则创建
      const obj = objectPool.length === 0 ? 
      createObjFn.apply(this, arguments) : objectPool.shift()
      
      return obj
    },
    recover (obj) {
      return objectPool.push(obj)
    }  
  }
}
```
对象池是另一种性能优化方案，它跟享元模式有点类似，但没有分离内部状态和外部状态这个过程。

### 总结
享元模式是一种很好的性能优化方案，但也会带来一些复杂性的问题，从文件上传的例子我们可以看出，使用了享元模式，我们需要多维护一个factory对象和一个manager对象，在不使用享元模式的环境下，这些开销是可以避免的。享元模式带来的好处很大程度取决于如何使用以及何时使用，当你的项目出现以下情况比较适合使用享元模式：
- 一个程序中使用了大量的相似对象
- 使用了大量对象后，造成很大的内存开销
- 对象的大多数状态可以变为外部状态
- 剥离出对象的外部状态后，可以用相对较少的共享对象取代大量对象

使用享元模式的关键是把内部状态和外部状态分离开来，有多少种内部状态的组合，系统中并最多存在多少个共享对象。