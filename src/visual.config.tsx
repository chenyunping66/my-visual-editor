/*
 * @Author: your name
 * @Date: 2021-01-26 22:47:06
 * @LastEditTime: 2021-01-31 19:44:40
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \visual-editor\src\visual.config.tsx
 */
import { createVisualEditorConfig } from "./packages/visual-editor.utils";

import { ElButton, ElInput } from 'element-plus'

export const visualConfig = createVisualEditorConfig();

visualConfig.registry('text', {
    label: '文本',
    preview: () => '文本',
    render: () => '渲染文本'
})
visualConfig.registry('button', {
    label: '按钮',
    preview: () => <ElButton>按钮</ElButton>,
    render: () => <ElButton>渲染按钮</ElButton>
})
visualConfig.registry('input', {
    label: '输入框',
    preview: () => <ElInput />,
    render: () => <ElInput/>
})