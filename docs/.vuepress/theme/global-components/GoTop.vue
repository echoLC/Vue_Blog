<template>
  <el-button
    @click="GoTop"
    v-show="!isPost"
    :class="{show: show}"
    type="primary"
    circle
    class="gotop-btn"
  >
    <i class="el-icon-arrow-up"></i>
  </el-button>
</template>

<script>
import { getScrollTop } from '../utils/dom'

export default {
  name: 'GoTop',
  data () {
    return {
      show: false
    };
  },
  computed: {
    isPost () {
      return this.$route.path.slice(1, 6) === "posts" ? true : false
    }
  },
  mounted () {
    this.hasShow()
  },
  methods: {
    hasShow () {
      window.addEventListener('scroll', () => {
        this.show = getScrollTop() > 400 ? true : false
      })
    },
    GoTop () {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style lang="scss" scoped>
.gotop-btn {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  position: fixed;
  right: 15px;
  bottom: 10px;
  z-index: 69;
  opacity: 0;
  transform: scale(0);
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);

  i {
    font-size: 1.5em;
    font-weight: 600;
  }
}
.show {
  opacity: 1;
  transform: scale(1);
}
</style>