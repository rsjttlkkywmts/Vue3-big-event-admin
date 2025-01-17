import request from '@/utils/request.js'
//注册
export const userRegisterService = ({username, password, repassword}) =>
  request.post(`/api/reg`, {username, password, repassword})
//登录
export const userLoginService = ({username, password}) =>
  request.post(`/api/login`, {username, password})

//获取用户基本信息
export const userGetInfoService = () =>{
  return request.get(`/my/userinfo`)
}
