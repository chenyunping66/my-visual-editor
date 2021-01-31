export function createNewBlock({ component, left, top, }) {
    return {
        top,
        left,
        componentKey: component.key,
        adjustPosition: true,
        focus: false
    };
}
export function createVisualEditorConfig() {
    const componentList = [];
    const componentMap = {};
    return {
        componentList,
        componentMap,
        registry: (key, component) => {
            let comp = { ...component, key };
            componentList.push(comp);
            componentMap[key] = comp;
        }
    };
}
//# sourceMappingURL=visual-editor.utils.jsx.map