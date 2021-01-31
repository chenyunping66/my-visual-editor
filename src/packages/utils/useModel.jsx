/*
 * @Author: your name
 * @Date: 2021-01-24 19:12:31
 * @LastEditTime: 2021-01-31 19:42:31
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \visual-editor\src\packages\utils\useModel.tsx
 */
import { ref, watch } from 'vue';
export function useModel(getter, emitter) {
    const state = ref(getter());
    watch(getter, val => {
        if (val !== state.value) {
            state.value = val;
        }
    });
    return {
        get value() { return state.value; },
        set value(val) {
            if (state.value !== val) {
                state.value = val;
                emitter(val);
            }
        }
    };
}
// export const TestUseModel = defineComponent({
//     props: {
//         modelValue: { type: String }
//     },
//     emit: {
//         'update:modelValue': (val?: string) => true
//     },
//     setup(props: any, ctx: any) {
//         const model = useModel(() => props.modelValue, val => ctx.emit('update:modelValue', val))
//         return () => (
//             <div>
//                 自定义输入框
//                 <input type="text" v-model={model.value} />
//             </div>
//         )
//     },
// })
//# sourceMappingURL=useModel.jsx.map