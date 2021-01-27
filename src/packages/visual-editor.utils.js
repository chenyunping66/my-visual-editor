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
// const config = createVisualEditorConfig()
// config.registry(name:'input',component{
//   preview:()=>'输入框'，
//   render:()=>''
// })
//# sourceMappingURL=visual-editor.utils.js.map