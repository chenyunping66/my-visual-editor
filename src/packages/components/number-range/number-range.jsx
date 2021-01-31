/*
 * @Author: your name
 * @Date: 2021-01-31 20:29:17
 * @LastEditTime: 2021-01-31 20:29:26
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \visual-editor\src\packages\components\number-range\number-range.tsx
 */
import './number-range.scss';
import { defineComponent } from 'vue';
import { useModel } from '../../utils/use-model';
export const NumberRange = defineComponent({
    props: {
        start: { type: String },
        end: { type: String }
    },
    emits: {
        'update:start': (val) => true,
        'update:end': (val) => true
    },
    setup(props, ctx) {
        const startModel = useModel(() => props.start, val => ctx.emit('update:start', val));
        const endModel = useModel(() => props.end, val => ctx.emit('update:end', val));
        return () => (<div class="number-range">
                <div><input type="text" v-model={startModel.value}/></div>
                <span>~</span>
                <div><input type="text" v-model={endModel.value}/></div>
            </div>);
    }
});
//# sourceMappingURL=number-range.jsx.map