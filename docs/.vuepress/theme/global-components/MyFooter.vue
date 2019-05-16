<template>
  <el-footer class="container-footer">
    <el-row
      :class="{footerMargin: !isHide}"
      type="flex"
      justify="center"
      align="center"
      class="footer-warp"
    >
      <el-col
        :span="24"
        class="footer-top"
      >
        <p class="ellipsis">
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
}

.container-footer {
  overflow: hidden;
  text-align: center;
  width: 100%;
  line-height: 1.6;
  font-size: 13px;

  .footerMargin .footer-top, .footerMargin .footer-bottom {
    margin-left: 122px;
  }

  a {
    color: rgba(255, 255, 255, 0.88);
    border-bottom: 1px dotted rgba(255, 255, 255, 0.5);
  }

  .footer-warp {
    flex-direction: column;
    color: rgba(255, 255, 255, 0.6);
    background: #50C878;

    .footer-top, .footer-bottom {
      line-height: 56.5px;
      height: 56.5px;
      transition: 0.2s ease-in-out;

      p {
        line-height: 56.5px;
        margin: 0;
      }
    }

    .footer-top {
      background: #50C878;
    }
  }
}

@media (max-width: 1190px) {
  .footerMargin .footer-top, .footerMargin .footer-bottom {
    margin-left: 0 !important;
  }
}
</style>