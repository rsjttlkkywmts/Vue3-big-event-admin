<script setup>
//setup范围中的this是undefined 切记
import { zhCn } from 'element-plus/es/locale/index'
</script>

<template>
  <el-config-provider :locale="zhCn">
  <router-view></router-view>
  </el-config-provider>
</template>

<style scoped>

</style>
