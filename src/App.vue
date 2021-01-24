<!--
 * @Author: your name
 * @Date: 2021-01-24 18:31:28
 * @LastEditTime: 2021-01-24 19:54:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \visual-editor\src\App.vue
-->
<template>
  <div class="app">
    <h1>这个是页面内容</h1>
    <visual-editor v-model="jsonData"/>
    <!-- <TestUseodel v-model="val"/>
    val:{{val}} -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {VisualEditor} from "@/packages/visual-editor"
// import {TestUseodel} from "@/packages/utils/useModel"

export default defineComponent({
  name: "App",
  components: {
    VisualEditor,
    // TestUseodel
  },
  data(){
    return{
      val:'',
      jsonData:{
        container:{
          height:800,
          width:500,
        },
        blocks:[
          {
            top:100,
            left:100,
          }
        ]
      }
    }
  }
});
</script>

<style lang="scss">
html,body{
  margin: 0;
  padding: 0;
}
</style>
