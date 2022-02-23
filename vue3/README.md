```typescript
export interface App<HostElement = any> {
  version: string
  config: AppConfig
  use(plugin: Plugin, ...options: any[]): this
  mixin(mixin: ComponentOptions): this
  component(name: string): Component | undefined
  component(name: string, component: Component): this
  directive(name: string): Directive | undefined
  directive(name: string, directive: Directive): this
  mount(
    rootContainer: HostElement | string,
    isHydrate?: boolean,
    isSVG?: boolean
  ): ComponentPublicInstance
  unmount(): void
  provide<T>(key: InjectionKey<T> | string, value: T): this

  // internal, but we need to expose these for the server-renderer and devtools
  _uid: number
	// 创建组件时传递的配置选项
  _component: ConcreteComponent
  _props: Data | null
	// 组件根元素
  _container: HostElement | null
  _context: AppContext
	// 组件实例
  _instance: ComponentInternalInstance | null 

  /**
   * v2 compat only
   */
  filter?(name: string): Function | undefined
  filter?(name: string, filter: Function): this

  /**
   * @internal v3 compat only
   */
  _createRoot?(options: ComponentOptions): ComponentPublicInstance
}



export interface AppConfig {
  // @private
  readonly isNativeTag?: (tag: string) => boolean

  performance: boolean
  optionMergeStrategies: Record<string, OptionMergeFunction>
  globalProperties: Record<string, any>
  errorHandler?: (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => void
  warnHandler?: (
    msg: string,
    instance: ComponentPublicInstance | null,
    trace: string
  ) => void

  /**
   * Options to pass to @vue/compiler-dom.
   * Only supported in runtime compiler build.
   */
  compilerOptions: RuntimeCompilerOptions

  /**
   * @deprecated use config.compilerOptions.isCustomElement
   */
  isCustomElement?: (tag: string) => boolean

  /**
   * Temporary config for opt-in to unwrap injected refs.
   * TODO deprecate in 3.3
   */
  unwrapInjectedRef?: boolean
}



export interface AppContext {
  app: App // for devtools
  config: AppConfig
  mixins: ComponentOptions[]
  components: Record<string, Component>
  directives: Record<string, Directive>
  provides: Record<string | symbol, any>

  /**
   * Cache for merged/normalized component options
   * Each app instance has its own cache because app-level global mixins and
   * optionMergeStrategies can affect merge behavior.
   * @internal
   */
  optionsCache: WeakMap<ComponentOptions, MergedComponentOptions>
  /**
   * Cache for normalized props options
   * @internal
   */
  propsCache: WeakMap<ConcreteComponent, NormalizedPropsOptions>
  /**
   * Cache for normalized emits options
   * @internal
   */
  emitsCache: WeakMap<ConcreteComponent, ObjectEmitsOptions | null>
  /**
   * HMR only
   * @internal
   */
  reload?: () => void
  /**
   * v2 compat only
   * @internal
   */
  filters?: Record<string, Function>
}




const instance: ComponentInternalInstance = {
	uid: uid++,
	vnode,
	type, // vnode.type
	parent,
	appContext,
	root: null!, // to be immediately set
	next: null,
	subTree: null!, // will be set synchronously right after creation
	update: null!, // will be set synchronously right after creation
	scope: new EffectScope(true /* detached */),
	render: null,
	// instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers))
	proxy: null,
	exposed: null,
	exposeProxy: null,
	withProxy: null,
	provides: parent ? parent.provides : Object.create(appContext.provides),
	accessCache: null!,
	renderCache: [],

	// local resovled assets
	components: null,
	directives: null,

	// resolved props and emits options
	// NormalizedPropsOptions = [
	//   normalized, // 格式化之后的属性定义
	//   needCastKeys // camelize之后类型为 boolean 或存在  default 定义的键
	// ]
	propsOptions: normalizePropsOptions(type, appContext),
	// 声明这个组件可触发的事件 {}
	emitsOptions: normalizeEmitsOptions(type, appContext),

	// emit
	emit: null!, // to be set immediately
	emitted: null,

	// props default value
	propsDefaults: EMPTY_OBJ,

	// inheritAttrs
	inheritAttrs: type.inheritAttrs,

	// state
    // instance.ctx = { _: instance }
	ctx: EMPTY_OBJ,
	data: EMPTY_OBJ,
	props: EMPTY_OBJ,
	attrs: EMPTY_OBJ,
	slots: EMPTY_OBJ,
	refs: EMPTY_OBJ,
	// seetup 组合式函数执行之后的返回值， proxy
	setupState: EMPTY_OBJ,
	setupContext: null,

	// suspense related
	suspense,
	suspenseId: suspense ? suspense.pendingId : 0,
	asyncDep: null,
	asyncResolved: false,

	// lifecycle hooks
	// not using enums here because it results in computed properties
	isMounted: false,
	isUnmounted: false,
	isDeactivated: false,
	bc: null,
	c: null,
	bm: null,
	m: null,
	bu: null,
	u: null,
	um: null,
	bum: null,
	da: null,
	a: null,
	rtg: null,
	rtc: null,
	ec: null,
	sp: null
}



const vnode = {
	__v_isVNode: true,
	__v_skip: true,
	type, // rootComponent as ConcreteComponent
	// listeners, key, ref 等都是通过 rootProps 传递
	props, // rootProps
	key: props && normalizeKey(props),
	ref: props && normalizeRef(props),
	scopeId: currentScopeId,
	slotScopeIds: null,
	children,
	component: null, // createComponentInstance
	suspense: null,
	ssContent: null,
	ssFallback: null,
	dirs: null,
	transition: null,
	el: null,
	anchor: null,
	target: null,
	targetAnchor: null,
	staticCount: 0,
	shapeFlag,
	patchFlag,
	dynamicProps,
	dynamicChildren: null,
	appContext: null
}
```