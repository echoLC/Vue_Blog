<template>
  <el-footer class="container-footer">
    <el-row
      :class="{footerMargin: !isHide}"
      type="flex"
      justify="center"
      align="center"
      class="footer-warp">
      <el-col
        :span="24"
        class="footer-top">
      <p class="friendly-link">
        <a href="https://github.com/echoLC" class="link-item" target="_blank"><i class="iconfont icon-github"></i></a>
        <a href="https://juejin.im/user/5b968adde51d450e942efed2" class="link-item juejin-link" target="_blank"><img src="https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg" alt="juejin logo"></a>
      </p>
        <p class="ellipsis footer-text">
          Powered by <a href="https://vuepress.vuejs.org" target="_blank">VuePress</a>
        </p>
      </el-col>
    </el-row>
  </el-footer>
</template>
<script>
export default {
  name: "MyFooter",
  props: {
    isHide: {
      type: Boolean,
      default: false
    },
    content: {
      type: Array,
      default: () => []
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-footer {
  padding: 0;
  height auto !important
}

.container-footer {
  overflow: hidden;
  text-align: center;
  width: 100%;
  font-size: 13px;

  .footerMargin .footer-top, .footerMargin .footer-bottom {
    margin-left: 122px;
  }

  a {
    color: rgba(255, 255, 255, 0.88);
  }

  .footer-warp {
    flex-direction: column;
    color: rgba(255, 255, 255, 0.6);
    background: #50C878;
    padding 16px 0

    .footer-top, .footer-bottom {
      transition: 0.2s ease-in-out;

      p {
        margin: 0;
      }
    }

    .footer-top {
      background: #50C878;
      .footer-text {
        color #fff
        font-size 16px
        a {
          text-decoration underline
        }
      }
      .friendly-link {
        i {
          font-size: 26px;
        }
        img {
          width 45px; 
          height 45px;
        }
        a {
          padding-right 12px
          text-decoration none
        }
        .juejin-link img {
          padding-bottom 10px
        }
      }
    }
  }
}

@media (max-width: 1190px) {
  .footerMargin .footer-top, .footerMargin .footer-bottom {
    margin-left: 0 !important;
  }
}
</style>