<template>
  <el-main
    class="my-main"
    :style="{marginLeft: mainLeft + 'px'}">
    <content-header :content="content"></content-header>
    <keep-alive>
      <component
        :is="whichComponent"
        :content="content"></component>
    </keep-alive>
  </el-main>
</template>

<script>
export default {
  name: 'Main',
  props: {
    isHide: {
      type: Boolean,
      default: false
    },
    content: {
      type: Array,
      default: () => []
    }
  },
  components: {
    All: () => import("imComponents/All"),
    Posts: () => import("imComponents/Posts"),
    Tags: () => import("imComponents/Tags"),
    About: () => import("imComponents/About"),
    Home: () => import("imComponents/Home")
  },
  computed: {
    whichComponent () {
      const componentNameMap = {
        'posts': 'Posts',
        'all/': 'All',
        'tags/': 'Tags',
        'about': 'About',
      }
      const componentKey = this.$page.path.slice(1, 6)
      let componentName = componentNameMap[componentKey] || 'Home'

      if (typeof window === undefined) {
        return componentName
      }

      const title = this.$site.title
      const { all, tags, about, home } = this.$themeConfig.menus

      const documentTitleMap = {
        'posts': `${all}${title}`,
        'all/': `${all}${title}`,
        'tags/': `${tags}${title}`,
        'about': `${about}${title}`,
      }

      if (componentKey !== 'posts') {
        document.title = documentTitleMap[componentKey] || `${home}${title}`
      }
      
      if (this.$route.path.indexOf("/tags/") > -1 && !componentName) {
        componentName  = 'Tags'
        document.title = `${tags} . ${this.$route.params.tag} . ${title}`
      }
      return componentName
    },
    mainLeft () {
      return this.isHide ? 60 : 240
    }
  }
};
</script>

<style lang="stylus" scoped>
.my-main {
  margin: 56px 0 0 240px;
  transition: 0.2s ease-in-out;
  padding: 0;
  overflow: hidden;
  padding-bottom: 113px;
  width: 100%;
}

@media (max-width: 1190px) {
  .my-main {
    margin-left: 0 !important;
  }
}
</style>