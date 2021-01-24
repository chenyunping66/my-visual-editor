/*
 * @Author: your name
 * @Date: 2021-01-24 19:12:31
 * @LastEditTime: 2021-01-24 19:54:21
 * @LastEditors: Please set LastEditors
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
        },
    };
}
// export const TestUseodel = defineComponent({
//   props:{
//     modelValue:{type:String}
//   },
//   emit:{
//     'update:modelValue':(val?: string)=>true
//   },
//   setup(props,ctx){
//     // const model =  useModel(getter()=>props.modelValue,emitter:val=>ctx.emit('update:modelValue',val))
//     const model =  useModel(() => props.modelValue, val => ctx.emit('update:modelValue', val))
//     return ()=>{
//       <div>
//         自定义输入框
//         <input type="text" v-model={model.value}></input>
//       </div>
//     }
//   },
// })
//# sourceMappingURL=useModel.jsx.map