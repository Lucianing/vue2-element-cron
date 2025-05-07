<template>
  <el-radio-group
    v-model="type"
    class="crontab-radio-group"
    @change="handleChangeValue"
  >
    <div class="crontab-radio-item">
      <el-radio :label="-1">
        每分 允许的通配符 [, - * /]
      </el-radio>
    </div>
    <div class="crontab-radio-item">
      <el-radio :label="1">
        周期从
        <el-input-number
          v-model="cycleStart"
          size="medium"
          :min="0"
          :max="59"
          :controls="false"
          @change="handleChangeValue"
        />
        -
        <el-input-number
          v-model="cycleEnd"
          size="medium"
          :min="minCycleEnd"
          :max="59"
          :controls="false"
          @change="handleChangeValue"
        />
        分
      </el-radio>
    </div>
    <div class="crontab-radio-item">
      <el-radio :label="2">
        从
        <el-input-number
          v-model="startVal"
          size="medium"
          :min="0"
          :max="59"
          :controls="false"
          @change="handleChangeValue"
        />
        分开始，每
        <el-input-number
          v-model="endVal"
          size="medium"
          :min="minEndVal"
          :max="59"
          :controls="false"
          @change="handleChangeValue"
        />
        分执行一次
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
import { CommonWatchAction } from './mixins'
import { mixins } from 'vue-class-component'

@Component({
  name: 'MinutePane'
})
export default class MinutePane extends mixins(CommonWatchAction) {
  list = this.generateList(60)
}
</script>
