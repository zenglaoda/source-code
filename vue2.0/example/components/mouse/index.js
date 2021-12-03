var elMouseOptions = {
    name: 'el-mouse',
    data() {
        return {
            left: 0,
            top: 0,
        };
    },
    mounted() {
        const callback = (event) => {
            this.left = event.x;
            this.top = event.y;
        };

        document.addEventListener('click', callback, false);
        this.$once('hook:beforeDestroy', () => {
            document.removeEventListener('click', callback, false);
        });
    },
    render(c) {
        const scopedVnodes = this.$scopedSlots.default({
            left: this.left,
            top: this.top
        });
        const vnodes = this.$slots.default;

        return c('div', {},  [...vnodes, ...scopedVnodes]);
    }
};

var elMouse = {
    install(Vue) {
        Vue.component(elMouseOptions.name, elMouseOptions);
    }
};

Vue.use(elMouse);
