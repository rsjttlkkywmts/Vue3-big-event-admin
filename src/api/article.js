import request from '@/utils/request.js'
//获取文章分类
export const artGetChannelsService = () => {
  return request.get('my/cate/list')
}
//添加文章分类
export const artAddChannelService = (data) => {
  return request.post('/my/cate/add',data)
}
//编辑文章分类
export const artEditChannelService = (data) => {
  return request.put('/my/cate/info',data)
}
//删除文章分类
export const artDeleteChannelService = (id) => {
  return request.delete(`/my/cate/del`, {
    params: {
      id
    }
  })
}


export const artGetListService = (data) => {
  return request.get('/my/article/list',{
    params: data
  })
}
