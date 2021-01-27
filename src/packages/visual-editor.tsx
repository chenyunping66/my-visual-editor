/*
 * @Author: your name
 * @Date: 2021-01-23 14:49:35
 * @LastEditTime: 2021-01-24 19:23:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \demo-visual-editor\src\packages\visual-editor.tsx
 */
import { computed, defineComponent, PropType } from "vue";
import './visual-editor.scss'
import {VisualEditorComponent, VisualEditorModelValue} from "@/packages/visual-editor.utils"
import {useModel} from "@/packages/utils/useModel"
import { VisualEditorBlock } from "@/packages/visual-editor-block";

export const VisualEditor = defineComponent({
  props:{
    modelValue:{type:Object as PropType<VisualEditorModelValue>},
  },
  emits:{
   'update:modelValue':(val?: VisualEditorModelValue) => true,
  },
  setup(props,ctx){
    const dataModel =  useModel(() => props.modelValue, val => ctx.emit('update:modelValue', val))
    const containerRef = ref({} as HTMLDivElement)
    const containerStyles = computed(()=>({
      width:`${dataModel.value.container.width}px`,
      height:`${dataModel.value.container.height}px`,
    }))
    // console.log(pros.config)
    const menuDraggier = {
      dragstart:(e:DragEvent,component:VisualEditorComponent)=>{
        containerRef.value.addEventLister('dragenter',menuDraggier.dragenter)
        containerRef.value.addEventLister('dragover',menuDraggier.dragover)
        containerRef.value.addEventLister('dragleave',menuDraggier.dragleave)
        containerRef.value.addEventLister('dragend',menuDraggier.dragend)
        menuDraggier.current.component = component
      },
      dragover:(e:DragEvent)=>{
         e.preventDefault()
      },
      dragenter:(e:DragEvent)=>{
        e.dataTransfer!.dropEffect = 'none'
      },
      dragleave:(e:DragEvent)=>{
        e.dataTransfer!.dropEffect = 'none'
      },
      dragend:()=>{
        containerRef.value.removeEventListener('dragenter',menuDraggier.dragenter)
        containerRef.value.removeEventListener('dragover',menuDraggier.dragover)
        containerRef.value.removeEventListener('dragleave',menuDraggier.dragleave)
        containerRef.value.removeEventListener('drop',menuDraggier.drop)
        menuDraggier.current.component = null
      },
      drop:(e:DragEvent)=>{
        console.log('drop',menuDraggier.current.component)
        const blocks = dataModel.value.blocks || []
        blocks.push({
          top:e.offsetY,
          left:e.offsetX,
        })
        dataModel.value = {...dataModel.value,blocks}
      }
    }
     return ()=>(
      <div class="visual-editor">
        {/* 可视化组件 */}
        <div class="visual-editor-menu">
        {/* visual-editor-menu */}
          {props.config.componentList.map(component=>
          <div class="visual-editor-menu-item" 
          draggable
          onDrop={menuDraggier.drop}
          onDragstart={(e)=>menuDraggier.dragstart(e,component)}>
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
        <div class="visual-editor-content">
        {/* visual-editor-content */}
        <div class="visual-editor-container" style={containerStyles.value}>
        {
                !!dataModel.value.blocks && (
                dataModel.value.blocks.map((block, index) => (
                  <VisualEditorBlock block={block} key={index} />
                ))
                )}
            </div>
        </div>
        </div>
      </div>
    )
  },
})


