<template>
  <div class="crontab">
    <el-popover
      v-model="isVisible"
      popper-class="crontab-popover"
      placement="bottom-start"
      trigger="click"
    >
      <el-input
        slot="reference"
        v-model="crontab"
        :readonly="readonly"
        :clearable="clearable"
        :placeholder="placeholder"
        @click="isVisible = true"
        @clear="handleClear"
      />

      <div class="crontab-content">
        <el-tabs
          v-model="activeTabKey"
          class="crontab-tabs"
        >
          <el-tab-pane
            v-if="!disabledSecond"
            name="second"
          >
            <span slot="label" class="crontab-tabs-label">秒</span>
            <SecondPane v-model="second" />
          </el-tab-pane>
          <el-tab-pane
            v-if="!disabledMinute"
            name="minute"
          >
            <span slot="label" class="crontab-tabs-label">分</span>
            <MinutePane v-model="minute" />
          </el-tab-pane>
          <el-tab-pane label="时" name="hour">
            <span slot="label" class="crontab-tabs-label">时</span>
            <HourPane v-model="hour" />
          </el-tab-pane>
          <el-tab-pane label="日" name="day">
            <span slot="label" class="crontab-tabs-label">日</span>
            <DayPane v-model="day" />
          </el-tab-pane>
          <el-tab-pane label="月" name="month">
            <span slot="label" class="crontab-tabs-label">月</span>
            <MonthPane v-model="month" />
          </el-tab-pane>
          <el-tab-pane label="周" name="week">
            <span slot="label" class="crontab-tabs-label">周</span>
            <WeekPane v-model="week" />
          </el-tab-pane>
          <el-tab-pane label="年" name="year">
            <span slot="label" class="crontab-tabs-label">年</span>
            <YearPane v-model="year" />
          </el-tab-pane>
        </el-tabs>

        <div class="crontab-footer">
          <span
            class="crontab-footer-crontab-str"
            :style="isInvalid ? { color: 'var(--danger-color, rgb(245, 108, 108))' } : {}"
          >
            {{ isInvalid ? `${crontabStr} 错误的表达式` : crontabStr }}
          </span>
          <el-button
            type="primary"
            @click="handleConfirm"
          >
            确定
          </el-button>
          <el-button
            @click="handleCancel"
          >
            取消
          </el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch, ModelSync } from 'vue-property-decorator'
import { isValidCronExpression } from 'cron-expression-validator'
import SecondPane from './SecondPane.vue'
import MinutePane from './MinutePane.vue'
import HourPane from './HourPane.vue'
import DayPane from './DayPane.vue'
import WeekPane from './WeekPane.vue'
import MonthPane from './MonthPane.vue'
import YearPane from './YearPane.vue'

@Component({
  name: 'Vue2ElementCron',
  components: {
    SecondPane,
    MinutePane,
    HourPane,
    DayPane,
    WeekPane,
    MonthPane,
    YearPane
  }
})
export default class Vue2ElementCron extends Vue {
  @ModelSync('value', 'change', { type: String })
  readonly crontab!: string

  @Prop({
    type: Boolean,
    default: true
  })
  readonly clearable!: boolean

  @Prop({
    type: String,
    default: '请选择Cron表达式'
  })
  readonly placeholder!: string

  @Prop({
    type: Boolean,
    default: false
  })
  readonly readonly!: boolean;

  @Prop({
    type: Boolean,
    default: false
  })
  readonly disabledSecond!: boolean

  @Prop({
    type: Boolean,
    default: false
  })
  readonly disabledMinute!: boolean

  isVisible = false
  activeTabKey = 'second'

  second = ''
  minute = ''
  hour = ''
  day =''
  month = ''
  week = ''
  year = ''

  get crontabStr () {
    let s = this.second || '*'
    if (this.disabledSecond) {
      s = '0'
    }

    let m = this.minute || '*'
    if (this.disabledMinute) {
      m = '0'
    }

    return `${s} ${m} ${this.hour || '*'} ${this.day || '*'} ${this.month || '*'} ${this.week || ''} ${this.year || ''}`.trim()
  }

  get isInvalid () {
    return !isValidCronExpression(this.crontabStr)
  }

  created () {
    this.activeTabKey = this.getInitActiveTabKey()
  }

  @Watch('isVisible')
  onVisibleChange (val: boolean) {
    if (!val) {
      this.activeTabKey = this.getInitActiveTabKey()
      return
    }
    this.$nextTick().then(() => {
      this.parseCrontab()
    })
  }

  private getInitActiveTabKey () {
    if (this.disabledSecond && this.disabledMinute) {
      return 'hour'
    }

    if (this.disabledSecond) {
      return 'minute'
    }

    return 'second'
  }

  private handleClear () {
    this.$emit('change', '')
  }

  private handleConfirm () {
    if (this.isInvalid) {
      return
    }

    this.$emit('change', this.crontabStr)
    this.isVisible = false
  }

  private handleCancel () {
    this.isVisible = false
  }

  private parseCrontab (): void {
    if (!this.crontab) {
      return
    }

    const [
      second,
      minute,
      hour,
      day,
      month,
      week,
      year
    ] = this.crontab.trim().split(' ')

    this.second = second || '*'
    this.minute = minute || '*'
    this.hour = hour || '*'
    this.day = day || '*'
    this.month = month || '*'
    this.week = week || '*'
    this.year = year || ''
  }
}
</script>

<style lang="scss">
.crontab {
  width: 100%;
}

.el-popover.crontab-popover {
  padding: 0;

  .crontab-tabs {
    padding: 12px;

    .crontab-radio-group {
      padding: 8px 16px 0 16px;
      width: 916px;
      box-sizing: border-box;
    }

    .el-tabs__item  {
      padding: 0;
    }

    .crontab-tabs-label {
      display: inline-block;
      padding: 0 20px;
    }

    .crontab-radio-item {
      margin-bottom: 16px;
    }

    .el-input-number.is-without-controls {
      width: 100px;
      margin: 0 10px;
    }

    .el-select {
      margin: 0 10px;

      .el-input__suffix .el-input__icon.el-input__validateIcon {
        display: none;
      }
    }

    .crontab-appoint-group {
      margin-top: 10px;
      padding-left: 26px;

      .el-checkbox__label {
        min-width: 20px;
      }
    }
  }

  .crontab-footer {
    padding: 12px;
    text-align: center;
    border-top: 1px solid #ebeef5;

    .crontab-footer-crontab-str {
      margin-right: 10px;
    }
  }
}
</style>
