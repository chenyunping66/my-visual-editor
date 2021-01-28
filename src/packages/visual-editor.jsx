/*
 * @Author: your name
 * @Date: 2021-01-23 14:49:35
 * @LastEditTime: 2021-01-24 19:23:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo-visual-editor\src\packages\visual-editor.tsx
 */
import { computed, defineComponent, ref } from "vue";
import './visual-editor.scss';
import { useModel } from "@/packages/utils/useModel";
import { VisualEditorBlock } from "@/packages/visual-editor-block";
export const VisualEditor = defineComponent({
    name: 'VisualEditor',
    props: {
        modelValue: { type: Object, requird: true },
        config: { type: Object, requird: true }
    },
    emits: {
        'update:modelValue': (val) => true,
    },
    setup(props, ctx) {
        const dataModel = useModel(() => props.modelValue, val => ctx.emit('update:modelValue', val));
        const containerRef = ref({});
        const containerStyles = computed(() => ({
            width: `${dataModel.value?.container?.width}px`,
            height: `${dataModel.value?.container?.height}px`,
        }));
        // console.log(pros.config)
        const menuDraggier = {
            current: {
                component: null,
            },
            dragstart: (e, component) => {
                containerRef.value.addEventListener('dragenter', menuDraggier.dragenter);
                containerRef.value.addEventListener('dragover', menuDraggier.dragover);
                containerRef.value.addEventListener('dragleave', menuDraggier.dragleave);
                containerRef.value.addEventListener('dragend', menuDraggier.dragend);
                menuDraggier.current.component = component;
            },
            dragover: (e) => {
                e.preventDefault();
            },
            dragenter: (e) => {
                e.dataTransfer.dropEffect = 'none';
            },
            dragleave: (e) => {
                e.dataTransfer.dropEffect = 'none';
            },
            dragend: () => {
                containerRef.value.removeEventListener('dragenter', menuDraggier.dragenter);
                containerRef.value.removeEventListener('dragover', menuDraggier.dragover);
                containerRef.value.removeEventListener('dragleave', menuDraggier.dragleave);
                containerRef.value.removeEventListener('drop', menuDraggier.drop);
                menuDraggier.current.component = null;
            },
            drop: (e) => {
                const blocks = dataModel.value?.blocks || [];
                blocks.push({
                    top: e.offsetY,
                    left: e.offsetX
                });
                dataModel.value = {
                    ...dataModel.value,
                    blocks
                };
            }
        };
        return () => (<div class="visual-editor">
        
        <div class="visual-editor-menu">
        
          {props.config?.componentList.map(component => <div class="visual-editor-menu-item" draggable onDragend={menuDraggier.dragend} onDragstart={(e) => menuDraggier.dragstart(e, component)}>
            <span class="visual-editor-menu-item-label">{component.label}</span>
           {component.preview()}
          </div>)}
        </div>
        <div class="visual-editor-header">
        visual-editor-header
        </div>
        <div class="visual-editor-operator">
        visual-editor-operator
        </div>
        <div class="visual-editor-body">
        <div class="visual-editor-container" ref={containerRef}>
        
        <div class="visual-editor-content" style={containerStyles.value}>
        {!!dataModel.value && !!dataModel.value.blocks && (dataModel.value.blocks.map((block, index) => (<VisualEditorBlock block={block} key={index}/>)))}
            </div>
        </div>
        </div>
      </div>);
    },
});
//# sourceMappingURL=visual-editor.jsx.map