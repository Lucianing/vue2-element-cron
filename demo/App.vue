<template>
  <div class="wrapper">
    <el-form :model="formData" :rules="rules" label-width="120px">
      <el-form-item
        prop="crontab"
        label="Crontab表达式"
        :status-icon="false"
      >
        <Vue2ElementCron
          disabledSecond
          disabledMinute
          v-model="formData.crontab"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Vue2ElementCron from '../src'

@Component({
  name: 'App',
  inheritAttrs: false,
  components: {
    Vue2ElementCron
  }
})
export default class App extends Vue {
  rules = {
    crontab: [
      {
        required: true,
        message: '请输入Crontab表达式',
        trigger: 'blur'
      }
    ]
  }

  formData = {
    crontab: '* * * * * ?'
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
}
</style>
