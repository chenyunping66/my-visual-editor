/*
 * @Author: your name
 * @Date: 2021-01-24 19:07:31
 * @LastEditTime: 2021-01-31 19:43:35
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \visual-editor\src\packages\visual-editor.utils.tsx
 */
export interface VisualEditorBlockData {
  // 映射 VisualEditorConfig 中componentMap 的component对象
  componentKey: string,

  // 组件的top定位
  top: number,
  // 组件的left定位
  left: number,
  // 是否需要调整位置
  adjustPosition: boolean,

  // 是否选中状态
  focus: boolean,
}

export interface VisualEditorModelValue {
  container: {
      width: number,
      height: number,
  },
  blocks?: VisualEditorBlockData[],
}

// export interface VisualEditorConfig{
//     container:{
//         width: number,
//         height: number,
//     },
// }

export interface VisualEditorComponent {
  key: string,
  label: string,
  preview: () => JSX.Element,
  render: () => JSX.Element,

}


export function createNewBlock(
  {
      component,
      left,
      top,
  }: {
      component: VisualEditorComponent,
      top: number,
      left: number,

  }): VisualEditorBlockData {
  return {
      top,
      left,
      componentKey: component!.key,
      adjustPosition: true,
      focus: false
  }
}

export function createVisualEditorConfig() {
  const componentList: VisualEditorComponent[] = [];
  const componentMap: Record<string, VisualEditorComponent> = {}
  return {
      componentList,
      componentMap,
      registry: (key: string, component: Omit<VisualEditorComponent, 'key'>) => {
          let comp = { ...component, key }
          componentList.push(comp);
          componentMap[key] = comp

      }
  }
}
export type VisualEditorConfig = ReturnType<typeof createVisualEditorConfig>