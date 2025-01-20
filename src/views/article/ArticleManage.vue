<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import { artGetListService } from '@/api/article.js'
import { formatTime } from '@/utils/format.js'
import ArticleEdit from '@/views/article/components/ArticleEdit.vue'

const articleList = ref([])
const total = ref(0)
const loading = ref(false) //loading状态
/*定义请求参数对象*/
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  console.log(res)
  articleList.value = res.data.data
  articleList.value.forEach((item) => {
    item.pub_date = formatTime(item.pub_date)
  })
  total.value = res.data.total
  loading.value = false
}
getArticleList()

const onEditArticle = (row) => {
  articleEditOrAddRef.value.open(row)
}

const onDeleteArticle = (row) => {
  console.log(row)
}
//处理分页逻辑
const onSizeChange = (size) => {
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}

const onCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}

const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}

const onReset = () => {
  params.value = {
    pagenum: 1,
    pagesize: 5,
    cate_id: '',
    state: ''
  }
  getArticleList()
}

const articleEditOrAddRef = ref()
const onAddArticle = () => {
  articleEditOrAddRef.value.open({})
}
//添加或者编辑成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    //最好渲染最后一页
    params.value.pagenum = Math.ceil((total.value + 1) / params.value.pagesize)
  }
  getArticleList()
}
</script>

<template>
  <page-container title='文章管理'>
    <template #extra>
      <el-button type='primary' @click='onAddArticle'>添加文章</el-button>
    </template>
    <!--表单区域-->
    <el-form inline>
      <el-form-item label='文章分类：'>
        <channel-select v-model='params.cate_id'></channel-select>
      </el-form-item>
      <el-form-item label='发布状态：'>
        <el-select v-model='params.state'>
          <el-option label='已发布' value='已发布' />
          <el-option label='草稿' value='草稿' />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='onSearch'>搜索</el-button>
        <el-button @click='onReset'>重置</el-button>
      </el-form-item>
    </el-form>
    <!--表格区域-->
    <el-table :data='articleList' v-loading='loading'>
      <el-table-column label='文章标题' prop='title'>
        <template #default='{ row }'>
          <el-link type='primary' :underline='false'>{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label='分类' prop='cate_name'></el-table-column>
      <el-table-column label='发表时间' prop='pub_date'></el-table-column>
      <el-table-column label='状态' prop='state'></el-table-column>
      <el-table-column label='操作'>
        <!--利用作用域插槽row可以获取当前行的数据，相当于v-for的 item-->
        <template #default='{ row }'>
          <el-button
            circle
            plain
            type='primary'
            :icon='Edit'
            @click='onEditArticle(row)'
          ></el-button>
          <el-button
            circle
            plain
            type='danger'
            :icon='Delete'
            @click='onDeleteArticle(row)'
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <el-pagination
      v-model:current-page='params.pagenum'
      v-model:page-size='params.pagesize'
      :page-sizes='[2, 3, 5, 10]'
      :background='true'
      layout='jumper, total, sizes, prev, pager, next, '
      :total='total'
      @size-change='onSizeChange'
      @current-change='onCurrentChange'
      style='margin-top: 20px; justify-content: flex-end'
    />
    <!--抽屉    -->
    <article-edit ref='articleEditOrAddRef' @success='onSuccess'></article-edit>
  </page-container>
</template>

<style lang='scss' scoped>
.el-input {
  --el-input-width: 220px;
}

.el-select {
  --el-select-width: 220px;
}
</style>
