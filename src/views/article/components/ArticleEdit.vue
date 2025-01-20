<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artAddArticleService, artGetDetailService, artUpdateArticleService } from '@/api/article.js'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request.js'
import axios from 'axios'

const emit = defineEmits(['success'])

//控制抽屉显示隐藏
const visibleDrawer = ref(false)
//富文本组件
const editorRef = ref()

const defaultData = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
//准备数据
const formModel = ref({ ...defaultData })
const imgURL = ref('')

//向外暴露一个方法，根据传进来的参数确定是编辑还是添加
const open = async (data) => {
  visibleDrawer.value = true
  if (data.id) {
    //需要基于id查询文章详情，进行回显
    const res = await artGetDetailService(data.id)
    console.log(res)
    formModel.value = res.data.data
    imgURL.value = baseURL + formModel.value.cover_img
    //编辑更新，需要将网络图片地址转换为file对象
    const file =await convertImageToFile(imgURL.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    //说明是添加文章
    formModel.value = { ...defaultData }
    //清空图片预览和富文本
    imgURL.value = ''
    editorRef.value.setHTML('')
    console.log('添加')
  }
}
//这样暴露方法
defineExpose({
  open
})
const onSelectFile = (uploadFile) => {
  imgURL.value = URL.createObjectURL(uploadFile.raw)  //预览图片
  formModel.value.cover_img = uploadFile.raw
}

//表单验证
const formRef = ref()
const rules = {
  title: [
    { required: true, message: '请输入文章标题名称', trigger: 'blur' },
    { patter: /^\S{1,30}$/, message: '文章标题1-10位', trigger: 'blur' }
  ],
  cate_id: [
    { required: true, message: '请选择分类', trigger: 'blur' }
  ],
  cover_img: [
    { required: true, message: '请上传封面图片', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ]
}

//文章发布按钮
const onPublish = async (state) => {
  await formRef.value.validate()
  formModel.value.state = state
  //但是接口需要的是FormData类型的数据，所以需要将formModel.value转换成FormData类型
  const formData = new FormData()
  for (const key in formModel.value) {
    formData.append(key, formModel.value[key])
  }
  //发请求
  if (formModel.value.id) {
    await artUpdateArticleService(formData)
    ElMessage.success('修改成功')
    emit('success','edit')
  } else {
    await artAddArticleService(formData)
    ElMessage.success('添加成功')
    emit('success', 'add')
  }
  visibleDrawer.value = false

}

//方法，将网络图片地址转换为file对象
const convertImageToFile = async (imageUrl, fileName) => {
  try {
    //const imageUrl = 'https://example.com/image.jpg' // 这里替换为你需要转换的网络图片地址
    const response = await axios.get(imageUrl, { responseType: 'blob' })
    const blob = response.data
   // const fileName = 'image.jpg' // 可以根据实际情况修改文件名
    const file = new File([blob], fileName, { type: blob.type })
    console.log('转换后的文件对象:', file)
    // 可以在这里对文件对象进行后续处理，例如上传等操作
    return file
  } catch (error) {
    console.error('转换失败:', error)
  }
}
</script>

<template>
  <el-drawer
    v-model='visibleDrawer'
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction='rtl'
    size='50%'
  >
    <!-- 发表文章表单 -->
    <el-form :model='formModel' ref='formRef' label-width='100px' :rules='rules'>
      <el-form-item label='文章标题' prop='title'>
        <el-input v-model='formModel.title' placeholder='请输入标题'></el-input>
      </el-form-item>
      <el-form-item label='文章分类' prop='cate_id'>
        <channel-select
          v-model='formModel.cate_id'
          width='100%'
        ></channel-select>
      </el-form-item>
      <el-form-item label='文章封面' prop='cover_img'>
        <el-upload
          class='avatar-uploader'
          :show-file-list='false'
          :auto-upload='false'
          :on-change='onSelectFile'
        >
          <img v-if='imgURL' :src='imgURL' class='avatar' alt='' />
          <el-icon v-else class='avatar-uploader-icon'>
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label='文章内容' prop='content'>
        <div class='editor'>
          <QuillEditor ref='editorRef' theme='snow' v-model:content='formModel.content' content-type='html' />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='onPublish("已发布")'>发布</el-button>
        <el-button type='info' @click='onPublish("草稿")'>草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped lang='scss'>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
