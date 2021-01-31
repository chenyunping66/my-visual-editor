<template>
    <div class="app">
        <VisualEditor
            v-model="jsonData"
            :config="visualConfig"
            :formData="formData"
            :customProps="customProps"
        >
        </VisualEditor>
        <!-- <div style="text-align:center">
            {{ JSON.stringify(formData) }}
        </div> -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VisualEditor } from '@/packages/visual-editor';
import { visualConfig } from '@/visual.config';
import data from './data.json';
export default defineComponent({
    name: 'App',
    components: {
        VisualEditor
    },
    data() {
        return {
            visualConfig,
            jsonData: data,
            formData: {
                username: 'admin'
            },
            customProps: {
                subBtn: {
                    onClick: () => {
                        this.$notify({
                            message: '表单提交'
                        });
                    }
                },
                mySelect: {
                    onChange: (val: string) => {
                        console.log('表单变化', val)
                    }
                }
            }
        };
    }
});
</script>

<style lang="scss">
html,
body {
    margin: 0;
    padding: 0;
}
.app {
    padding-bottom: 300px;
}
</style>