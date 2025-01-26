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

      if ((await userExists(input.value.value)) && !nameCorrect.value) {
        ElMessageBox.confirm(
          "昵称已经存在。如果不是你的昵称，请更改!",
          "提示",
          {
            confirmButtonText: "是我的昵称",
            cancelButtonText: "不是我的昵称",
            type: "warning",
          }
        )
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

      if (window.localStorage.getItem("userName")) {
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
      ElMessageBox.alert(
        [
          "该网站是一个简单的春节倒计时和许愿网站，大年初一零时整，在春节倒计时页面会有绚丽的彩蛋，大家一起来庆祝新年吧！🎉🎉🎉",
          "⚠️⚠️⚠️声明：禁止任何通过任何手段（如DDOS）破坏该网站计算机系统，如发现此类违法行为，将报警严肃处理！！！",
          "🧑🏼‍💻🧑🏼‍💻🧑🏼‍💻该网站基于 Vue.js 3、Spring Boot、MyBatis 框架开发，所有源代码开源：",
          "前端地址：https://github.com/ProgramCX/new-year-celebration",
          "后端地址：https://github.com/ProgramCX/new-year-celebration-backend",
          "如果您发现网站内有任何BUG，欢迎向网站开发和维护者 程旭 反馈！",
          "QQ: 2860245799 邮箱：ProgramCX@outlook.com 微信：program-chengxu",
        ].join("<br/>"),
        "欢迎来到新年庆祝网站！",
        {
          confirmButtonText: "确定",
          type: "info",
          dangerouslyUseHTMLString: true, // 允许 HTML 渲染
        }
      ).catch(() => {});
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
