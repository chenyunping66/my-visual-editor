/*
 * @Author: your name
 * @Date: 2021-01-24 19:07:31
 * @LastEditTime: 2021-01-24 19:08:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \visual-editor\src\packages\visual-editor.utils.ts
 */
export interface VisualEditorBlockData{
  top:number,
  left:number
}
export interface VisualEditorModelValue{
  container:{
    width:700,
    height:number,
  },
  blocks?: VisualEditorModelValue[],
}