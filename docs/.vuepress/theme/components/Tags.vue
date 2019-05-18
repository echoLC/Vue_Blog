<template>
  <div class="tag-content">
    <el-row
      type="flex"
      align="center"
      justify="center">
      <el-col
        :span="20"
        :xs="{span: 23}"
        :sm="{span: 22}"
        :md="{span: 22}"
        :lg="{span: 20}"
        class="tag-card">
        <el-tag
          @click="setTag"
          v-for="(tag, index) in tagsList"
          :key="index"
          size="medium"
          :hit="true"
        >{{ tag[0].name }}</el-tag>
      </el-col>
    </el-row>
    <div
      v-if="hasTagsList.length"
      class="tag-warp">
      <el-row
        type="flex"
        align="center"
        justify="center"
        class="post-list">
        <el-col
          v-for="(post, index) in hasTagsList"
          :key="index"
          :span="10"
          :xs="{span: 23}"
          :sm="{span: 11}"
          :md="{span: 11}"
          :lg="{span: 10}"
          class="list">
          <el-card>
            <div class="post-title-time ellipsis">{{ post.lastUpdated }}</div>
            <router-link
              :to="post.path"
              class="post-title-link"
            >{{ post.title }}</router-link>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import tagsList from 'imData/tagsList.js'

export default {
  name: 'Tags',
  data () {
    return {
      tagName: '',
      tagsList
    };
  },
  props: {
    content: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    hasTagsList () {
      const hasTagsList = this.tagsList[this.tagName]
      if (!hasTagsList) {
        return []
      }
      return hasTagsList.slice(1)
    }
  },
  methods: {
    setTag (e) {
      this.tagName = e.target.innerText
      this.setContentHeaderInnerText(this.tagName)
    },
    checkRouter () {
      const tagName = this.$route.params.tag
      if (tagName) {
        this.tagName = tagName
        this.setContentHeaderInnerText(tagName)
      }
    },
    setContentHeaderInnerText (text) {
      document.getElementById('conentHeader').innerText = text
    }
  },
  created () {
    this.checkRouter()
  }
}
</script>

<style lang="scss" scoped>
.post-title-time {
  font-weight: 500;
  font-size: 15px;
  color: #727272;
  margin: 10px 10px 0;
}
.post-title-link {
  color: #333;
  font-size: 19px;
  padding: 0 10px 10px;
  display: flex;
}
.tag-content {
  margin-top: -38px;
  padding-bottom: 30px;
}

.tag-card {
  padding: 20px;
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  border-radius: 4px;
  box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2),
    0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12);
}

.post-list {
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.list {
  margin: 15px 0;
  &:first-child,
  &:nth-child(2) {
    margin-top: 30px;
  }
}

@media (min-width: 1190px) {
  .tag-card {
    width: 83.33333%;
  }
}
</style>
