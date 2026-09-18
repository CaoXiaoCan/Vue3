<template>
  <view class="auth-wrapper">
    <!-- ================= APP 和 小程序 端布局 ================= -->
    <!-- #ifndef H5 -->
    <view class="mobile-layout">
      <view class="header">
        <!-- 这里的文字，注册页写"欢迎注册"，忘记密码页写"找回密码" -->
        <text class="title">欢迎注册</text>
        <text class="subtitle">探蛙信息科技</text>
      </view>

      <view class="form-box">
        <view class="input-item mobile-input">
          <input class="input-el" v-model="formData.phone" placeholder="请输入手机号" type="number" />
        </view>
        <view class="input-item mobile-input verify-code-group">
          <input class="input-el" v-model="formData.code" placeholder="请输入验证码" type="number" />
          <text class="get-code-btn" :class="{ disabled: isCounting }" @click="getVerifyCode">
            {{ isCounting ? `${countdown}s后重发` : '获取验证码' }}
          </text>
        </view>
        <view class="input-item mobile-input">
          <input class="input-el" v-model="formData.password" type="password" placeholder="请输入新密码" />
        </view>
        <view class="input-item mobile-input">
          <input class="input-el" v-model="formData.confirmPassword" type="password" placeholder="请再次输入新密码" />
        </view>
      </view>

      <!-- 这里的文字，注册页写"立即注册"，忘记密码页写"确认修改" -->
      <button class="auth-btn mobile-btn" @click="handleSubmit">立 即 注 册</button>
      
      <view class="footer-action">
        <text class="action-text link" @click="navBack()">已有账号？返回登录</text>
      </view>
    </view>
    <!-- #endif -->


    <!-- ================= Web (H5) 端布局 ================= -->
    <!-- #ifdef H5 -->
    <view class="pc-layout">
      <!-- 左侧大图区域 -->
      <view class="pc-left-banner"></view>

      <!-- 右侧表单区域 -->
      <view class="pc-right-form">
        <view class="pc-form-container">
          <view class="pc-header">
            <!-- 这里的文字，注册页写"欢迎注册"，忘记密码页写"找回密码" -->
            <text class="pc-title">欢迎注册</text>
            <text class="pc-subtitle">探蛙信息科技</text>
          </view>

          <view class="pc-input-group">
            <view class="input-item pc-input">
              <text class="icon">📱</text>
              <input class="input-el" v-model="formData.phone" placeholder="请输入手机号" type="number" />
            </view>
            <view class="input-item pc-input pc-verify-code">
              <text class="icon">✉️</text>
              <input class="input-el" v-model="formData.code" placeholder="请输入验证码" type="number" />
              <text class="get-code-btn" :class="{ disabled: isCounting }" @click="getVerifyCode">
                {{ isCounting ? `${countdown}s后重发` : '获取验证码' }}
              </text>
            </view>
            <view class="input-item pc-input">
              <text class="icon">🔒</text>
              <input class="input-el" v-model="formData.password" type="password" placeholder="请输入新密码" />
            </view>
            <view class="input-item pc-input">
              <text class="icon">🔒</text>
              <input class="input-el" v-model="formData.confirmPassword" type="password" placeholder="请再次输入新密码" />
            </view>
          </view>

          <!-- 这里的文字，注册页写"立即注册"，忘记密码页写"确认修改" -->
          <button class="auth-btn pc-btn" @click="handleSubmit">立 即 注 册</button>

          <view class="pc-bottom-link">
             <text class="link" @click="navBack()">返回登录</text>
          </view>
        </view>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { navBack } from '@/utils/common.js'; // 引入之前封装的返回方法

const formData = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
});

// 倒计时相关逻辑
const isCounting = ref(false);
const countdown = ref(60);
let timer = null;

const getVerifyCode = () => {
  if (isCounting.value) return;
  
  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  
  // 模拟发送验证码
  uni.showToast({ title: '验证码已发送', icon: 'success' });
  isCounting.value = true;
  countdown.value = 60;
  
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      isCounting.value = false;
    }
  }, 1000);
};

const handleSubmit = () => {
  if (!formData.phone || !formData.code || !formData.password) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' });
    return;
  }
  if (formData.password !== formData.confirmPassword) {
    uni.showToast({ title: '两次输入的密码不一致', icon: 'none' });
    return;
  }

  // 接下来这里写你对接后端的 uni.request 逻辑...
  console.log('正在提交数据...', formData);
  
  uni.showToast({ title: '处理成功', icon: 'success' });
  
  // 模拟处理成功后，延迟 1.5 秒返回登录页
  setTimeout(() => {
    navBack();
  }, 1500);
};
</script>

<style scoped>
/* 页面底层统一样式 */
.auth-wrapper {
  min-height: 100vh;
  background-color: #f7f9fb;
}

/* ================= 移动端样式 ================= */
.mobile-layout { padding: 60px 30px; }
.header { margin-bottom: 50px; }
.title { font-size: 28px; font-weight: 600; display: block; margin-bottom: 10px; }
.subtitle { font-size: 14px; color: #888; }
.mobile-input {
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 20px;
  padding: 0 15px;
  border: none;
  display: flex;
  align-items: center;
}
.mobile-btn {
  background-color: #007aff;
  color: #fff;
  border-radius: 25px;
  margin-top: 40px;
}
.footer-action {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* ================= PC端样式 (Flex 左右分栏) ================= */
.pc-layout {
  display: flex;
  height: 100vh;
  background-color: #fff;
}
.pc-left-banner {
  flex: 1; 
  background-color: #f0f2f5;
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
  /* background-image: url('@/static/login-bg.jpg');  请配置你的背景图 */
}
.pc-right-form {
  width: 500px; 
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  box-shadow: -5px 0 20px rgba(0,0,0,0.02);
}
.pc-form-container { width: 320px; }
.pc-header { margin-bottom: 40px; }
.pc-title { font-size: 32px; font-weight: bold; color: #2c3e50; display: block; margin-bottom: 10px; }
.pc-subtitle { font-size: 16px; color: #5c6b77; }

.pc-input {
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 0 10px;
  background-color: #fff;
}
.pc-input .icon { margin-right: 10px; font-size: 16px; color: #999; }

.pc-btn {
  background-color: #0066ff;
  color: #fff;
  border-radius: 4px;
  font-size: 16px;
  height: 45px;
  line-height: 45px;
  margin-top: 20px;
}

.pc-bottom-link {
  margin-top: 20px;
  text-align: right;
  font-size: 14px;
}

/* ================= 公共组件样式 ================= */
.input-el { height: 45px; font-size: 15px; color: #333; flex: 1; }
.link { color: #0066ff; cursor: pointer; }
button::after { border: none; }

/* 验证码按钮样式 */
.get-code-btn {
  font-size: 14px;
  color: #007aff;
  cursor: pointer;
  padding-left: 10px;
  border-left: 1px solid #eee;
  min-width: 80px;
  text-align: center;
}
.get-code-btn.disabled {
  color: #999;
  cursor: not-allowed;
}
</style>