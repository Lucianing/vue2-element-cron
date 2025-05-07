<template>
  <el-radio-group
    v-model="type"
    class="crontab-radio-group"
    @change="handleChangeValue"
  >
    <div class="crontab-radio-item">
      <el-radio :label="-1">
        每月 允许的通配符 [, - * /]
      </el-radio>
    </div>
    <div class="crontab-radio-item">
      <el-radio :label="0">
        不指定
      </el-radio>
    </div>
    <div class="crontab-radio-item">
      <el-radio :label="1">
        周期从
        <el-input-number
          v-model="cycleStart"
          size="medium"
          :min="1"
          :max="12"
          :controls="false"
          @change="handleChangeValue"
        />
        至
        <el-input-number
          v-model="cycleEnd"
          size="medium"
          :min="cycleStart || 1"
          :max="12"
          :controls="false"
          @change="handleChangeValue"
        />
        月
      </el-radio>
    </div>
    <div class="crontab-radio-item">
      <el-radio :label="2">
        从
        <el-input-number
          v-model="startVal"
          size="medium"
          :min="1"
          :max="12"
          :controls="false"
          @change="handleChangeValue"
        />
        月开始，每
        <el-input-number
          v-model="endVal"
          size="medium"
          :min="startVal || 1"
          :max="12"
          :controls="false"
          @change="handleChangeValue"
        />
        月执行一次
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
        <div
          v-for="(item, index) in list"
          :key="index"
        >
          <el-checkbox
            v-for="it in item"
            :key="it"
            :label="it"
          >
            {{ it }}
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </div>
  </el-radio-group>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { CommonWatchAction } from './mixins'

@Component({
  name: 'MonthPane'
})
export default class MonthPane extends mixins(CommonWatchAction) {
  get list () {
    const arr: number[][] = []
    for (let i = 0; i < 12; i++) {
      if (i % 12 === 0) {
        arr.push([])
      }
      arr[arr.length - 1].push(i + 1)
    }
    return arr
  }
}
</script>
