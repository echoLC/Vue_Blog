---
title: 深入理解Webpack tree shaking
tags: [webpack]
categories: [webpack]
---

## tree shaking 是什么
首先我们先搞清楚，tree shaking是个什么东东，来看下 MDN 给的介绍：
> **Tree shaking** is a term commonly used within a JavaScript context to describe the removal of dead code.

翻译过来，大概意思就是：tree shaking是一个通常用来移除 JavaScript 上下文中未引用的代码，这些未引用的代码在英文中叫**dead code**。现在常用的模块打包器 Webpack 和 Rollup 都支持这个功能，这对于构建预发布的代码是非常重要的，tree shaking可以使最终文件结构更加简介，体积更小。

## 限制
可能看完前面的介绍，你会觉得，妈妈再也不用担心引入未使用的依赖了。但是，事情并没有那么理想。事实上，tree shaking 依赖于 `ES6` 中的 `import` 和 `export` 模块机制， 打包器会检测代码模块是否被导出、导入，且被 JavaScript 文件使用。我们知道，ES6 Module 是一种可以做静态分析的模块机制，所以使得我们在处理 ES6 模块的时候可以做 tree shaking 这样的优化。

那么问题来了，在 ES6 Module 出来之前，我们会有很多的遗留库或者 utils 不是基于 `import` 和 `export` 的，那么对于这类代码，怎么能避免可能出现的 `dead code` 情况。各位看官不要急，请继续往下看。

## Webpack 中的tree shaking
Weback2的时候已经支持 ES6 Module，但是并没有引入模块检测的功能，直到 Webpack4 时，才真正扩展了模块检测的功能，这时候才有了 tree shaking。

怎么能够让 Webpack 知道你项目的模块或者指定的模块都是 ES6 Module，可以让 Webpack 在构建的时候放心消除 `dead code`，其中一种方式是通过往 `package.json` 中添加 `sideEffects` 属性，将其值设置为 `false`，来告知 webpack，它可以安全地删除未用到的 export。当然它也可以是一个数组，例如：
```json
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js"
  ]
}
```
数组方式支持相对路径、绝对路径和 glob 模式匹配相关文件。添加在数组中的文件将不会受到 tree shaking 的影响，因为默认情况下，所有导入文件都会受到 tree shaking 的影响。这意味着，如果在项目中使用类似 css-loader 并 import 一个 CSS 文件，则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除：
```json
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js",
    "*.css"
  ]
}
```
你也可以通过 `module.rules` 配置选项设置 `sideEffects`，具体查看文档[module.rules](https://webpack.docschina.org/configuration/module/#rulesideeffects)。

### 看一个官网的例子
新建一个项目，目录结构如下：
```
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
  |- bundle.js
  |- index.html
|- /src
  |- index.js
|- /node_modules
```
然后添加一个 `math.js` util：
```
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
  |- bundle.js
  |- index.html
|- /src
  |- index.js
+ |- math.js
|- /node_modules
```
src/math.js的内容为：
```js
export function square(x) {
  return x * x;
}

export function cube(x) {
  return x * x * x;
}
```
 webpack.config.js 的配置为：
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  optimization: {
    usedExports: true,
  },
};
```
入口文件 index.js 里面的代码：
```js
import { cube } from './math.js'

function component () {
  const element = document.createElement('pre')

  element.innerHTML = [
    'Hello webpack!',
    '5 cubed is equal to ' + cube(5)
  ].join('\n\n')

  return element
}

document.body.appendChild(component())
```
在这里我们并没有引入 `cube` 函数，这样的代码就是没有使用的 `export` ，称为 `dead code`。

运行 `yarn build`，查看输出的 `bundle.js` 文件，发现有这么一些代码：
```js
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* unused harmony export square */\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return cube; });\nfunction square(x) {\n  return x * x;\n}\n\nfunction cube(x) {\n  return x * x * x;\n}\n\n\n//# sourceURL=webpack:///./src/math.js?");

/***/ })  
```
虽然在代码里添加了 `unused harmony export quare` 的注释，但是 `dead code` 仍旧还在打包后的代码里。在下面，我们通过 `sideEffects` 配置修复它。

修改 `package.json` 文件，添加 `sideEffects: false` 选项：
```json
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.12"
  },
  "scripts": {
    "build": "webpack --config webpack.config.js"
  },
+  "sideEffects": false
}
```

### sideEffects VS usedExports
sideEffects 和 usedExports（更多被认为是 tree shaking）是两种不同的优化方式，但是 `sideEffects` 更有效，因为它是允许跳过整个模块/文件和整个文件树。而 usedExports 依赖于 [terser](https://github.com/terser/terser) 这个工具去检查语句中的副作用，它是一个 JavaScript 任务。而且，因为规范说副作用需要被评估，所以导致它也不能跳过过子树和依赖的检查。虽然，`export` 表达式可以工作得很好，但是如果对于处理 `React` 中的 `HOC` 组件就会有问题。