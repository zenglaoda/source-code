## vue3 新特性

### 初始化应用
```javascript
    var app = Vue.createApp(options)
    // 注册全局组件
    app.component()
    // 组册全局指令
    app.directive()
    // 注册插件
    app.use()
```

### 声明组件会触发的事件,并检验事件参数
```javascript
    var options = {
        /** @type {string[], object} */
        emits: {}
    }
```

### 生命周期改变
```
vue3:
    setup(新增)
    beforeCreate
    created
    beforeMount
    mounted
    beforeUpdate
    updated
    beforeUnmount (对应 2.x 的 beforeDestroy)
    unmounted (对应 2.x 的 destroyed)

vue2:
    beforeCreate
    created
    beforeMount
    mounted
    beforeUpdate
    updated
    beforeDestroy
    destroyed
```

### 组册异步组件
vue2.0
```javascript
// 方式一.
Vue.component('el-button', (resolve, reject) => {
    resolve(options);
});

// 方式二
Vue.component('el-button', () => import(options))

// options 可以是 Vue 组件配置对象或者是异步组件工厂函数的配置项
```

vue3.0
```javascript
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)
app.component('async-component', AsyncComp)

// 还可以配合 Suspense 组件使用，Suspense 可控制组件的加载状态
```



### setup 生命周期函数
```javascript
var options = {
    setup(props, context) {
        
    }
}
// 1. setup 生命周期里面的 this 不是组件实例,
// 2. setup 返回对象时, 该对象里面的属性会被合并到其他选项里面
// 3. setup 生命周期函数只会执行一会
// 4. props 对象是响应式的，但是使用对象结构有可能使解构的属性失去响应式，所以解构 props 用 toRefs 方法, 当解构的属性是可选时使用 toRef,
// 5. context.expose, setup 返回 render 方法时，可通过该方法向副组件暴露属性
```

### 组合式API-生命周期
onBeforeMount, onMounted, onBeforeUpdate, onUpdated等

### 组合式API
ref, // 参数为原始值时包装一下,对象时调用 reactive方法
toRef, // 在响应式对象上添加一个新的响应式属性
toRefs, // 用于对象的解构
reactive, 
provide, 
inject,
computed,
watch,
watchEffect,

```javascript
import { ref, reactive } from 'vue';

// ref
// reactive

```



### 新增组件
1. teleport

### 组件选项
1. expose
2. emits
3. 去除 filters