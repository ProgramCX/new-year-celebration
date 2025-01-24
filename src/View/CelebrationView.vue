<template>
  <div class="fireSound">
    <audio
      src="https://assets.programcx.cn/fireworks.mp3"
      loop
      ref="audio"
    ></audio>
    <audio
      src="https://assets.programcx.cn/fire_sound.mp3"
      loop
      ref="audio1"
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
    <div id="frame" v-if="!exceed">
      {{ distance.day }}天{{ distance.hour }}小时{{ distance.minute }}分钟{{
        distance.seconds
      }}秒
    </div>
    <div id="frame" v-if="exceed">
      新年快乐！
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
    <canvas ref="canvasStar">你的浏览器不支持canvas</canvas>
    <FireWork :is-visible="exceed" style="z-index: 1" />
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import FireWork from "@/components/FireWork.vue";

export default {
  name: "CelebrationView",
  components: { FireWork },
  setup() {
    const route = useRoute();
    const userName = ref(route.params.id);
    const canvasStar = ref(null);
    const ctxStar = ref(null);
    const stars = ref([]);
    const distance = ref({ day: 0, hour: 0, minute: 0, seconds: 0 });
    const currentTimeShow = ref("");
    const audio = ref(null);
    const audio1 = ref(null);
    const countDownAudio = ref(null);
    const exceed = ref(false);

    const calculateTime = () => {
      const now = new Date();
      currentTimeShow.value = `${now.getFullYear()}年${String(
        now.getMonth() + 1
      ).padStart(2, "0")}月${String(now.getDate()).padStart(2, "0")}日 ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
        now.getSeconds()
      ).padStart(2, "0")}`;
    };

    const initStars = (numStars) => {
      for (let i = 0; i < numStars; i++) {
        stars.value.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.random() * 3,
          dx: (Math.random() - 0.5) * 2,
          dy: (Math.random() - 0.5) * 2,
        });
      }
    };

    const drawStars = () => {
      ctxStar.value.clearRect(0, 0, window.innerWidth, window.innerHeight);
      stars.value.forEach((star) => {
        ctxStar.value.beginPath();
        ctxStar.value.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctxStar.value.fillStyle = "white";
        ctxStar.value.fill();
        ctxStar.value.closePath();
      });
    };

    const updateStars = () => {
      stars.value.forEach((star) => {
        star.x += star.dx;
        star.y += star.dy;
        if (star.x < 0 || star.x > window.innerWidth) star.dx = -star.dx;
        if (star.y < 0 || star.y > window.innerHeight) star.dy = -star.dy;
      });
    };

    const animateStars = () => {
      drawStars();
      updateStars();
      requestAnimationFrame(animateStars);
    };

    const countDown = () => {
      if (exceed.value) {
        distance.value = { day: 0, hour: 0, minute: 0, seconds: 0 };
        return;
      }
      const now = new Date();
      const target = new Date("2025-01-24 20:03:00");
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
      calculateTime();
      countDown();
      if (canvasStar.value) {
        ctxStar.value = canvasStar.value.getContext("2d");
        canvasStar.value.width = window.innerWidth;
        canvasStar.value.height = window.innerHeight;
        initStars(100);
        animateStars();
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
            audio1.value.play();
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
      }, 400);

      
      ElMessage.success("欢迎" + userName.value + "参加我们的活动");
    });

    return {
      canvasStar,
      distance,
      currentTimeShow,
      audio,
      audio1,
      countDownAudio,
      exceed,
    };
  },
};
</script>

<style>
@import "../assets/css/common.css";

.celebration {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: url("http://www.imooc.com/newyear/static/page1_bg.png") center;
  gap: 2rem;
  z-index: 2;
  color: #fff;
}

#canvas {
  position: fixed;
  top: -10px;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
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
