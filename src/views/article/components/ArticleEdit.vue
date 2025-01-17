<script setup>
import { ref } from 'vue'

//控制抽屉显示隐藏
const visibleDrawer = ref(false)

//向外暴露一个方法，根据传进来的参数确定是编辑还是添加
const open = (data) => {
  visibleDrawer.value = true

  console.log(data)
}

//这样暴露方法
defineExpose({
  open
})
</script>

<template>
  <el-drawer
    :modelValue="visibleDrawer"
    title="I am the title"
    :direction="direction"
    :before-close="handleClose"
    size="80%"
  >
    <span>Hi, there!</span>
  </el-drawer>
</template>

<style scoped lang="scss">

</style>