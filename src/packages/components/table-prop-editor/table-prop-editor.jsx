/*
 * @Author: your name
 * @Date: 2021-01-31 20:30:33
 * @LastEditTime: 2021-01-31 20:30:51
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \visual-editor\src\packages\components\table-prop-editor\table-prop-editor.tsx
 */
import { defineComponent } from 'vue';
import { useModel } from '../../utils/use-model';
import { ElButton, ElTag } from 'element-plus';
import { $$tablePropEditor } from './table-prop-edit.service';
export const TablePropEditor = defineComponent({
    props: {
        modelValue: { type: Array },
        propConfig: { type: Object, required: true }
    },
    emits: {
        'update:modelValue': (val) => true
    },
    setup(props, ctx) {
        const model = useModel(() => props.modelValue, val => ctx.emit('update:modelValue', val));
        const onClick = async () => {
            const data = await $$tablePropEditor({
                config: props.propConfig,
                data: props.modelValue || []
            });
            model.value = data;
        };
        return () => {
            return (<div>
                    {(!model.value || model.value.length === 0) && <ElButton {...{ onClick }}>添加</ElButton>}
                    {(model.value || []).map(item => (<ElTag {...{ onClick }}>{item[props.propConfig.table.showKey]}</ElTag>))}
                </div>);
        };
    }
});
//# sourceMappingURL=table-prop-editor.jsx.map