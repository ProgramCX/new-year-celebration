import axios from "axios";
const baseURL = process.env.VUE_APP_BASE_URL || '/devApi';
//创建实例
const service = axios.create({
    baseURL:baseURL,
    timeout:5000,
});

//添加拦截器
service.interceptors.request.use(function(config){
    console.log("即将发送请求"+config.request);
    return config;
},function(error){
    console.log("请求发送失败"+error);
    return Promise.reject(error);
});

//添加响应拦截器
service.interceptors.response.use(function(response){
    console.log("请求成功"+response);
    return response;
},function(error){
    console.log("请求失败"+error);
    return Promise.reject(error);
});

//导出实例
export default service;