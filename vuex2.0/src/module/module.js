import { forEachValue } from '../util'

/**
 * @typedef {Object} OptionModule
 * @prop {Object<string, any>} state
 * @prop {Object<string, function>} getters
 * @prop {Object<string, function>} mutations
 * @prop {Object<string, function>} actions
 */

/**
 * @typedef {Object<string, Module>} Children
 * 
 */

// Base data struct for store's module, package with some attribute and method
export default class Module {
  constructor (rawModule, runtime /* 初始化时为 false */) {
    this.runtime = runtime

    /** @type {Object<string, Module>} */
    // Store some children item
    this._children = Object.create(null)

    /** @type OptionModule */
    // Store the origin module object which passed by programmer
    this._rawModule = rawModule

    const rawState = rawModule.state

    // Store the origin module's state
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
  }

  get namespaced () {
    return !!this._rawModule.namespaced
  }

  /**
   * @param {string} key module name 
   * @param {Module} module 
   */
  addChild (key, module) {
    this._children[key] = module
  }

  removeChild (key) {
    delete this._children[key]
  }

  getChild (key) {
    return this._children[key]
  }

  hasChild (key) {
    return key in this._children
  }

  update (rawModule) {
    this._rawModule.namespaced = rawModule.namespaced
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters
    }
  }

  forEachChild (fn) {
    forEachValue(this._children, fn)
  }

  forEachGetter (fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn)
    }
  }

  forEachAction (fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn)
    }
  }

  forEachMutation (fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn)
    }
  }
}
