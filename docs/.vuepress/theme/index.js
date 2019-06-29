const path = require('path')
const moment = require('moment')
const fs = require('fs')

const resolve = (filePath) => {
  return path.resolve(__dirname, filePath)
}

const log = msg => {
  console.log(msg)
}

module.exports = (options, ctx) => ({
  plugins: [
    [
      '@vuepress/last-updated',
      {
        transformer: timestamp => {
          moment.locale('zh-CN')
          return moment(timestamp).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        }
      }
    ],
    ['@vuepress/pwa', 
      {
        serviceWorker: true,
        updatePopup: true
      }
    ]
  ],
  enhanceAppFiles: resolve('enhanceApp.js'),
  chainMarkdown(config) {
    config
      .plugin('anchor')
      .tap(([options]) => [
        Object.assign(options, {
          level: [1, 2, 3, 4, 5, 6]
        })
      ])
  },
  alias: {
    imStyles: resolve('styles'),
    imRouter: resolve('router'),
    imComponents: resolve('components'),
    imData: resolve('data'),
    imUtils: resolve('utils')
  },
  async ready() {
    //生成客户端所需的数据
    //只处理posts文件夹下的文件
    const postsFilter = val => val.path.slice(1, 6) === 'posts'
    //排序函数
    const postsSorter = (prev, next) => {
      return getTime(prev) - getTime(next) > 0 ? -1 : 1
    }
    // 获取时间
    const getTime = (dateObj) => {
      const date = dateObj['frontmatter']['date'] || dateObj['lastUpdated ']
      return (new Date(date) || new Date()).getTime()
    } 
    const { pages } = ctx
    //格式化 lastUpdated
    function changeDate(dateStr) {
      const str = JSON.stringify(dateStr, null, 2)
      const lastStr = str.slice(1, 11) + ' ' + str.slice(12, -6)
      return dateStr.length === undefined ? lastStr : dateStr
    }
    //进一步个性化 lastUpdated,全部文章页中使用
    function changeTime(dateStr) {
      const str = dateStr.slice(0, 7)
      const arr = str.split('-')
      let result = [
        arr[0] + '-' + arr[1],
        Number(arr[0]) + Number(arr[1])
      ]
      return result
    }
    //开始格式化和排序
    const posts = pages.filter(postsFilter)
    posts.sort(postsSorter)

    //存放最终数据的变量
    let archived = []
    let tagsList = {}
    let poList = []
    let search = []

    posts.forEach((val, index) => {
      //遍历posts目录生成包含所有文章信息的 archived
      let page = {}
      let sear = {}
      let {
        excerpt,
        lastUpdated,
        path,
        _strippedContent,
        frontmatter
      } = val
      
      let { tags, title, date } = frontmatter
  
      if (_strippedContent) {
        _strippedContent = _strippedContent
          .replace(/[\n\r]/g, ' ')
          .replace(/\s+/, ' ')
        const newStrippedContent = _strippedContent.slice(0, 100)
        const newExcerpt = newStrippedContent ? newStrippedContent + '......' : false
        excerpt = excerpt || newExcerpt
        excerpt = excerpt.replace(/#/g, '').replace(/^\!(.+)(\.png\))$/, 'image')
      } else {
        excerpt = ''
      }

      lastUpdated = date || lastUpdated || moment().format('YYYY-MM-DD HH:mm:ss')
      lastUpdated = changeDate(lastUpdated)
      tags = tags || ''
      title = title || '你忘记写title字段了'

      page.excerpt = excerpt
      page.tags = tags
      page.id = index
      page.title = title
      page.lastUpdated = lastUpdated
      page.path = path

      sear.title = title
      sear.path = path
      sear.strippedContent = _strippedContent

      archived.push(page)
      search.push(sear)

      //生成标签页的数据
      //剔除不需要的数据
      const tagItem = {
        id: index,
        lastUpdated,
        tags,
        title,
        path
      }

      const handleUnClassifiedTags = () => {
        let unClassifiedTag = tagsList['未分类']
        if (!unClassifiedTag) {
          unClassifiedTag = [{ name: '未分类' }]
        }
        unClassifiedTag.push(tagItem)
      }

      if (!tags) {
        handleUnClassifiedTags()
      } else {
        tags.forEach(tag => {
          if (tag === undefined) {
            handleUnClassifiedTags()
          }
          if (!tagsList[tag]) {
            tagsList[tag] = [{ name: tag }]
          }
          tagsList[tag].push(tagItem)
        })
      }
    })

    //生成全部文章页所需要的数据
    let index = 0
    archived.forEach((val, i) => {
      let result1 = changeTime(val.lastUpdated)
      if (archived.length === 1) {
        poList[0] = [result1[0]]
        return poList[0].push(val)
      }
      if (i + 1 !== archived.length) {
        var result2 = changeTime(
          archived[i + 1].lastUpdated
        )
      } else {
        var result2 = changeTime(
          archived[i - 1].lastUpdated
        )
      }
      if (!poList[index]) {
        poList[index] = [result1[0]]
      }
      if (!poList[index]) {
        poList[index] = [result2[0]]
      }
      poList[index].push(val)
      if (result1[1] !== result2[1]) {
        index++
      }
    })

    log('正在写入本地数据,加快在客户端的速度~~')

    const genDataFile = (filePath, fileData) => {
      fs.writeFile(
        `${resolve('data')}/${filePath}.js`,
        `export default ${JSON.stringify(fileData, null, 2)};`,
        error => {
          const logMsg = genLogFileMsg(filePath, error)
          log(logMsg)
        }
      )
    }

    const genLogFileMsg = (type, error) => {
      const fileNameMap = {
        content: '首页content',
        tagsList: '标签页tagList',
        search: '搜索页search',
        poList: '归档页postList'
      }
      const fileName = fileNameMap[type]
      return error ? `写入${fileName}文件失败` : `写入${fileName}文件成功`
    }

    genDataFile('content', archived)

    genDataFile('tagsList', tagsList)

    genDataFile('search', search)

    genDataFile('poList', poList)
  }
})
