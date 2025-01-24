import { createApp } from 'vue'
import App from './App.vue'

//导入ElementPlus依赖
import  ElementPlus  from 'element-plus'   
import 'element-plus/dist/index.css' 
import 'element-plus/theme-chalk/dark/css-vars.css'

import 'animate.css';

//导入路由
import router from './route/index';

//创建app
const app = createApp(App);

//挂载路由
app.use(router);
//挂载ElementPlus
app.use(ElementPlus);
//挂载app
app.mount('#app');
