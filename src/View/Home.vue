<template>
  <div class="home">
    <img
      src="../assets/png/2025.png"
      alt="logo"
      style="width: 25rem"
      class="animate__animated animate__rubberBand"
    />
    <input
      type="text"
      placeholder="请输入你的昵称"
      class="input animate__animated animate__bounceInDown"
      ref="input"
    />
    <button
      class="button animate__animated animate__bounceInUp"
      @click="continueClicked"
    >
      继续
    </button>
  </div>
</template>
<script>
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../utils/api/api.js";

export default {
  name: "HomeView",
  setup() {
    const input = ref(null);
    const router = useRouter();
    const nameCorrect = ref(false);

    const userExists = async (name) => {
      return (await api.getWish(name)).data;
    };

    const checkUserNameExists = async () => {
        console.log(input.value.value);
        
      if (await userExists(input.value.value) && !nameCorrect.value) {
        ElMessageBox.confirm("昵称已经存在。如果不是你的昵称，请更改!", "提示", {
          confirmButtonText: "是我的昵称",
          cancelButtonText: "不是我的昵称",
          type: "warning",
        })
          .then(() => {
            window.localStorage.setItem("userName", input.value.value);
            router.push("/celebration/" + input.value.value);
          })
          .catch(() => {});
      } else {
        window.localStorage.setItem("userName", input.value.value);
        router.push("/celebration/" + input.value.value);
      }
    };

    const continueClicked = () => {
      if (!input.value.value) {
        ElMessage.error("请输入你的名字");
        return;
      }
      if (input.value.value.length > 10) {
        ElMessage.error("名字长度不能超过10个字符");
        return;
      }

      nameCorrect.value =
        input.value.value === window.localStorage.getItem("userName");

      if (nameCorrect.value) {
        router.push("/celebration/" + input.value.value);
        return;
      }

      if(window.localStorage.getItem("userName")) {
        ElMessageBox.confirm("你确定要更换名字吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            checkUserNameExists();
          })
          .catch(() => {
              return;
          });
      } else {
        checkUserNameExists();
      }
    };

    onMounted(() => {
      input.value.value = window.localStorage.getItem("userName") || "";
    });

    return {
      input,
      continueClicked,
    };
  },
};
</script>
<style>
@import "../assets/css/common.css";

.home {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: url("http://www.imooc.com/newyear/static/page1_bg.png") center;
  gap: 2rem;
  overflow: hidden;
}
</style>
