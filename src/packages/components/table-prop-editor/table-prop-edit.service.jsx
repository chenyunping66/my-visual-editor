import { defineComponent, reactive } from 'vue';
import { defer } from '../../utils/defer';
import { onMounted } from 'vue';
import { getCurrentInstance } from 'vue';
import { ElButton, ElDialog, ElTable, ElTableColumn } from 'element-plus';
import deepcopy from 'deepcopy';
import { ElInput } from 'element-plus';
import { createApp } from 'vue';
const ServiceComponent = defineComponent({
    props: {
        option: { type: Object, required: true }
    },
    setup(props) {
        const ctx = getCurrentInstance();
        const state = reactive({
            option: props.option,
            showFlag: false,
            mounted: (() => {
                const dfd = defer();
                onMounted(() => setTimeout(dfd.resolve));
                return dfd.promise;
            })(),
            editData: []
        });
        const methods = {
            service: (option) => {
                state.option = option;
                state.editData = deepcopy(option.data || []);
                methods.show();
            },
            show: async () => {
                await state.mounted;
                state.showFlag = true;
            },
            hide: () => {
                state.showFlag = false;
            },
            add: () => {
                state.editData.push({});
            },
            reset: () => {
                state.editData = deepcopy(state.option.data);
            }
        };
        const handler = {
            onConfirm: () => {
                state.option.onConfirm(state.editData);
                methods.hide();
            },
            onCancel: () => {
                methods.hide();
            },
            onDelete: (index) => {
                state.editData.splice(index, 1);
            }
        };
        Object.assign(ctx.proxy, methods);
        return () => (
        // @ts-ignore
        <ElDialog v-model={state.showFlag}>
                {{
            default: () => (<div>
                            <div>
                                <ElButton {...{ onClick: methods.add }}>添加</ElButton>
                                <ElButton {...{ onClick: methods.reset }}>重置</ElButton>
                            </div>
                            <ElTable data={state.editData}>
                                <ElTableColumn {...{ type: 'index' }}></ElTableColumn>
                                {state.option.config.table.options.map((item, index) => (<ElTableColumn {...{ label: item.label }}>
                                        {{
                default: ({ row }) => <ElInput v-model={row[item.field]}/>
            }}
                                    </ElTableColumn>))}
                                <ElTableColumn {...{ label: '操作' }}>
                                    {{
                default: ({ $index }) => (<ElButton type="danger" {...{ onClick: () => handler.onDelete($index) }}>删除</ElButton>)
            }}
                                </ElTableColumn>
                            </ElTable>
                        </div>),
            footer: () => (<>
                            <ElButton {...{ onClick: handler.onCancel }}>取消</ElButton>
                            <ElButton {...{ onClick: handler.onConfirm }} type="primary">
                                确定
                            </ElButton>
                        </>)
        }}
            </ElDialog>);
    }
});
export const $$tablePropEditor = (() => {
    let instance;
    return (option) => {
        if (!instance) {
            const el = document.createElement('div');
            document.body.appendChild(el);
            const app = createApp(ServiceComponent, { option });
            instance = app.mount(el);
        }
        const dfd = defer();
        instance.service({
            ...option,
            onConfirm: dfd.resolve
        });
        return dfd.promise;
    };
})();
//# sourceMappingURL=table-prop-edit.service.jsx.map