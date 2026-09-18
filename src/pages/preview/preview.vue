<template>
  <view class="container">
    <view v-if="!finalImage">
      <view class="notice">请在下方空白处手写签名：</view>
      
      <view class="canvas-wrap">
        <!-- 统一使用 uni-app 的标准 canvas 组件和 canvas-id -->
        <canvas 
          canvas-id="signCanvas" 
          id="signCanvas"
          class="sign-canvas" 
          @touchstart="handleStart" 
          @touchmove="handleMove" 
          @touchend="handleEnd"
          @mousedown="handleStart"
          @mousemove="handleMove"
          @mouseup="handleEnd"
          @mouseleave="handleEnd"
        ></canvas>
      </view>
      
      <view class="actions">
        <button class="btn-clear" @click="clearSign">重签</button>
        <button class="btn-primary" @click="generateReceipt">生成单据图片</button>
      </view>
    </view>

    <!-- 生成结果展示 -->
    <view v-else class="result-wrap">
      <image :src="finalImage" mode="widthFix" class="receipt-img"></image>
      <!-- #ifdef MP-WEIXIN -->
      <button class="btn-primary share-btn" @click="shareToWechat">发给微信客户</button>
      <!-- #endif -->
      <!-- #ifdef H5 || APP-PLUS -->
      <button class="btn-primary share-btn" @click="downloadImage">下载保存单据</button>
      <view class="tip-text">PC端可右键保存，手机端长按保存</view>
      <!-- #endif -->
      <button class="btn-clear mt-10" @click="resetAll">重新开单</button>
    </view>

    <!-- 用于静默合成单据的隐藏Canvas -->
    <canvas canvas-id="receiptCanvas" :style="{ width: '400px', height: canvasHeight + 'px', position: 'fixed', top: '-99999px', left: 0 }"></canvas>

    <!-- 高仿底部导航栏 -->
    <view class="fake-tabbar">
      <view class="tab-item" @click="resetAll">
        <image class="tab-icon" src="/static/home.png" mode="aspectFit"></image>
        <text class="tab-text text-active">首页</text>
      </view>
      <view class="tab-item">
        <image class="tab-icon" src="/static/tool.png" mode="aspectFit"></image>
        <text class="tab-text">工具</text>
      </view>
      <view class="tab-item">
        <image class="tab-icon" src="/static/mine.png" mode="aspectFit"></image>
        <text class="tab-text">我的</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const finalImage = ref('');
const canvasHeight = ref(600);
let signCtx = null;
let hasSigned = false;
let orderData = {};
let isDrawing = false;

onMounted(() => {
  orderData = uni.getStorageSync('current_order') || {};
  if (orderData.items && orderData.items.length > 0) {
    canvasHeight.value = 350 + (orderData.items.length * 30);
  }
  
  // 1. 初始化小程序/手机端的 Canvas 上下文
  signCtx = uni.createCanvasContext('signCanvas');
  signCtx.setLineWidth(3);
  signCtx.setLineCap('round');
  signCtx.setLineJoin('round');
  signCtx.setStrokeStyle('#000000');

  // 2. 针对 PC 浏览器 (H5环境)，单独绑定原生的鼠标拖拽监听
  // #ifdef H5
  nextTick(() => {
    initH5MouseDraw();
  });
  // #endif
});

// ================== 专门针对 PC 浏览器的原生鼠标监听 ==================
const initH5MouseDraw = () => {
  // 获取 uni-app 渲染出来的底层 canvas DOM
  const canvasEl = document.querySelector('#signCanvas') || document.querySelector('canvas');
  if (!canvasEl) return;

  let mousePressed = false;

  canvasEl.addEventListener('mousedown', (e) => {
    mousePressed = true;
    hasSigned = true;
    const rect = canvasEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    signCtx.beginPath();
    signCtx.moveTo(x, y);
  });

  canvasEl.addEventListener('mousemove', (e) => {
    if (!mousePressed) return;
    const rect = canvasEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    signCtx.lineTo(x, y);
    signCtx.stroke();
    signCtx.draw(true); // 保留之前的轨迹
    signCtx.moveTo(x, y);
  });

  const stopMouse = () => {
    if (mousePressed) {
      mousePressed = false;
      signCtx.closePath();
    }
  };

  canvasEl.addEventListener('mouseup', stopMouse);
  canvasEl.addEventListener('mouseleave', stopMouse);
};
// =======================================================================

// 手机端触摸事件（保持不变，确保手机端正常）
const handleStart = (e) => {
  isDrawing = true;
  const touch = e.touches[0];
  signCtx.beginPath();
  signCtx.moveTo(touch.x, touch.y);
};

const handleMove = (e) => {
  if (!isDrawing) return;
  hasSigned = true;
  const touch = e.touches[0];
  signCtx.lineTo(touch.x, touch.y);
  signCtx.stroke();
  signCtx.draw(true);
  signCtx.moveTo(touch.x, touch.y);
};

const handleEnd = () => {
  isDrawing = false;
};

const clearSign = () => {
  hasSigned = false;
  signCtx.clearRect(0, 0, 300, 200);
  signCtx.draw();
};

