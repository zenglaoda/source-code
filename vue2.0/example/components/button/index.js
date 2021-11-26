var elButtonOptions = {
    name: 'el-button',
    props: {
        round: {
            type: Boolean,
            default: false
        }
    },
    render(c) {
        return c('button', {
            attrs: this.$attrs,
            on: this.$listeners,
            class: {
                'el-button': true,
                'is-circle': this.round,
            }
        }, this.$slots.default)
    }
};

var elButton = {
    install(Vue) {
        const style = `
            .el-button {
                display: inline-block;
                line-height: 1;
                white-space: nowrap;
                cursor: pointer;
                background: #fff;
                border: 1px solid #dcdfe6;
                color: #606266;
                -webkit-appearance: none;
                text-align: center;
                box-sizing: border-box;
                outline: none;
                margin: 0;
                transition: .1s;
                font-weight: 500;
                padding: 12px 20px;
                font-size: 14px;
                border-radius: 4px;
            }
            .el-button.is-primary {
                background-color: #409eff;
            }
            .el-button.is-plain {
                background-color: #409eff;
            }
            .el-button.is-circle {
                border-radius: 50%;
            }
        `;
        window.lib.utils.loadStyle(style);
        Vue.component(elButtonOptions.name, elButtonOptions);
    }
};

Vue.use(elButton);
