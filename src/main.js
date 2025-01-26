import { createApp } from 'vue'
import App from './App.vue'

//导入ElementPlus依赖
import  ElementPlus  from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

//导入ElementPlus图标
import * as ElementPlusIconVue from '@element-plus/icons-vue'

import VueAxios from 'vue-axios'

import axios from 'axios'

import 'animate.css';

//导入路由
import router from './route/index';

import './registerServiceWorker'

//创建app
const app = createApp(App);

//挂载路由
app.use(router);
//挂载ElementPlus
app.use(ElementPlus);

//遍历注册图标
for (const [key, component] of Object.entries(ElementPlusIconVue) ) {
    app.component(key, component);
}

app.use(VueAxios,axios);
//挂载app
app.mount('#app');
