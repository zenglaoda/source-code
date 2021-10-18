import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

// Vue.property.__init
initMixin(Vue)
// Vue.property.$data $watch $props $set $delete
stateMixin(Vue)
// Vue.property.$on $once $off $emit方法
eventsMixin(Vue)
// Vue.property._update $destroy $forceUpdate
lifecycleMixin(Vue)
// Vue.property.$nextTick $nextTick _render 及其他render help函数
renderMixin(Vue)

export default Vue
