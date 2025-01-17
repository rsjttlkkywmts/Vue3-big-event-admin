<script setup>
import { artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: [Number, String]
  }
})
const data = ref([])

const getChannelList = async () => {
  const res = await artGetChannelsService()
  data.value = res.data.data
}
getChannelList()
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <el-select  :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)">
    <el-option v-for="item in data" :label="item.cate_name" :value="item.id" :key="item.id">
    </el-option>
  </el-select>
</template>

<style scoped lang="scss">

</style>