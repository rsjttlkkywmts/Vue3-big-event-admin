import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index.js'

//createRouter创建路由实例
//配置模式
//createWebHistory——history 地址栏带#
//createWebHashHistory——hash  不带#
const router = createRouter({
  //meta.env.BASE_URL vite中的环境变量，可以在vite.config.js中配置
  history: createWebHistory(import.meta.env.BASE_URL), //.meta.env.BASE_URL 基地址的路径——地址栏中固定的前缀
  //譬如 qq.com/lol/的  /lol
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue'), //这是异步组件的写法
    },
    {
      path: '/',
      component: () => import('@/views/layout/LayOutContainer.vue'),
      redirect: '/article/manage',
      children: [
        { path: '/article/manage', component: () => import('@/views/article/ArticleManage.vue') },
        { path: '/article/channel', component: () => import('@/views/article/ArticleChannel.vue') },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue'),
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue'),
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue'),
        },
      ],
    },
  ],
})

//登录访问拦截
router.beforeEach((to) => {
  const userStore = useUserStore()
  if(!userStore.token && to.path !== '/login') {
    return '/login'
  }
  return true  //默认不写这个return true也行
})
export default router
