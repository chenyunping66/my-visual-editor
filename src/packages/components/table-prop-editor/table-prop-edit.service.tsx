import { VisualEditorProps } from '@/packages/visual-editor.props';
import { defineComponent, reactive } from 'vue';
import { PropType } from 'vue';
import { defer } from '../../utils/defer';
import { onMounted } from 'vue';
import { getCurrentInstance } from 'vue';
import { ElButton, ElDialog, ElTable, ElTableColumn } from 'element-plus';
import deepcopy from 'deepcopy';
import { ElInput } from 'element-plus';
import { createApp } from 'vue';

export interface TablePropEditorServiceOption {
    data: any[];
    config: VisualEditorProps;
    onConfirm: (val: any[]) => void;
}

const ServiceComponent = defineComponent({
    props: {
        option: { type: Object as PropType<TablePropEditorServiceOption>, required: true }
    },

    setup(props) {
        const ctx = getCurrentInstance()!;

        const state = reactive({
            option: props.option,
            showFlag: false,
            mounted: (() => {
                const dfd = defer();
                onMounted(() => setTimeout(dfd.resolve));
                return dfd.promise;
            })(),
            editData: [] as any[]
        });

        const methods = {
            service: (option: TablePropEditorServiceOption) => {
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
            onDelete:(index: number)=>{
                state.editData.splice(index,1);
            }
        };

        Object.assign(ctx.proxy!, methods);

        return () => (
            // @ts-ignore
            <ElDialog v-model={state.showFlag}>
                {{
                    default: () => (
                        <div>
                            <div>
                                <ElButton {...({ onClick: methods.add } as any)}>添加</ElButton>
                                <ElButton {...({ onClick: methods.reset } as any)}>重置</ElButton>
                            </div>
                            <ElTable data={state.editData}>
                                <ElTableColumn {...{ type: 'index' }}></ElTableColumn>
                                {state.option.config.table!.options.map((item, index) => (
                                    <ElTableColumn {...{ label: item.label }}>
                                        {{
                                            default: ({ row }: { row: any }) => <ElInput v-model={row[item.field]} />
                                        }}
                                    </ElTableColumn>
                                ))}
                                <ElTableColumn {...{ label: '操作' }}>
                                    {{
                                        default:({$index}: {$index: number})=>(
                                            <ElButton type="danger" {...{onClick:()=>handler.onDelete($index)}}>删除</ElButton>
                                        )
                                    }}
                                </ElTableColumn>
                            </ElTable>
                        </div>
                    ),
                    footer: () => (
                        <>
                            <ElButton {...({ onClick: handler.onCancel } as any)}>取消</ElButton>
                            <ElButton {...({ onClick: handler.onConfirm } as any)} type="primary">
                                确定
                            </ElButton>
                        </>
                    )
                }}
            </ElDialog>
        );
    }
});

export const $$tablePropEditor = (() => {
    let instance: any;

    return (option: Omit<TablePropEditorServiceOption, 'onConfirm'>) => {
        if (!instance) {
            const el = document.createElement('div');
            document.body.appendChild(el);
            const app = createApp(ServiceComponent, { option });
            instance = app.mount(el);
        }
        const dfd = defer<any[]>();

        instance.service({
            ...option,
            onConfirm: dfd.resolve
        });
        return dfd.promise;
    };
})();