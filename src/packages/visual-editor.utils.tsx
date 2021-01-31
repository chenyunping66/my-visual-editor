import { VisualEditorProps } from './visual-editor.props';
import { provide,inject } from 'vue';
export interface VisualEditorBlockData {
    componentKey: string;
    top: number;
    left: number;
    adjustPosition: boolean; // 是否需要调整位置
    focus: boolean; // 是否选中
    zIndex: number;
    width: number;
    height: number;
    hasResize: boolean; // 是否调整过宽或者高
    props: Record<string, any>; //组件设计属性
    model: Record<string, string>; //绑定的字段
    slotName?: string; // 组件唯一标识
}
export interface VisualEditorModelValue {
    container: {
        width: number;
        height: number;
    };
    blocks?: VisualEditorBlockData[];
}
export interface VisualEditorComponent {
    key: string;
    label: string;
    preview: () => JSX.Element;
    render: (data: {
        props: any;
        model: any;
        size: { width?: number; height?: number };
        custom: Record<string, any>;
    }) => JSX.Element;
    props?: Record<string, VisualEditorProps>;
    model?: Record<string, string>;
    resize?: { width?: boolean; height?: boolean };
}

export interface VisualEditorMarkLines {
    x: { left: number; showLeft: number }[]; // left是x轴对齐位置,showLeft是图上对齐线出现的位置
    y: { top: number; showTop: number }[]; // top是y轴对齐位置，showTop是图上对齐线出现的位置
}

export function createNewBlock({
    component,
    left,
    top
}: {
    component: VisualEditorComponent;
    top: number;
    left: number;
}): VisualEditorBlockData {
    return {
        componentKey: component!.key,
        top,
        left,
        adjustPosition: true,
        focus: false,
        zIndex: 0,
        width: 0,
        height: 0,
        hasResize: false,
        props: {},
        model: {}
    };
}

export function createVisualEditorConfig() {
    const componentList: VisualEditorComponent[] = [];
    const componentMap: Record<string, VisualEditorComponent> = {};
    return {
        componentList,
        componentMap,
        registry: <
            _,
            Props extends Record<string, VisualEditorProps> = {},
            Model extends Record<string, string> = {}
        >(
            key: string,
            component: {
                label: string;
                preview: () => JSX.Element;
                render: (data: {
                    props: { [k in keyof Props]: any };
                    model: Partial<{ [k in keyof Model]: any }>;
                    size: { width?: number; height?: number };
                    custom: Record<string, any>;
                }) => JSX.Element;
                props?: Props;
                model?: Model;
                resize?: { width?: boolean; height?: boolean };
            }
        ) => {
            let comp = { ...component, key };
            componentList.push(comp);
            componentMap[key] = comp;
        }
    };
}

export interface VisualDragEvent {
    dragstart: {
        on: (cb: () => void) => void;
        off: (cb: () => void) => void;
        emit: () => void;
    };
    dragend: {
        on: (cb: () => void) => void;
        off: (cb: () => void) => void;
        emit: () => void;
    };
}

export const VisualDragProvider = (() => {
    const VISUAL_DRAG_PROVIDER = '@@VISUAL_DRAG_PROVIDER';
    return {
        provide: (data: VisualDragEvent) => {
            provide(VISUAL_DRAG_PROVIDER,data);
        },
        inject: () => {
            return inject(VISUAL_DRAG_PROVIDER) as VisualDragEvent;
        }
    };
})();

export type VisualEditorConfig = ReturnType<typeof createVisualEditorConfig>;