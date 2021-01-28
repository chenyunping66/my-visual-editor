/*
 * @Author: your name
 * @Date: 2021-01-24 19:07:31
 * @LastEditTime: 2021-01-28 20:54:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \visual-editor\src\packages\visual-editor.utils.ts
 */
export interface VisualEditorBlockData{
  top: number,
  left: number
}
export interface VisualEditorModelValue{
  container?: {
    width: number,
    height: number,
  },
  blocks?: VisualEditorBlockData[],
}

export interface VisualEditorComponent{
  key?: string,
  // name:string,
  label: string,
  preview: () => JSX.Element,
  render: () => JSX.Element,
}
export function createVisualEditorConfig(){
    const componentList: VisualEditorComponent[] = []
    const componentMap: Record<string,VisualEditorComponent> = {}
    return{
      componentList,
      componentMap,
      registry: (key: string,component: Omit<VisualEditorComponent,'key'>) => {
        let comp = {...component,key}
        componentList.push(comp)
        componentMap[key] = comp
      }
    }
}

export type VisualEditorConfig = ReturnType<typeof createVisualEditorConfig>

// const config = createVisualEditorConfig()
// config.registry(name:'input',component{
//   preview:()=>'输入框'，
//   render:()=>''
// })