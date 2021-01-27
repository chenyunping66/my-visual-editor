import  {computed, defineComponent,PropType} from 'vue';
import {VisualEditorBlockData} from "@/packages/visual-editor.utils"

export const VisualEditorBlock = defineComponent({
  props:{
    block:{type:Object as PropType<VisualEditorBlockData>,required:true},
  },
  setup(props){
    const styles = computed(()=>({
      top:`${props.block.left}px`,
      left:`${props.block.left}px`
    }))
    return()=>{
      <div class="visual-editor-bloc">
        这是一条block
      </div>
    }
  }
})