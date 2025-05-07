<template>
  <el-radio-group
    v-model="type"
    class="crontab-radio-group"
    @change="handleChangeValue"
  >
    <div class="crontab-radio-item">
      <el-radio :label="-1">
        周 允许的通配符 [, - * / L #]
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
        <el-select
          v-model="cycleStart"
          size="medium"
          @change="handleChangeValue"
        >
          <el-option
            v-for="item in list"
            :key="item.value"
            :value="item.value"
            :label="item.option"
          />
        </el-select>
        至
        <el-select
          v-model="cycleEnd"
          size="medium"
          @change="handleChangeValue"
        >
          <el-option
            v-for="item in list"
            :key="item.value"
            :value="item.value"
            :label="item.option"
          />
        </el-select>
      </el-radio>
    </div>
    <div class="crontab-radio-item">
      <el-radio :label="2">
        第
        <el-input-number
          v-model="startVal"
          size="medium"
          :min="1"
          :max="4"
          :controls="false"
          @change="handleChangeValue"
        />
        星期的
        <el-select
          v-model="endVal"
          size="medium"
          @change="handleChangeValue"
        >
          <el-option
            v-for="item in list"
            :key="item.value"
            :value="item.value"
            :label="item.option"
          />
        </el-select>
      </el-radio>
    </div>
    <div class="crontab-radio-item">
      <el-radio :label="4">
        本月最后一个
        <el-select
          v-model="lastVal"
          size="medium"
          @change="handleChangeValue"
        >
          <el-option
            v-for="item in list"
            :key="item.value"
            :value="item.value"
            :label="item.option"
          />
        </el-select>
      </el-radio>
    </div>
    <div class="crontab-radio-item">
      <el-radio :label="3">
        指定
      </el-radio>
      <el-checkbox-group
        v-model="specifiedValue"
        class="crontab-appoint-group"
        @change="handleChangeValue"
      >
        <el-checkbox
          v-for="item in list"
          :key="item.value"
          :label="item.value"
        >
          {{ `${item.value} (${item.label})` }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </el-radio-group>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { CommonWatchAction } from './mixins'
import { isNil } from './utils'

@Component({
  name: 'WeekPane',
  inheritAttrs: false
})
export default class SecondPane extends mixins(CommonWatchAction) {
  list = [
    {
      label: '周日',
      option: '星期日',
      value: 1
    },
    {
      label: '周一',
      option: '星期一',
      value: 2
    },
    {
      label: '周二',
      option: '星期二',
      value: 3
    },
    {
      label: '周三',
      option: '星期三',
      value: 4
    },
    {
      label: '周四',
      option: '星期四',
      value: 5
    },
    {
      label: '周五',
      option: '星期五',
      value: 6
    },
    {
      label: '周六',
      option: '星期六',
      value: 7
    }
  ]

  private getWeekCronStr () {
    if (this.type === 2 && !isNil(this.startVal) && !isNil(this.endVal)) {
      return `${this.endVal}#${this.startVal}`
    }
    if (this.type === 4 && !isNil(this.lastVal)) {
      return `${this.lastVal}L`
    }
    const v = this.getCronStr()
    if (v) {
      return v
    }
    return ''
  }

  public handleChangeValue () {
    this.$nextTick().then(() => {
      const v = this.getWeekCronStr()
      this.$emit('change', v)
    })
  }
}
</script>
