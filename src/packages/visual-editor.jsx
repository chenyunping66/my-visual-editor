/*
 * @Author: your name
 * @Date: 2021-01-23 14:49:35
 * @LastEditTime: 2021-01-24 19:23:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo-visual-editor\src\packages\visual-editor.tsx
 */
import { defineComponent } from "vue";
import './visual-editor.scss';
import { useModel } from "@/packages/utils/useModel";
import { VisualEditorBlock } from "./visual-editor-block";
export const VisualEditor = defineComponent({
    props: {
        modelValue: { type: Object },
    },
    emits: {
        'update:modelValue': (val) => true,
    },
    setup(props, ctx) {
        const dataModel = useModel(() => props.modelValue, val => ctx.emit('update:modelValue', val));
        return () => (<div class="visual-editor">
        可视化组件
        <div class="visual-editor-menu">
        visual-editor-menu
        </div>
        <div class="visual-editor-header">
        visual-editor-header
        </div>
        <div class="visual-editor-operator">
        visual-editor-operator
        </div>
        <div class="visual-editor-body">
        <div class="visual-editor-content">
        
        {!!dataModel.value && !!dataModel.value.blocks && (dataModel.value.blocks.map((block, index) => {
            <VisualEditorBlock block={block} key={index}/>;
        }))}
        </div>
        </div>
      </div>);
    },
});
//# sourceMappingURL=visual-editor.jsx.map