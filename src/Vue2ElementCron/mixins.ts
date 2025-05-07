import Vue from 'vue'
import { mixins } from 'vue-class-component'
import { Component, ModelSync, Watch } from 'vue-property-decorator'
import { isNil } from './utils'

@Component
export class CommonState extends Vue {
  @ModelSync('value', 'change', { type: String })
  readonly crontab!: string

  /**
   * 选择类型：每一、周期、从到、指定 之类
   * -1: 每一
   * 0: 不指定
   * 1: 周期
   * 2: 从到
   * 3: 指定
   * 4: 每日x号开始 / 本月最后一个星期几
   * 5: 本月最后一日
   */
  type: null | number = null

  /**
   * 周期开始值
   */
  cycleStart: null | number = 1

  /**
   * 周期结束值
   */
  cycleEnd: null | number = 2

  /**
   * 从到开始值
   */
  startVal: null | number = 1

  /**
   * 从到结束值
   */
  endVal: null | number = 2

  /**
   *
   */
  lastVal: null | number = 1

  /**
   * 指定值
   */
  specifiedValue: number[] = []

  /**
   * 周期结束最小值
   */
  get minCycleEnd (): number {
    return (this.cycleStart || 0) + 1
  }

  /**
   * 从结束最小值
   */
  get minEndVal (): number {
    return (this.startVal || 0) + 1
  }

  /**
   * 生成指定值列
   * @param total
   * @param rowCount
   * @param isNoZero
   * @returns
   */
  public generateList (total: number, rowCount = 12, isNoZero = false): number[][] {
    const arr: number[][] = []
    for (let i = 0; i < total; i++) {
      if (i % rowCount === 0) {
        arr.push([])
      }
      arr[arr.length - 1].push(isNoZero ? i + 1 : i)
    }
    return arr
  }
}

@Component
export class CommonWatchAction extends mixins(CommonState) {
  @Watch('crontab', { immediate: true })
  onChange (newVal: string) {
    if (newVal === '*') {
      this.type = -1
      return
    }

    if (newVal === '?') {
      this.type = 0
      return
    }

    // 本月最后一日
    if (newVal === 'L') {
      this.type = 5
      return
    }

    // 周 本月最后一个星期几
    if (newVal.endsWith('L')) {
      this.type = 4
      const n = Number(newVal.slice(0, -1))
      this.lastVal = isNaN(n) ? null : n
      return
    }

    // 日 每月x 号最近的那个工作日
    if (newVal.endsWith('W')) {
      this.type = 4
      const n = Number(newVal.slice(0, -1))
      this.lastVal = isNaN(n) ? null : n
      return
    }

    // 周 第x星期的星期x
    if (newVal.indexOf('#') > -1) {
      this.type = 2
      const [start, end] = newVal.split('#')
      this.startVal = Number(end)
      this.endVal = Number(start)
      return
    }

    if (newVal.indexOf('-') > -1) {
      this.type = 1
      const [cycleStart, cycleEnd] = newVal.split('-')
      this.cycleStart = Number(cycleStart)
      this.cycleEnd = Number(cycleEnd)
      return
    }

    if (newVal.indexOf('/') > -1) {
      this.type = 2
      const [startVal, endVal] = newVal.split('/')
      this.startVal = Number(startVal)
      this.endVal = Number(endVal)
      return
    }

    if (newVal.indexOf(',') > -1) {
      this.type = 3
      this.specifiedValue = newVal.split(',').map(Number)
    }

    // 单个数字
    const n = Number(newVal)
    if (!isNaN(n)) {
      this.type = 3
      this.specifiedValue = [n]
    }
  }

  public getCronStr (): string {
    // 任意
    if (this.type === -1) {
      return '*'
    }

    // 不指定
    if (this.type === 0) {
      return '?'
    }

    // 周期
    if (this.type === 1 && !isNil(this.cycleStart) && !isNil(this.cycleEnd)) {
      return `${this.cycleStart}-${this.cycleEnd}`
    }

    // 从x开始到x结束
    if (this.type === 2 && !isNil(this.startVal) && !isNil(this.endVal)) {
      return `${this.startVal}/${this.endVal}`
    }

    // 指定值
    if (this.type === 3 && this.specifiedValue.length > 0) {
      return this.specifiedValue.join(',')
    }

    return ''
  }

  public handleChange () {
    const v = this.getCronStr()
    this.$emit('change', v)
  }

  public handleChangeValue () {
    this.$nextTick().then(() => {
      this.handleChange()
    })
  }
}
