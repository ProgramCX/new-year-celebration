<template>
  <div class="fireSound">
    <audio
      src="http://www.imooc.com/newyear/static/fire_sound.mp3"
      loop
      ref="audio"
    ></audio>
    <audio
      src="https://assets.programcx.cn/countdown.mp3"
      ref="countDownAudio"
    ></audio>
  </div>
  <div class="celebration animate__animated animate__fadeIn">
    <p style="font-size: 1.5rem; position: absolute; bottom: 2px">
      现在是 {{ currentTimeShow }}
    </p>
    <div id="frame">
      {{ distance.day }}天{{ distance.hour }}小时{{ distance.minute }}分钟{{
        distance.seconds
      }}秒
    </div>
    <img
      src="https://www.imooc.com/newyear/static/page1_text.png"
      style="height: 50vh"
    />
    <img
      src="https://www.imooc.com/newyear/static/page1_lantern.png"
      alt="lantern"
      id="lantern"
      style="width: 10rem"
    />
  </div>
  <div id="canvas">
    <canvas ref="canvasStar">
      你的浏览器不支持canvas
      <!-- 提示信息 -->
    </canvas>
  </div>
</template>
<script>
import { ElMessage } from "element-plus"; // 引入Element Plus的消息组件
import { onMounted, ref } from "vue"; // 引入Vue的onMounted和ref函数
import { useRoute } from "vue-router"; // 引入Vue Router的useRoute函数
export default {
  name: "CelebrationView", // 组件名称
  setup() {
    const route = useRoute(); // 获取当前路由
    let userName = ref(route.params.id); // 获取路由参数中的用户ID

    let canvasStar = ref(null); // 定义canvasStar的引用
    let ctxStar = ref(null); // 定义ctxStar的引用
    let stars = ref([]); // 定义stars数组的引用

    let distance = ref({ day: 0, hour: 0, minute: 0 }); // 定义distance对象的引用
    let currentTimeShow = ref(""); // 定义currentTimeShow的引用

    let audio = ref(null); // 定义audio的引用
    let countDownAudio = ref(null); // 定义countDownAudio的引用

    let exceed = ref(false); // 定义exceed的引用

    let calculateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      currentTimeShow.value = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
    };

    const initStars = (numStars) => {
      for (let i = 0; i < numStars; i++) {
        // 初始化星星
        stars.value.push({
          x: Math.random() * window.innerWidth, // 随机生成x坐标
          y: Math.random() * window.innerHeight, // 随机生成y坐标
          radius: Math.random() * 3, // 随机生成半径
          dx: (Math.random() - 0.5) * 2, // 随机生成x方向速度
          dy: (Math.random() - 0.5) * 2, // 随机生成y方向速度
        });
      }
    };

    const drawStars = () => {
      ctxStar.value.clearRect(0, 0, window.innerWidth, window.innerHeight); // 清除画布
      stars.value.forEach((star) => {
        // 绘制每颗星星
        ctxStar.value.beginPath(); // 开始路径
        ctxStar.value.arc(star.x, star.y, star.radius, 0, Math.PI * 2); // 绘制圆形
        ctxStar.value.fillStyle = "white"; // 设置填充颜色
        ctxStar.value.fill(); // 填充路径
        ctxStar.value.closePath(); // 关闭路径
      });
    };

    const updateStars = () => {
      stars.value.forEach((star) => {
        // 更新每颗星星的位置
        star.x += star.dx; // 更新x坐标
        star.y += star.dy; // 更新y坐标

        if (star.x < 0 || star.x > window.innerWidth) star.dx = -star.dx; // 碰到边界反弹
        if (star.y < 0 || star.y > window.innerHeight) star.dy = -star.dy; // 碰到边界反弹
      });
    };

    const animateStars = () => {
      drawStars(); // 绘制星星
      updateStars(); // 更新星星位置
      requestAnimationFrame(animateStars); // 请求下一帧动画
    };

    const countDown = () => {
      if (exceed.value) {
        distance.value.day = 0;
        distance.value.hour = 0;
        distance.value.minute = 0;
        return;
      }
      const now = new Date();
      const target = new Date("2025-01-24 16:46:00");
      const diff = target - now;
      distance.value.day = Math.floor(diff / (1000 * 60 * 60 * 24));
      distance.value.hour = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      distance.value.minute = Math.floor(
        (diff % (1000 * 60 * 60)) / (1000 * 60)
      );
      distance.value.seconds = Math.floor((diff % (1000 * 60)) / 1000);
    };
    onMounted(() => {
      console.log(route); // 输出当前路由信息
      if (canvasStar.value) {
        // 如果canvasStar存在
        ctxStar.value = canvasStar.value.getContext("2d"); // 获取2D上下文
        canvasStar.value.width = window.innerWidth; // 设置canvas宽度
        canvasStar.value.height = window.innerHeight; // 设置canvas高度
        initStars(100); // 初始化50颗星星
        animateStars(); // 开始动画
      }

      setInterval(() => {
        countDown();
        calculateTime();
        if (
          distance.value.day <= 0 &&
          distance.value.hour <= 0 &&
          distance.value.minute <= 0 &&
          distance.value.seconds <= 0
        ) {
          if (audio.value) {
            audio.value.play();
            exceed.value = true;
          }
        }
        if (
          distance.value.day === 0 &&
          distance.value.hour === 0 &&
          distance.value.minute === 0 &&
          distance.value.seconds === 10
        ) {
          if (countDownAudio.value) {
            countDownAudio.value.play();
          }
        }
      }, 800); // 每秒更新时间

      calculateTime(); // 初始化时间

      countDown(); // 初始化倒计时

      ElMessage.success("欢迎" + userName.value + "参加我们的活动"); // 显示欢迎消息
    });

    return {
      canvasStar, // 返回canvasStar引用
      distance, // 返回distance引用
      currentTimeShow, // 返回currentTimeShow引用
      audio, // 返回audio引用
      countDownAudio, // 返回countDownAudio引用
    };
  },
};
</script>
<style>
@import "../assets/css/common.css";
.celebration {
  width: 100vw; /* 设置宽度 */
  height: 100vh; /* 设置高度 */
  display: flex; /* 使用flex布局 */
  justify-content: center; /* 居中对齐 */
  align-items: center; /* 居中对齐 */
  flex-direction: column; /* 垂直排列 */
  background: url("http://www.imooc.com/newyear/static/page1_bg.png") center;
  gap: 2rem; /* 间距 */
  z-index: 2; /* 层级 */
  color: #fff;
}

#canvas {
  position: fixed; /* 固定定位 */
  top: -10px; /* 顶部对齐 */
  left: 0; /* 左侧对齐 */
  width: 100vw; /* 设置宽度 */
  height: 100vh; /* 设置高度 */
  z-index: 0; /* 层级 */
}

#lantern {
  position: absolute;
  top: -10px;
  animation: turn 2s infinite ease-in-out;
  z-index: 1;
}

#frame {
  font-size: 1.5rem;
  padding: 25px 40px;
  height: 80px;
  background-image: url(../assets/png/frame.png);
  background-repeat: no-repeat;
  background-size: cover;
}
@keyframes turn {
  0% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(2deg);
  }
  100% {
    transform: rotate(-2deg);
  }
}
</style>
