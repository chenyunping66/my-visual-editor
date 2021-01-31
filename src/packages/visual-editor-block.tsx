/*
 * @Author: your name
 * @Date: 2021-01-24 20:31:56
 * @LastEditTime: 2021-01-31 19:42:03
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \visual-editor\src\packages\visual-editor-block.tsx
 */
import { defineComponent, PropType, computed, onMounted, ref } from 'vue';
import { VisualEditorBlockData, VisualEditorConfig } from '@/packages/visual-editor.utils';

export const VisualEditorBlock = defineComponent({
    props: {
        block: { type: Object as PropType<VisualEditorBlockData>, requied: true },
        config: { type: Object as PropType<VisualEditorConfig>, requied: true }
    },
    setup(props: any) {
        const el = ref({} as HTMLDivElement);

        const classes = computed(() => [
            'editor-block',
            {
                'editor-block-focus': props.block.focus
            }
        ])

        const styles = computed(() => ({
            top: `${props.block.top}px`,
            left: `${props.block.left}px`,
        }))

        onMounted(() => {
            /**
             * 添加组件的时候 自动调整位置上下左右居中
             */
            const block = props.block;
            if (block.adjustPosition === true) {
                const { offsetWidth, offsetHeight } = el.value;
                block.left = block.left - offsetWidth / 2;
                block.top = block.top - offsetHeight / 2;
                block.adjustPosition = false
            }
        })

        return () => {
            const component = props.config.componentMap[props.block.componentKey];
            const Render = component.render();
            return (
                <div class={classes.value} style={styles.value} ref={el}>
                    {Render}
                </div>
            )
        }
    }
})