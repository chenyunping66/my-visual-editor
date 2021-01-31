import { defineComponent, PropType, computed, ref } from 'vue';
import './visual-editor.scss';
import { VisualEditorModelValue, VisualEditorConfig, VisualEditorComponent, createNewBlock, VisualEditorBlockData } from '@/packages/visual-editor.utils';
import { useModel } from './utils/useModel';
import { VisualEditorBlock } from './visual-editor-block';

export const VisualEditor = defineComponent({
    props: {
        modelValue: { type: Object as PropType<VisualEditorModelValue>, require: true },
        config: { type: Object as PropType<VisualEditorConfig>, requied: true }
    },
    emits: {
        'update:modelValue': (val?: VisualEditorModelValue) => true,
    },
    setup(props: any, ctx: any) {
        // 双向绑定至 容器中的组件数据
        const dataModel = useModel(() => props.modelValue, val => ctx.emit('update:modelValue', val))
        // container 节点dom对象的引用
        const containerRef = ref({} as HTMLDivElement);
        // container节点的style的样式对象
        const containerStyles = computed(() => ({
            width: `${dataModel.value.container.width}px`,
            height: `${dataModel.value.container.height}px`,
        }))


        // 处理菜单拖拽组件到容器的相关动作
        const menuDraggier = (() => {
            let component = null as null | VisualEditorComponent;

            const blockHandler = {
                /**
                 * 处理拖拽菜单组件开始动作
                 */
                dragstart: (e: DragEvent, curComp: VisualEditorComponent) => {
                    containerRef.value.addEventListener('dragenter', containerHandler.dragenter);
                    containerRef.value.addEventListener('dragover', containerHandler.dragover);
                    containerRef.value.addEventListener('dragleave', containerHandler.dragleave);
                    containerRef.value.addEventListener('drop', containerHandler.drop);
                    component = curComp;
                },
                /**
                 * 处理拖拽菜单组件结束动作
                 */
                dropend: () => {
                    containerRef.value.removeEventListener('dragenter', containerHandler.dragenter);
                    containerRef.value.removeEventListener('dragover', containerHandler.dragover);
                    containerRef.value.removeEventListener('dragleave', containerHandler.dragleave);
                    containerRef.value.removeEventListener('drop', containerHandler.drop);
                    component = null;
                },
            }
            const containerHandler = {
                /*拖拽菜单组件，进入容器的时候 设置鼠标可放置状态 */
                dragenter: (e: DragEvent) => e.dataTransfer!.dropEffect = 'move',
                /*拖拽菜单组件，鼠标进入容器的时候，禁用默认事件 */
                dragover: (e: DragEvent) => e.preventDefault(),
                /*如果拖拽过程中鼠标离开了容器，设置鼠标不可放置的状态 */
                dragleave: (e: DragEvent) => e.dataTransfer!.dropEffect = 'none',
                /*在容器中放置的时候，通过事件对象的 offsetX和offsetY来添加一条组件数据*/
                drop: (e: DragEvent) => {
                    const blocks = dataModel.value.blocks || [];
                    blocks.push(createNewBlock({
                        component: component!,
                        top: e.offsetY,
                        left: e.offsetX,
                    }))
                    dataModel.value = {
                        ...dataModel.value,
                        blocks,
                    };
                },
            }
            return blockHandler;
        })();

        // 对外暴露的一些方法
        const methods = {
            clearFocus: (block?: VisualEditorBlockData) => {
                let blocks = (dataModel.value.blocks || []);
                if (blocks.length === 0) return;
                if (!!blocks) {
                    blocks = blocks.filter((item: any) => item !== block);
                }
                blocks.forEach((block: any) => block.focus = false)
            }
        }

        // 计算选中与未选中的block数据
        const focusData = computed(() => {
            let focus: VisualEditorBlockData[] = [];
            let unFocus: VisualEditorBlockData[] = [];
            let blocks = (dataModel.value.blocks || []);
            blocks.forEach((block: any) => (block.focus ? focus : unFocus).push(block));
            return {
                focus, // 此时选中的数据
                unFocus // 此时未选中的数据
            }
        })

        // 处理block选中的相关动作
        const focusHandler = (() => {
            return {
                container: {
                    onMousedown: (e: MouseEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                        // 点击空白处 清空所有选中的block
                        methods.clearFocus();
                    },
                },
                block: {
                    onMousedown: (e: MouseEvent, block: VisualEditorBlockData) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (e.shiftKey) {
                            // 如果摁住了shift键 如果此时没有选中的block 就选中这个block 否则令这个block的选中状态取反
                            if (focusData.value.focus.length <= 1) {
                                block.focus = true;
                            } else {
                                block.focus = !block.focus;
                            }
                        } else {
                            // 如果点击的这个block没有被选中 才清空这个其他选中的block 否则不做任何事情 放置拖拽多个block取消其他block的选中状态
                            if (!block.focus) {
                                block.focus = true;
                                methods.clearFocus(block);
                            }
                        }
                        blockDraggier.mousedown(e);
                    },
                }
            }
        })();

        // 处理block在container中拖拽移动的相关动作
        const blockDraggier = (() => {
            let dragState = {
                startX: 0,
                startY: 0,
                startPos: [] as { left: number, top: number }[],
            }
            const mousedown = (e: MouseEvent) => {
                dragState = {
                    startX: e.clientX,
                    startY: e.clientY,
                    startPos: focusData.value.focus.map(({ top, left }) => ({ top, left }))
                }
                document.addEventListener('mousemove', mousemove);
                document.addEventListener('mouseup', mouseup);
            }
            const mousemove = (e: MouseEvent) => {
                const durX = e.clientX - dragState.startX;
                const durY = e.clientY - dragState.startY;
                focusData.value.focus.forEach((block: any, index: number) => {
                    block.top = dragState.startPos[index].top + durY;
                    block.left = dragState.startPos[index].left + durX;
                })
            }
            const mouseup = (e: MouseEvent) => {
                document.removeEventListener('mousemove', mousemove);
                document.removeEventListener('mouseup', mouseup);
            }
            return { mousedown };
        })()


        return () => (
            <div class="editor">
                <div class="editor-menu">
                    {props.config.componentList.map((comp: any) => (
                        <div class="editor-menu-item"
                            draggable
                            onDragend={menuDraggier.dropend}
                            onDragstart={(e) => menuDraggier.dragstart(e, comp)}>
                            <span class="editor-menu-item-label">{comp.label}</span>
                            {comp.preview()}
                        </div>
                    ))}
                </div>
                <div class="editor-head">
                    editor-head
                </div>
                <div class="editor-operator">
                    editor-operator
                </div>
                <div class="editor-body">
                    <div class="editor-content">
                        <div class="editor-container"
                            style={containerStyles.value}
                            ref={containerRef}
                            {...focusHandler.container}
                        >
                            {!!dataModel.value.blocks && (
                                dataModel.value.blocks.map((block: any, index: any) => (
                                    <VisualEditorBlock
                                        config={props.config}
                                        block={block}
                                        key={index}
                                        {...{
                                            onMousedown: (e: MouseEvent) => focusHandler.block.onMousedown(e, block)
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})