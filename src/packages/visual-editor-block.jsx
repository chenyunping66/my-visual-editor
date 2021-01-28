import { computed, defineComponent } from 'vue';
export const VisualEditorBlock = defineComponent({
    props: {
        block: { type: Object, required: true },
    },
    setup(props) {
        const styles = computed(() => ({
            top: `${props.block.top}px`,
            left: `${props.block.left}px`
        }));
        return () => (<div class="visual-editor-block" style={styles.value}>
        这是一条block
      </div>);
    }
});
//# sourceMappingURL=visual-editor-block.jsx.map