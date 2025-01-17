<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { artDeleteChannelService, artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const channelList = ref([])
const loading = ref(false)

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  console.log(res)
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()
const onDeleteChannel = async (row) => {
  await ElMessageBox.confirm('确认删除？', '温馨提醒', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await artDeleteChannelService(row.id)
  ElMessage({type:'success', message: '删除成功'})
  getChannelList()
}

const onEditChannel = (row) => {
  dialog.value.open(row)
}
const dialog = ref()
const onAddChannel = () => {
  dialog.value.open({})
}

const fatherCmpRefresh = () => {
  getChannelList()
}

</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作">
        <!-- row就是channelList的一项，$index下标
       -->
        <template #default="{ row, $index }">
          <el-button :icon="Edit" type="primary" circle plain @click="onEditChannel(row, $index)">
          </el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteChannel(row, $index)"
          >
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <ChannelEdit ref="dialog" @refreshList="fatherCmpRefresh"></ChannelEdit>
  </page-container>
</template>

<style lang="scss" scoped></style>
