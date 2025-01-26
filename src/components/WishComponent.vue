<template>
    <div class="wish">
      <el-button type="primary" @click="wishClicked" z-index="1000">
        {{ wished ? "查看许愿" : "许愿" }}
      </el-button>
      <el-dialog
        title="许愿"
        v-model="wishDialogVisible"
        id="wishDialog"
        center="true"
        :modal="false"
        :append-to-body="true"
      >
        <template #title> 许愿 </template>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" style="max-height:600px;overflow: auto;">
          <el-tab-pane label="我的许愿" name="myWish">
            <div class="dialog-container">
              <div class="user-container">
                <el-avatar shape="circle">
                  <template #default>
                    <el-icon><UserFilled /></el-icon>
                  </template>
                </el-avatar>
                <el-tag type="success" size="large">{{ name }}</el-tag>
              </div>
              <el-form style="width: 100%;">
                <el-form-item label="许愿内容">
                  <el-input v-model="wishContent" type="textarea" maxlength="80" show-word-limit></el-input>
                </el-form-item>
                <div class="submit-btn">
                  <el-button type="primary" @click="submitWish">{{ wished?"更新":"提交" }}</el-button>
                </div>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="所有人的许愿" name="allWish" style="overflow: auto;">
            <div class="wishes-container">
              <WishCard v-for="wish in wishList.slice().reverse()" :key="wish.id" :user-name="wish.name" :content="wish.content" :love-number="wish.loves" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { onMounted, ref, watch } from "vue";
  import api from "@/utils/api/api.js";
  import { ElMessage, ElMessageBox } from "element-plus";
  import WishCard from "./WishCard.vue";

  export default {
    name: "WishComponent",
    components: {
      WishCard,
    },
    props: {
      userName: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const wishDialogVisible = ref(false);
      const wishContent = ref("");
      const wished = ref(false);
      const wishList = ref([]);
      const activeName = ref("myWish");
      const name = ref(props.userName);
      const errorShowed = ref(false);
      
      const showMessage = (message, type = "success") => {
        ElMessage({
          message,
          type,
        });
      };

      const showError = (message) => {
        if(!errorShowed.value) {
          errorShowed.value = true;
          ElMessageBox.alert(message, "错误", {
            confirmButtonText: "确定",
          });
        }
      };

      const submitWish = async () => {
        if (wishContent.value.length === 0) {
          return;
        }
        try {
          const wishData = {
            name: name.value,
            content: wishContent.value,
          };
          if (wished.value) {
            await api.updateWish(wishData);
            showMessage("更新愿望成功！祝你愿望成真！😁😁😁");
          } else {
            await api.addWish(wishData);
            showMessage("许愿成功！祝你愿望成真！😁😁😁");
            wished.value=true;
          }
          getWishList();
        } catch (error) {
          showError("很抱歉，操作失败。请检查您的网络。\n如果您的网络没有问题，请联系开发者程旭，程旭将竭力解决此问题。\nQQ：2860245799\nEmail：ProgramCX@outlook.com 2860245799@qq.com 2024305222@aust.edu.cn\n你也可以在 https://github.com/ProgramCX/new-year-celebration/issues 提交此问题。");
        }
      };

      const wishClicked = () => {
        wishDialogVisible.value = true;
      };

      const determinUserWished = async () => {
        try {
          const res = await api.getWish(name.value);
          if (res.data) {
            wishContent.value = res.data.content;
            wished.value = true;
          } else {
            wished.value = false;
          }
        } catch (error) {
          showError("获取愿望信息失败，请检查您的网络。");
        }
      };

      const getWishList = async () => {
        try {
          const res = await api.getWishList();
          wishList.value = res.data;
        } catch (error) {
          showError("获取愿望列表失败，请检查您的网络。");
        }
      };

      onMounted(() => {
        determinUserWished();
        getWishList();
        setInterval(() => {
          getWishList();
        }, 10000);
        
      });

      watch(wishContent, (newValue) => {
        console.log("wishContent changed:", newValue);
      });

      watch(wishDialogVisible, (newValue) => {
        console.log("wishDialogVisible changed:", newValue);
      });

      return {
        wishDialogVisible,
        wishContent,
        wished,
        submitWish,
        wishClicked,
        name,
        activeName,
        wishList,
      };
    },
  };
  </script>
  
  <style>
  #wishDialog {
    width: 40%;
    max-height: 600px;
  }
  
  .user-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .dialog-container {
    padding: 15px 25px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .submit-btn {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
  }
  
  @media screen and (max-width: 768px) {
    #wishDialog {
      width: 100%;
    }
  }
  .wishes-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: auto;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    height: 100%;
    max-height: 400px;
  }
  </style>
