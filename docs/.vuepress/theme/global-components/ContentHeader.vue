<template>
  <div class="content-header index-header" :class="headerClassName">
    <div class="container fade-scale in">
      <h1 id="conentHeader" class="title" :class="{'post-content-header': isPosts}">{{ title }}</h1>
      <h5 class="subtitle">{{ description }}</h5>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FixedHeader',
    props: {
      content: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      routePath () {
        return this.$route.path.slice(1, 6)
      },
      isPosts () {
        return this.routePath === 'posts' ? true : false
      },
      title () {
        const { archieve, tags, about } = this.$themeConfig.menus
        const title = this.$page.title
        const titleMap = {
          'posts': title,
          'archi': archieve || '文章归档',
          'tags/': tags || '标签分类',
          'about': about || '自我介绍'
        }
        return titleMap[this.routePath] || this.$site.title
      },
      description () {
        const getArchieveDesc = () => {
          const contentLen = this.content.length
          if (contentLen === 0) {
            return ''
          }
          const postStartDate = this.content[contentLen - 1].lastUpdated.slice(0, 7)
          const postEndDate = this.content[0].lastUpdated.slice(0, 7)
          return `${postStartDate}~${postEndDate}===>>>${contentLen}篇`
        }
        const descriptionMap = {
          'posts': this.$page.lastUpdated || '',
          'archi': getArchieveDesc(),
          'tags/': '' ,
          'about': ''
        }
        const description = descriptionMap[this.routePath]
        return description === undefined ? this.$site.description : description
      },
      headerClassName () {
        const classMap = new Map().set('about', 'about-header').set('posts', 'post-header')
        return classMap.get(this.routePath)
      }
    }
  };
</script>

<style lang="scss" scoped>
  .content-header {
    padding: 16px 16px 45px 354px;
    margin-left: -249px;
    width: 100%;
    color: #333;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    &.about-header {
      margin-left: 0;
      padding-left: 18px;
    }
    &.post-header {
      margin-left: 0;
      padding-left: 80px;
    }
  }

  .content-header .subtitle {
    padding-top: 11px;
    font-weight: 400;
    color: #666;
    font-size: 18px;
    line-height: 24px;
  }

  .content-header .title {
    font-weight: 500;
    font-size: 36px;
    line-height: 48px;
  }
  .post-content-header {
    font-weight: 400;
    font-size: 33px;
    line-height: 48px;
  }
  @media (max-width: 1190px) {
    .content-header {
      margin-left: 0;
      padding-left: 21px;
      width: auto;
    }
    .content-header .title {
      font-size: 28px;
    }
  }
</style>