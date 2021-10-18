/* @flow */
/**
 * 全局mixin混入,往Vue.options全局属性中混入一些方法和属性
 */
import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
