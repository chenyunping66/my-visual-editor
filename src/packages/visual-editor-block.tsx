import  {defineComponent,PropType} from 'vue';
import {VisualEditorBlockData} from "@/packages/visual-editor.utils";

export const VisualEditorBlock = defineComponent({
  props:{
    block:{type:Object as PropType<VisualEditorBlockData>,required:true},
  },
  setup(props){
    return()=>{
      <div class="visual-editor-bloc">
        这是一条block
      </div>
    }
  }
})