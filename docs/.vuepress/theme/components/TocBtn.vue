<template>
  <span>
    <el-button
      @click="openToc"
      type="primary"
      circle
      class="toc-btn">
      <i class="iconfont icon-top02"></i>
    </el-button>
    <el-button
      @click="goTop"
      :class="{ show: show }"
      type="primary"
      circle
      class="gotop-btn">
      <i class="el-icon-arrow-up"></i>
    </el-button>
  </span>
</template>

<script>
export default {
  name: 'GoTop',
  data () {
    return {
      show: false
    }
  },
  mounted () {
    this.hasShow()
  },
  methods: {
    openToc () {
      this.$emit('toc')
    },
    hasShow () {
      window.addEventListener('scroll', () => {
        const scrollTop = this.getScrollTop()
        this.show = scrollTop > 400 ? true : false
      })
    },
    goTop () {
      let scrollTop = this.getScrollTop()
      if (scrollTop > 0) {
        window.requestAnimationFrame(this.goTop)
        window.scrollTo(0, scrollTop - scrollTop / 8)
      }
    },
    getScrollTop () {
      let scrollPos
      const doc = document
      if (window.pageYOffset) {
        scrollPos = window.pageYOffset
      } else if (doc.compatMode && doc.compatMode !== 'BackCompat') {
        scrollPos = doc.documentElement.scrollTop
      } else if (doc.body) {
        scrollPos = doc.body.scrollTop
      }
      return scrollPos
    }
  }
};
</script>

<style lang="scss" scoped>
.gotop-btn,
.toc-btn {
  position: fixed;
  right: 15px;
  bottom: 10px;
  z-index: 69;
  color: #fff;
  background-color: #50C878;
  border-color: #50C878;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);

  i {
    font-size: 1.5em;
    font-weight: 600;
  }
}
.toc-btn {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  opacity: 1;
  transform: scale(1);
}
.gotop-btn {
  display: none;
  opacity: 0;
  transform: scale(0);
}
@media (min-width: 1190px) {
  .gotop-btn {
    display: inline-block;
  }
  .toc-btn {
    opacity: 0;
    transform: scale(0);
  }
}
.show {
  opacity: 1;
  transform: scale(1);
}
</style>