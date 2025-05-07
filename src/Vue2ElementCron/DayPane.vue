
<template>
  <el-radio-group
    v-model="type"
    class="crontab-radio-group"
    @change="handleChangeValue"
  >
    <div class="crontab-radio-item">
      <el-radio :label="-1">
        每日 允许的通配符 [, - * / L W]
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
          :max="31"
          :controls="false"
          @change="handleChangeValue"
        />
        -
        <el-input-number
          v-model="cycleEnd"
          size="medium"
          :min="minCycleEndVal"
          :max="31"
          :controls="false"
          @change="handleChangeValue"
        />
        日
      </el-radio>
    </div>
    <div class="crontab-radio-item">
      <el-radio :label="2">
        从
        <el-input-number
          v-model="startVal"
          size="medium"
          :min="1"
          :max="31"
          :controls="false"
          @change="handleChangeValue"
        />
        日开始，每
        <el-input-number
          v-model="endVal"
          size="medium"
          :min="minEndVal2"
          :max="31"
          :controls="false"
          @change="handleChangeValue"
        />
        日执行一次
      </el-radio>
    </div>
    <div class="crontab-radio-item">
      <el-radio :label="4">
        每月
        <el-input-number
          v-model="lastVal"
          size="medium"
          :min="1"
          :max="31"
          :controls="false"
          @change="handleChangeValue"
        />
        号最近的那个工作日
      </el-radio>
    </div>
    <div class="crontab-radio-item">
      <el-radio :label="5">
        本月最后一日
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
import { isNil } from './utils'

@Component({
  name: 'DayPane'
})
export default class DayPane extends mixins(CommonWatchAction) {
  list = this.generateList(31, 12, true)

  get minCycleEndVal () {
    return (this.cycleStart || 1) + 1
  }

  get minEndVal2 () {
    return (this.cycleStart || 1) + 1
  }

  private getDayCronStr () {
    const v = this.getCronStr()
    if (v) {
      return v
    }
    if (this.type === 4 && !isNil(this.lastVal)) {
      return `${this.lastVal}W`
    }
    if (this.type === 5) {
      return 'L'
    }
    return ''
  }

  public handleChangeValue () {
    this.$nextTick().then(() => {
      const v = this.getDayCronStr()
      this.$emit('change', v)
    })
  }
}
</script>
