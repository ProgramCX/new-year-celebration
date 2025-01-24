<template>
    <div class="home">
        <img src="../assets/png/2025.png" alt="logo"  style="width: 25rem;" class="animate__animated animate__rubberBand"/>
        <input type="text" placeholder="Enter your name" class="input animate__animated animate__bounceInDown" ref="input" />
        <button class="button animate__animated animate__bounceInUp" @click="continueCilcked " >继续</button>
    </div>
</template>
<script>
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
export default {
    name: 'HomeView',
    setup() {
        let input = ref(null);
        const router = useRouter();
        const continueCilcked = () => {
            // if(!document.querySelector('.input').value) {
            //     ElMessage.error('Please enter your name');
            //     return;
            // }
            if(!input.value.value) {
                ElMessage.error('请输入你的名字');
                return;
            }
            router.push("/celebration/"+input.value.value);

           
        }
        return {
            input,
            continueCilcked
        }
    }
}
</script>
<style>
@import '../assets/css/common.css';

.home {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: url("http://www.imooc.com/newyear/static/page1_bg.png") center;
    gap: 2rem;
}
</style>