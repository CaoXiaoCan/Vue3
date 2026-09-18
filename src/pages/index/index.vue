<template>
  <view class="container">
    <!-- 顶部欢迎语 -->
    <view class="banner">
      <text class="banner-title">实用工具箱</text>
      <text class="banner-subtitle">随时随地，高效处理日常业务</text>
    </view>

    <!-- 工具导航网格 (九宫格布局) -->
    <view class="grid-container">
      
      <!-- 工具卡片 1：极简送货单 (跳转到你刚刚做好的开单页) -->
      <view class="grid-item" @click="navigateTo('/pages/order/order')">
        <view class="icon-box blue">📄</view>
        <text class="grid-title">极简送货单</text>
        <text class="grid-desc">快速开单、手写签名、一键生成图片</text>
      </view>

      <!-- 工具卡片 2：预留的下一个小工具 (比如条码生成) -->
      <view class="grid-item" @click="comingSoon">
        <view class="icon-box orange">📦</view>
        <text class="grid-title">条码/箱唛生成</text>
        <text class="grid-desc">批量生成物流一维码与二维码 (开发中)</text>
      </view>

      <!-- 工具卡片 3：预留的再下一个小工具 -->
      <view class="grid-item" @click="comingSoon">
        <view class="icon-box green">⚖️</view>
        <text class="grid-title">快捷称重换算</text>
        <text class="grid-desc">零碎毛重、皮重、净重快速批量计算</text>
      </view>

      <!-- 你以后还想加什么工具，直接在这里复制一个 <view class="grid-item"> 即可 -->

    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 统一的跳转方法
const navigateTo = (url) => {
  // 如果页面还没有创建，可以先给个提示
  uni.navigateTo({
    url: url,
    fail: () => {
      uni.showToast({ title: '该工具正在赶来的路上...', icon: 'none' });
    }
  });
};

const comingSoon = () => {
  uni.showToast({ title: '新工具开发中，敬请期待！', icon: 'none' });
};
</script>

<style scoped>
.container { 
  padding: 20px; 
  background-color: #f4f6f8; 
  min-height: 100vh; 
}

.banner { 
  background: linear-gradient(135deg, #007aff, #00c6ff); 
  padding: 25px 20px; 
  border-radius: 12px; 
  color: #fff; 
  margin-bottom: 20px; 
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.2);
}
.banner-title { 
  font-size: 22px; 
  font-weight: bold; 
  display: block; 
  margin-bottom: 6px; 
}
.banner-subtitle { 
  font-size: 13px; 
  opacity: 0.9; 
}

/* 网格布局 */
.grid-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.grid-item {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  transition: transform 0.1s;
}

.grid-item:active {
  transform: scale(0.98); /* 点击时微弱缩放，提升手感 */
}

.icon-box {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 12px;
}
.blue { background-color: #e6f2ff; }
.orange { background-color: #fff5e6; }
.green { background-color: #e6ffe6; }

.grid-title {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 4px;
}

.grid-desc {
  font-size: 12px;
  color: #888888;
}
</style>