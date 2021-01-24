import { defineComponent } from 'vue';
export const VisualEditorBlock = defineComponent({
    props: {
        block: { type: Object, required: true },
    },
    setup(props) {
        return () => {
            <div class="visual-editor-bloc">
        这是一条block
      </div>;
        };
    }
});
//# sourceMappingURL=visual-editor-block.jsx.map