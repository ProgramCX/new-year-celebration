<template>
    <div class="wish-card">
        <el-card class="box-card">
            <template #header>
                <span>{{ name }}</span>
            </template>
            <div id="content">
                <el-text>{{ cont }}</el-text>
            </div>
            
                <el-row :span="123"  id="buttons" >
                    <img v-if="!loved" src="../assets/svg/love_grey.svg" alt="like" style="width: 1.5rem;cursor: pointer;" @click="loveClicked"/>
                    <img v-else src="../assets/svg/love_red.svg" alt="like" style="width: 1.5rem;cursor: pointer;" @click="loveClicked"/>
                    <el-text>{{ loveCount }}</el-text>
                </el-row>

        </el-card>
    </div>
</template>
<script>
import { watch,ref } from 'vue';
import api from "../utils/api/api.js";
import { ElMessage } from 'element-plus';
export default {
    name: 'WishCard',
    props: {
        userName: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        loveNumber: {
            type: Number,
            default: 0
        }
    },
    setup(props) {
        let name = ref(props.userName);
        let cont = ref(props.content);
        let loved = ref(false);
        let loveCount = ref(props.loveNumber);
        const loveClicked = () => {
            console.log(loved.value);
            if(!loved.value) {
                addLove();
            } else {
                reduceLove();
            }
        }
        watch(() => props.userName, (newVal) => {
            name.value = newVal;
        });
        watch(() => props.content, (newVal) => {
            cont.value = newVal;
        });
        watch(() => props.loveNumber, (newVal) => {
            loveCount.value = newVal;
        });

        const reduceLove = async () => {
                try {
                    await api.removeLove(name.value);
                    console.log("减少"+name.value);
                    loveCount.value--;
                    loved.value = false;
                } catch (error) {
                    console.error(error);
                    failedMessage('取消点赞失败！');
                }
            
        }

        const addLove = async () => {
                try {
                    await api.addLove(name.value);
                    loveCount.value++;
                    loved.value = true;
                } catch (error) {
                    failedMessage('点赞失败！');
                }
            
        }

        const failedMessage = (message) => {
            ElMessage.error(message);
        }
        return {
            name,
            cont,
            loved,
            loveCount,
            loveClicked,
        }
    }
}
</script>
<style>
.wish-card {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 2rem;
}
.box-card {
    width: 100%;
}
#buttons{
    margin-top: 15px;
}
</style>