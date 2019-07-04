import routes from 'imRouter/routes'
import importElement from 'imUtils/importElement'

import 'imStyles/palette.styl'
import 'imStyles/index.styl'
import 'imStyles/element-variables.scss'
import 'imStyles/iconfont.css'
import 'imStyles/code.styl'
import 'imStyles/content.styl'

export default ({ Vue, router }) => {
  Vue.use(routes, { router })
  Vue.use(importElement)
  document && integrateGitalk(router)
}

function integrateGitalk (router) {
  const linkGitalk = document.createElement('link')
  linkGitalk.href = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css'
  linkGitalk.rel = 'stylesheet'
  document.body.appendChild(linkGitalk)
  const scriptGitalk = document.createElement('script')
  scriptGitalk.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js'
  document.body.appendChild(scriptGitalk)

  router.afterEach((to) => {
    if (scriptGitalk.onload) {
      loadGitalk(to)
    } else {
      scriptGitalk.onload = () => {
        loadGitalk(to)
      }
    }
  })

  function loadGitalk (to) {
    let commentsContainer = document.getElementById('gitalk-container')
    if (!commentsContainer) {
      commentsContainer = document.createElement('div')
      commentsContainer.id = 'gitalk-container'
      commentsContainer.classList.add('content')
    }
    setTimeout(() => {
      const $page = document.querySelector('.post-content')
      if ($page) {
        $page.parentNode.appendChild(commentsContainer)
        if (typeof Gitalk !== 'undefined' && Gitalk instanceof Function) {
          renderGitalk(to.fullPath)
        }
      }
    }, 500)
  }

  function renderGitalk () {
    const gitalk = new Gitalk({
      clientID: 'ae5562a3ea00bbc28ddf', 
      clientSecret: '0f66f08756e3330a4422b9ed668b9572cb878f67',
      repo: 'Vue_Blog', // 你的博客的仓库名称
      owner: 'echoLC', // 你在githug上的用户名称
      id: 'comment',
      distractionFreeMode: false,
      language: 'zh-CN',
    })
    gitalk.render('gitalk-container')
  }
}
