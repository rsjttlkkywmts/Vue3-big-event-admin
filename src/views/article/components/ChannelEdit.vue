<script setup>
import { ref,  } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article.js'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const formModel = ref({
  cate_name: '',
  cate_alias: '',
})
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { patter: /^\S{1,10}$/, message: '分类名1-10位', trigger: 'blur' },
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    { patter: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名1-10位', trigger: 'blur' },
  ],
}

const open = (row) => {
  console.log(row)
  dialogVisible.value = true
  formModel.value = { ...row } //展开运算符，将row里面的数据展开
}

//向外暴露方法
defineExpose({
  open,
})
const emit = defineEmits(['refreshList'])
const formRef = ref()
const onsubmit = async () => {
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
    dialogVisible.value = false
  emit('refreshList')
}
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑分类' : '添加分类'" width="500">
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formModel.cate_name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formModel.cate_alias" placeholder="请输入分类别名"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onsubmit"> 确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
