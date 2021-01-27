import component from "*.vue";
import { createVisualEditorConfig } from "./packages/visual-editor.utils";
import {ELButton,ElInput} from 'element-plus'

export const visualConfig = createVisualEditorConfig()

visualConfig.registry(key:'text',component:{
  label:'文本',
  preview:()=>'预览文本',
  render:()=>'渲染文本'
})
visualConfig.registry(key:'button',component:{
  label:'按钮',
  preview:()=><ELButton>按钮</ELButton>,
  render:()=><ELButton>渲染按钮</ELButton>
})
visualConfig.registry(key:'input',component:{
  label:'输入框',
  preview:()=><ELInput></ELInput>,
  render:()=><ELInput></ELInput>
})
