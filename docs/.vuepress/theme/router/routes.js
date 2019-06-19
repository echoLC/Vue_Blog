const Layout = () => import('../layouts/Layout.vue')

const install = (Vue, { router }) => {
  let routeNames = ['/', '/all/', '/about/', '/tags/', '/tags/:tag', '/posts/:post']
  const routes = []

  for (var i = 0, len = routeNames.length; i < len; i++) {
    routes.push({
      name: routeNames[i],
      path: routeNames[i],
      component: Layout
    })
  }

  router.addRoutes(routes)
  let loaderWrapper

  router.beforeEach((to, from, next) => {
    if (typeof window === 'undefined') {
      return next()
    }
    loaderWrapper = loaderWrapper || document.getElementById('loader-wrapper')
    loaderWrapper.style.display = 'block'
    loaderWrapper.style.opacity = '1'
    next()
  })

  router.afterEach(() => {
    if (typeof window === 'undefined') return

    loaderWrapper.style.opacity = '0'

    setTimeout(() => {
      loaderWrapper.style.display = 'none'
    }, 200)
  })
}

export default {
  install
}
