import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router/index.js'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // 1. 基础地址，超时时间
  baseURL,
  timeout: 10000,
})
//请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 2. 携带token
    const userStore = useUserStore()
    if(userStore.token){
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    // 4. 摘取核心响应数据
    if(res.code === 0){
      return res
    }else{
    // 3. 处理业务失败
      ElMessage.error(res.data.message || '服务异常')
      return Promise.reject(res.data)
    }
  },
  (err) => {
    // 5. 处理401错误
    if(err.response.status === 401){
      router.push('/login')
    }

    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
