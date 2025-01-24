<template>
    <div class="fireworks-container" v-if="isVisible">
      <canvas ref="canvas" class="fireworks-canvas"></canvas>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  export default {
    name: "FireWorks",
    props: {
      isVisible: {
        type: Boolean,
        default: true,
      },
    },
    setup(props) {
      const canvas = ref(null); // canvas的引用
      let particles = []; // 存储所有烟花粒子
      let w, h; // 画布的宽度和高度
      let played = ref(false); // 是否已经播放过烟花效果

      // 调整画布大小
      const resizeCanvas = () => {
        if (canvas.value) {
          w = canvas.value.width = window.innerWidth;
          h = canvas.value.height = window.innerHeight;
        }
      };
  
      // 初始化烟花效果
      const setFireWorks = () => {
        if (!canvas.value) return;
        const ctx = canvas.value.getContext("2d");
        if (!ctx) return;
  
        const probability = 0.9; // 控制烟花产生的概率
        let xPoint, yPoint; // 烟花爆炸点坐标
  
        // 更新和绘制世界，持续循环
        const updateWorld = () => {
          update(); // 更新烟花粒子
          paint();  // 绘制烟花效果
          window.requestAnimationFrame(updateWorld); // 循环
        };
  
        // 更新所有粒子
        const update = () => {
          // 每次概率产生新的烟花粒子
          if (particles.length < 500 && Math.random() < probability) {
            createFirework();
          }
          const alive = [];
          // 过滤掉已经消失的粒子
          for (let i = 0; i < particles.length; i++) {
            if (particles[i].move()) {
              alive.push(particles[i]);
            }
          }
          particles = alive; // 更新粒子数组，去除已消失的粒子
        };
  
        // 绘制烟花效果
        const paint = () => {
          ctx.clearRect(0, 0, w, h);  // 清空画布，确保每一帧从清晰背景开始
          ctx.globalCompositeOperation = 'source-over';  // 恢复默认的绘制模式
          ctx.fillStyle = "rgba(0,0,0,0)";  // 背景完全透明
          ctx.fillRect(0, 0, w, h);  // 填充透明背景
          ctx.globalCompositeOperation = 'lighter';  // 设置混合模式为lighter，增强效果
          for (let i = 0; i < particles.length; i++) {
            particles[i].draw(ctx); // 绘制每个粒子
          }
        };
  
        // 创建一个新的烟花爆炸
        const createFirework = () => {
          // 设定爆炸点的随机位置
          xPoint = Math.random() * (w - 200) + 100;
          yPoint = Math.random() * (h - 200) + 100;
          const nFire = Math.random() * 50 + 100; // 爆炸的粒子数量
          const c = "rgb(" + (~~(Math.random() * 200 + 55)) + "," +
            (~~(Math.random() * 200 + 55)) + "," + (~~(Math.random() * 200 + 55)) + ")"; // 随机颜色
          // 创建粒子
          for (let i = 0; i < nFire; i++) {
            const particle = new Particle();
            particle.color = c; // 设置粒子颜色
            const vy = Math.sqrt(25 - particle.vx * particle.vx);
            if (Math.abs(particle.vy) > vy) {
              particle.vy = particle.vy > 0 ? vy : -vy; // 限制粒子的最大速度
            }
            particles.push(particle); // 将粒子添加到粒子数组
          }
        };
  
        // 粒子构造函数
        function Particle() {
          this.w = this.h = Math.random() * 4 + 1; // 粒子的大小
          this.x = xPoint - this.w / 2; // 粒子初始位置
          this.y = yPoint - this.h / 2;
          this.vx = (Math.random() - 0.4) * 10; // 粒子初始水平方向速度
          this.vy = (Math.random() - 0.4) * 10; // 粒子初始垂直方向速度
          this.alpha = Math.random() * .5 + .5; // 粒子的透明度
          this.color; // 粒子的颜色
          this.history = [];  // 粒子的历史位置，用于绘制尾巴效果
        }
  
        Particle.prototype = {
          gravity: 0.05, // 重力加速度
          move: function () {
            // 更新粒子位置
            this.x += this.vx;
            this.vy += this.gravity;  // 应用重力
            this.y += this.vy;
            this.alpha -= 0.01;  // 渐变透明
  
            // 记录粒子的历史位置，用于绘制尾巴
            this.history.push({ x: this.x, y: this.y });
  
            // 限制历史位置的数量，防止过多影响性能
            if (this.history.length > 10) {
              this.history.shift(); // 超过10个位置，移除最早的位置
            }
  
            // 如果粒子超出边界或透明度小于0，则返回false，表示粒子消失
            if (this.x <= -this.w || this.x >= w ||
              this.y >= h ||
              this.alpha <= 0) {
              return false;
            }
            return true;
          },
          draw: function (c) {
            c.save();
  
            // 绘制尾巴：从粒子的历史位置绘制线条
            if (this.history.length > 1) {
              c.beginPath();
              c.moveTo(this.history[0].x, this.history[0].y);
              for (let i = 1; i < this.history.length; i++) {
                const p = this.history[i];
                c.lineTo(p.x, p.y);  // 绘制线段
              }
              c.strokeStyle = this.color; // 设置尾巴颜色
              c.lineWidth = 1;
              c.globalAlpha = 0.5; // 使尾巴透明
              c.stroke(); // 绘制尾巴
            }
  
            // 绘制粒子本身
            c.beginPath();
            c.translate(this.x + this.w / 2, this.y + this.h / 2); // 移动到粒子的中心
            c.arc(0, 0, this.w, 0, Math.PI * 2); // 绘制粒子
            c.fillStyle = this.color; // 粒子颜色
            c.globalAlpha = this.alpha; // 粒子的透明度
            c.closePath();
            c.fill(); // 填充粒子
  
            c.restore();
          }
        };
  
        // 监听窗口大小变化，调整画布尺寸
        window.addEventListener("resize", resizeCanvas, false);
  
        // 支持多种浏览器的 requestAnimationFrame
        window.requestAnimationFrame = window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);
          };
  
        resizeCanvas(); // 初始化画布大小
        window.requestAnimationFrame(updateWorld); // 启动动画循环
      };
  
      onMounted(() => {
        if (props.isVisible) {
          setFireWorks(); // 初始化烟花效果
        }
        setInterval(() => {
          if(!played.value && props.isVisible)
            {
                setFireWorks(); // 初始化烟花效果
                played.value = true;
            }
        }, 500);
      });
  
      onBeforeUnmount(() => {
        window.removeEventListener("resize", resizeCanvas); // 清除事件监听
      });
  
      return { canvas };
    }
  };
  </script>
  
  <style scoped>
  .fireworks-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent;
  }
  
  .fireworks-canvas {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    background: transparent;  /* 确保透明背景 */
  }
  </style>
  