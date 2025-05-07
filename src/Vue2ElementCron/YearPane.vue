<template>
  <el-radio-group
    v-model="type"
    class="crontab-radio-group"
    @change="handleChangeValue"
  >
    <div class="crontab-radio-item">
      <el-radio :label="-1">
        每年 允许的通配符[, - * /]
      </el-radio>
    </div>
    <div class="crontab-radio-item">
      <el-radio :label="0">
        不指定
      </el-radio>
    </div>
    <div class="crontab-radio-item">
      <el-radio :label="1">
        周期 从
        <el-input-number
          v-model="cycleStart"
          size="medium"
          :min="currentYear"
          :max="maxYear"
          :controls="false"
          @change="handleChangeValue"
        />
        至
        <el-input-number
          v-model="cycleEnd"
          size="medium"
          :min="cycleStart || (currentYear + 1)"
          :max="maxYear"
          :controls="false"
          @change="handleChangeValue"
        />
      </el-radio>
    </div>
  </el-radio-group>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { CommonWatchAction } from './mixins'

@Component({
  name: 'YearPane'
})
export default class YearPane extends mixins(CommonWatchAction) {
  currentYear = new Date().getFullYear()
  maxYear = this.currentYear + 10

  @Watch('crontab', { immediate: true })
  onChange (newVal: string) {
    if (!newVal) {
      this.type = 0
    }
  }

  /**
   * 重写 handleChangeValue方法， 不指定年份的时候，传空字符
   */
  public handleChangeValue () {
    this.$nextTick().then(() => {
      const v = this.getCronStr()
      const emitVal = v === '?' ? '' : v
      this.$emit('change', emitVal)
    })
  }
}
</script>
