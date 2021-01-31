/*
 * @Author: your name
 * @Date: 2021-01-24 19:12:31
 * @LastEditTime: 2021-01-31 19:42:31
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \visual-editor\src\packages\utils\useModel.tsx
 */
import { ref, computed, watch, defineComponent } from 'vue';

export function useModel<T>(getter: () => T, emitter: (val: T) => void) {
    const state = ref(getter()) as { value: T };

    watch(getter, val => {
        if (val !== state.value) {
            state.value = val;
        }
    })

    return {
        get value() { return state.value },
        set value(val: T) {
            if (state.value !== val) {
                state.value = val;
                emitter(val)
            }
        } 
    }
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