// 开始生成单据图片
const generateReceipt = () => {
  uni.showLoading({ title: '单据生成中...' });

  // 情况 A：用户没有签名，直接用文字“系统”代替
  if (!hasSigned) {
    drawFullReceipt(null); // 传入 null 代表使用默认文字
    return;
  }

  // 情况 B：用户有手写签名，先导出签名图片再合成
  // #ifdef MP-WEIXIN
  uni.canvasToTempFilePath({
    canvasId: 'signCanvas',
    x: 0, y: 0, width: 300, height: 200, destWidth: 300, destHeight: 200,
    success: (res) => drawFullReceipt(res.tempFilePath),
    fail: () => {
      uni.hideLoading();
      uni.showToast({ title: '签名导出失败', icon: 'none' });
    }
  });
  // #endif

  // #ifdef H5
  const canvasEl = document.querySelector('#signCanvas') || document.querySelector('canvas');
  if (canvasEl) {
    const base64Img = canvasEl.toDataURL('image/png');
    drawFullReceipt(base64Img);
  } else {
    uni.hideLoading();
  }
  // #endif
};

// 核心：合成整张面单图片
const drawFullReceipt = (signImagePath) => {
  const ctx = uni.createCanvasContext('receiptCanvas');
  
  ctx.setFillStyle('#FFFFFF');
  ctx.fillRect(0, 0, 400, canvasHeight.value);
  
  ctx.setFillStyle('#000000');
  ctx.setFontSize(24);
  ctx.setTextAlign('center');
  ctx.fillText('出库送货单', 200, 40);
  
  ctx.setFontSize(14);
  ctx.setTextAlign('left');
  ctx.fillText(`客户: ${orderData.customerName || '未填写'}`, 20, 80);
  ctx.fillText(`日期: ${orderData.date}`, 240, 80);
  ctx.moveTo(20, 95); ctx.lineTo(380, 95); ctx.stroke();
  
  ctx.setFontSize(13);
  ctx.setFillStyle('#666666');
  ctx.fillText('品名', 20, 115);
  ctx.fillText('数量/单位', 160, 115);
  ctx.fillText('单价', 260, 115);
  ctx.fillText('小计', 330, 115);
  ctx.moveTo(20, 125); ctx.lineTo(380, 125); ctx.stroke();
  
  let y = 150;
  ctx.setFillStyle('#000000');
  ctx.setFontSize(14);
  
  if(orderData.items && orderData.items.length) {
    orderData.items.forEach(item => {
      ctx.fillText(`${item.name || '--'}`, 20, y);
      ctx.fillText(`${item.qty} ${item.unit || ''}`, 160, y);
      ctx.fillText(`￥${item.price || '0'}`, 260, y);
      const subtotal = ((parseFloat(item.qty)||0) * (parseFloat(item.price)||0)).toFixed(2);
      ctx.fillText(`￥${subtotal}`, 330, y);
      y += 30;
    });
  }
  ctx.moveTo(20, y - 10); ctx.lineTo(380, y - 10); ctx.stroke();
  
  ctx.setFontSize(18);
  ctx.fillText(`合计金额: ￥${orderData.total}`, 20, y + 20);
  ctx.setFontSize(14);
  ctx.fillText('客户签收:', 20, y + 80);
  
  // 【核心修改】：判断是否有签名图片
  if (signImagePath && hasSigned) {
    // 有手写签名，画图片
    ctx.drawImage(signImagePath, 90, y + 40, 120, 60);
  } else {
    // 没有签名，直接在对应位置打印“系统”两个字
    ctx.setFontSize(20);
    ctx.setFillStyle('#333333');
    ctx.fillText('系统', 90, y + 80);
  }

  ctx.draw(false, () => {
    setTimeout(() => { 
      uni.canvasToTempFilePath({
        canvasId: 'receiptCanvas',
        x: 0, y: 0,
        width: 400, height: canvasHeight.value,
        destWidth: 400, destHeight: canvasHeight.value,
        success: (res) => { finalImage.value = res.tempFilePath; uni.hideLoading(); },
        fail: () => { uni.hideLoading(); }
      });
    }, 400); 
  });
};
const shareToWechat = () => {
  wx.showShareImageMenu({ path: finalImage.value, success: () => uni.showToast({ title: '分享成功' }) });
};

const downloadImage = () => {
  // #ifdef H5
  const a = document.createElement('a');
  a.href = finalImage.value;
  a.download = `送货单_${orderData.customerName}_${orderData.date}.png`;
  a.click();
  // #endif
};

const resetAll = () => {
  finalImage.value = '';
  uni.navigateBack(); 
};
</script>

<style scoped>
.container { padding: 20px; padding-bottom: 90px; background: #f8f9fa; min-height: 100vh; }
.notice { font-size: 14px; color: #666; margin-bottom: 10px; }
.canvas-wrap { 
  width: 300px; 
  height: 200px; 
  margin: 0 auto 20px; 
  background: #fff; 
  border: 1px dashed #ccc; 
  border-radius: 8px; 
  position: relative; 
}
.sign-canvas { 
  width: 100%; 
  height: 100%; 
  cursor: crosshair; 
  display: block;
}
.actions { display: flex; justify-content: space-between; gap: 15px; }
.btn-clear { flex: 1; background: #f0f0f0; color: #333; }
.btn-primary { flex: 2; background: #007aff; color: #fff; }
.result-wrap { text-align: center; }
.receipt-img { width: 100%; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 20px; border-radius: 4px; background-color: #fff;}
.share-btn { width: 80%; border-radius: 20px; margin-bottom: 10px; }
.tip-text { font-size: 12px; color: #999; margin-bottom: 20px; }
.mt-10 { margin-top: 10px; }
.fake-tabbar {
  position: fixed; bottom: 0; left: 0; width: 100%; height: 50px;
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #ffffff; border-top: 1px solid #eeeeee;
  display: flex; justify-content: space-around; align-items: center;
  z-index: 9999;
}
.tab-item { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; cursor: pointer; }
.tab-icon { width: 24px; height: 24px; margin-bottom: 2px; }
.tab-text { font-size: 10px; color: #7A7E83; }
.text-active { color: #007aff; }
</style>