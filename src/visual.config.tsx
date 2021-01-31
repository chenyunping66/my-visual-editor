// import './visual.config.scss';
import { createVisualEditorConfig } from './packages/visual-editor.utils';
import { ElButton, ElInput, ElOption, ElSelect } from 'element-plus';
import { createEditorColorProp, createEditorInputProp, createEditorSelectProp, createEditorTableProp } from './packages/visual-editor.props';
import { NumberRange } from './packages/components/number-range/number-range';

export const visualConfig = createVisualEditorConfig();

visualConfig.registry('text', {
    label: '文本',
    preview: () => '预览文本',
    render: ({ props }) => <span style={{ color: props.color, fontSize: props.size }}>{props.text || '默认文本'}</span>,
    props: {
        text: createEditorInputProp('显示文本'),
        color: createEditorColorProp('字体颜色'),
        size: createEditorSelectProp('字体大小', [
            { label: '14px', value: '14px' },
            { label: '18px', value: '18px' },
            { label: '20px', value: '20px' }
        ])
    }
});

visualConfig.registry('button', {
    label: '按钮',
    preview: () => <ElButton>按钮</ElButton>,
    render: ({ props, size, custom }) => (
        <ElButton
            {...custom}
            type={props.type}
            size={props.size}
            style={{
                height: !!size.height ? `${size.height}px` : null,
                width: !!size.width ? `${size.width}px` : null
            }}
        >
            {props.text || '按钮'}
        </ElButton>
    ),
    resize: {
        width: true,
        height: true
    },
    props: {
        text: createEditorInputProp('显示文本'),
        type: createEditorSelectProp('按钮类型', [
            { label: '基础', value: 'primary' },
            { label: '成功', value: 'success' },
            { label: '危险', value: 'danger' },
            { label: '警告', value: 'warning' },
            { label: '提示', value: 'info' },
            { label: '文本', value: 'text' }
        ]),
        size: createEditorSelectProp('按钮大小', [
            { label: '默认', value: '' },
            { label: '中等', value: 'medium' },
            { label: '小', value: 'small' },
            { label: '极小', value: 'mini' }
        ])
    }
});

visualConfig.registry('select', {
    label: '下拉框',
    preview: () => <ElSelect />,
    render: ({ props, model, size, custom }) => {
        return (
            <ElSelect {...custom} key={(props.options || []).map((opt: any) => opt.value).join(',')} {...model.default} style={{ width: !!size.width ? `${size.width}px` : null }}>
                {(props.options || []).map((opt: { label: string; value: string }, index: number) => (
                    <ElOption label={opt.label} value={opt.value} key={index} />
                ))}
            </ElSelect>
        );
    },
    props: {
        options: createEditorTableProp('下拉选项', {
            options: [
                { label: '显示值', field: 'label' },
                { label: '绑定值', field: 'value' }
            ],
            showKey: 'label'
        })
    },
    resize: {
        width: true
    },
    model: {
        default: '绑定字段'
    }
});

visualConfig.registry('input', {
    label: '输入框',
    preview: () => <ElInput modelValue={''} />,
    render: ({ model, size, custom }) => <ElInput {...custom} {...model.default} style={{ width: !!size.width ? `${size.width}px` : null }} />,
    resize: {
        width: true
    },
    model: {
        default: '绑定字段'
    }
});

visualConfig.registry('number-range', {
    label: '数字范围输入框',
    preview: () => <NumberRange />,
    render: ({ model, size }) => (
        <NumberRange
            style={{ width: !!size.width ? `${size.width}px` : null}}
            {...{
                start: model.start.value,
                'onUpdate:start': model.start.onChange,
                end: model.end.value,
                'onUpdate:end': model.end.onChange
            }}
        />
    ),
    resize: {
        width: true
    },
    model: {
        start: '起始绑定字段',
        end: '截止绑定字段'
    }
});

visualConfig.registry('image', {
    label: '图片',
    resize: {
        width: true,
        height: true
    },
    render: ({ props, size }) => {
        return (
            <div style={{ height: `${size.height || 100}px`, width: `${size.width || 100}px` }} class="visual-block-image">
                <img src={props.url || 'https://cn.vuejs.org/images/logo.png'} />
            </div>
        );
    },
    preview: () => (
        <div style="text-align:center">
            <div style="font-size:24px;background-colr:#f2f2f2;color:#ccc;display:inline-flex;width:100px;height:100px">
                <i class="el-icon-picture"></i>
            </div>
        </div>
    ),
    props: {
        url: createEditorInputProp('地址')
    }
});