<script setup>
//setup范围中的this是undefined 切记
/*
1.获取路由对象 router
const router = useRouter()
2.获取路由参数 route
const route = useRoute()     这两个东西傻傻分不清楚
 */
import {useRouter, useRoute} from 'vue-router'
import TestDemo from '@/components/TestDemo.vue'
import { useUserStore } from '@/stores'

const router = useRouter()
const route = useRoute()
console.log(router)
console.log(route)
const userStore = useUserStore()


</script>

<template>
  <router-view></router-view>

  <hr/>
  <hr>
  <hr>

  <div>
    <div>我是app</div>
    <p>{{userStore.token}}</p>
    <el-button @click="userStore.setToken('牢黄')">登录</el-button>
    <el-button @click="userStore.removeToken()">退出</el-button>
    <test-demo></test-demo>
  </div>

</template>

<style scoped>

</style>
