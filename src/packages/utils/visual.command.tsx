import { useCommander } from '../plugins/command.plugin';
import { VisualEditorBlockData, VisualEditorModelValue } from '../visual-editor.utils';
import deepcopy from 'deepcopy';

export function useVisualCommand({
    focusData,
    updateBlocks,
    dataModel,
    dragstart,
    dragend
}: {
    focusData: { value: { focus: VisualEditorBlockData[]; unfocus: VisualEditorBlockData[] } };
    updateBlocks: (blocks?: VisualEditorBlockData[]) => void;
    dataModel: { value: VisualEditorModelValue };
    dragstart: {
        on: (cb: () => void) => void;
        off: (cb: () => void) => void;
    };
    dragend: {
        on: (cb: () => void) => void;
        off: (cb: () => void) => void;
    };
}) {
    const commander = useCommander();
    commander.registry({
        name: 'delete',
        keyboard: ['backspace', 'delete', 'ctrl+d'],
        execute: () => {
            let data = {
                before: dataModel.value.blocks || [],
                after: focusData.value.unfocus
            };
            return {
                redo: () => {
                    updateBlocks(data.after);
                },
                undo: () => {
                    updateBlocks(data.before);
                }
            };
        }
    });

    commander.registry({
        name: 'drag',
        init() {
            this.data = {
                before: null as null | VisualEditorBlockData[],
                after: null as null | VisualEditorBlockData[]
            };
            let before: VisualEditorBlockData[] = [];

            const handler = {
                dragstart: () => {
                    let before = deepcopy(dataModel.value.blocks);
                    this.data.before = before;
                },
                dragend: () => {
                    commander.state.commands.drag();
                }
            };
            dragstart.on(handler.dragstart);
            dragend.on(handler.dragend);
            return () => {
                dragstart.off(handler.dragstart);
                dragend.off(handler.dragend);
            };
        },
        execute() {
            let before = deepcopy(this.data.before);
            let after = deepcopy(dataModel.value.blocks);
            return {
                redo: () => {
                    updateBlocks(deepcopy(after));
                },
                undo: () => {
                    updateBlocks(deepcopy(before));
                }
            };
        }
    });

    commander.registry({
        name: 'clear',
        execute: () => {
            let data = {
                before: deepcopy(dataModel.value.blocks),
                after: deepcopy([])
            };
            return {
                redo: () => {
                    updateBlocks(deepcopy(data.after));
                },
                undo: () => {
                    updateBlocks(deepcopy(data.before));
                }
            };
        }
    });

    commander.registry({
        name: 'placeTop',
        keyboard: 'ctrl+up',
        execute: () => {
            let data = {
                before: deepcopy(dataModel.value.blocks),
                after: deepcopy(
                    (() => {
                        const { focus, unfocus } = focusData.value;
                        let maxZindex = unfocus.reduce((prev, block) => {
                            return Math.max(prev, block.zIndex);
                        }, -Infinity);
                        maxZindex += 1;
                        focus.forEach(block => (block.zIndex = maxZindex));
                        return deepcopy(dataModel.value.blocks);
                    })()
                )
            };
            return {
                redo: () => {
                    updateBlocks(deepcopy(data.after));
                },
                undo: () => {
                    updateBlocks(deepcopy(data.before));
                }
            };
        }
    });

    commander.registry({
        name: 'placeBottom',
        keyboard: 'ctrl+down',
        execute: () => {
            let data = {
                before: deepcopy(dataModel.value.blocks),
                after: deepcopy(
                    (() => {
                        const { focus, unfocus } = focusData.value;
                        let minZindex = unfocus.reduce((prev, block) => {
                            return Math.min(prev, block.zIndex);
                        }, Infinity);
                        minZindex -= 1;
                        if (minZindex < 0) {
                            const dur = Math.abs(minZindex);
                            unfocus.forEach(block => (block.zIndex += dur));
                            minZindex = 0;
                        }
                        focus.forEach(block => (block.zIndex = minZindex));
                        return deepcopy(dataModel.value.blocks);
                    })()
                )
            };
            return {
                redo: () => {
                    updateBlocks(deepcopy(data.after));
                },
                undo: () => {
                    updateBlocks(deepcopy(data.before));
                }
            };
        }
    });

    commander.registry({
        name: 'updateBlock',
        execute: (newBlock: VisualEditorBlockData, oldBlock: VisualEditorBlockData) => {
            let blocks = deepcopy(dataModel.value.blocks || []);
            let data = {
                before: blocks,
                after: (() => {
                    blocks = [...blocks];
                    const index = dataModel.value.blocks!.indexOf(oldBlock);
                    if (index >= -1) {
                        blocks.splice(index, 1, newBlock);
                    }
                    return deepcopy(blocks);
                })()
            };
            return {
                redo: () => {
                    updateBlocks(deepcopy(data.after));
                },
                undo: () => {
                    updateBlocks(deepcopy(data.before));
                }
            };
        }
    });

    commander.registry({
        name: 'updateModelValue',
        execute: (val: VisualEditorModelValue) => {
            let data = {
                before: deepcopy(dataModel.value),
                after: deepcopy(val)
            };
            return {
                redo: () => {
                    dataModel.value = data.after;
                },
                undo: () => {
                    dataModel.value = data.before;
                }
            };
        }
    });

    commander.registry({
        name: 'selectAll',
        followQueue: false,
        keyboard: 'ctrl+a',
        execute: () => {
            return {
                redo: () => {
                    (dataModel.value.blocks || []).forEach(block => (block.focus = true));
                }
            };
        }
    });

    commander.init();

    return {
        undo: () => commander.state.commands.undo(),
        redo: () => commander.state.commands.redo(),
        delete: () => commander.state.commands.delete(),
        clear: () => commander.state.commands.clear(),
        placeTop: () => commander.state.commands.placeTop(),
        placeBottom: () => commander.state.commands.placeBottom(),
        updateBlock: (newBlock: VisualEditorBlockData, oldBlock: VisualEditorBlockData) => commander.state.commands.updateBlock(newBlock, oldBlock),
        updateModelValue: (val: VisualEditorModelValue) => commander.state.commands.updateModelValue(val)
    };
}