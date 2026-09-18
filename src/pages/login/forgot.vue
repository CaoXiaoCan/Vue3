<template>
	<view class="login-wrapper">

		<!-- ================= APP 和 小程序 端布局 ================= -->
		<!-- #ifndef H5 -->
		<view class="mobile-layout">
			<view class="header">
				<text class="title">重置密码</text>
				<text class="subtitle">验证手机号以找回您的账号密码</text>
			</view>

			<view class="form-box">
				<view class="input-item mobile-input">
					<input class="input-el" v-model="formData.phone" placeholder="请输入绑定的手机号" />
				</view>
				
				<view class="input-item mobile-input code-box">
					<input class="input-el" v-model="formData.code" placeholder="请输入验证码" />
					<text class="get-code-btn" @click="getVerifyCode">{{ countDown > 0 ? countDown + 's' : '获取验证码' }}</text>
				</view>

				<view class="input-item mobile-input">
					<input class="input-el" v-model="formData.newPassword" type="password" placeholder="请输入新密码" />
				</view>
			</view>

			<button class="login-btn mobile-btn" @click="handleResetPassword">确认重置</button>

			<view class="footer-action" style="justify-content: center;">
				<text class="action-text register-text" @click="navBack">想起来了？返回登录</text>
			</view>
		</view>
		<!-- #endif -->


		<!-- ================= Web (PC) 端布局 ================= -->
		<!-- #ifdef H5 -->
		<view class="pc-layout">
			<!-- 左侧大图区域 (和登录页保持一致) -->
			<view class="pc-left-banner"></view>

			<!-- 右侧表单区域 -->
			<view class="pc-right-form">
				<view class="pc-form-container">
					<view class="pc-header">
						<text class="pc-title">重置密码</text>
						<text class="pc-subtitle">探蛙信息科技</text>
					</view>

					<view class="pc-input-group">
						<view class="input-item pc-input">
							<text class="icon">📱</text>
							<input class="input-el" v-model="formData.phone" placeholder="请输入绑定的手机号" />
						</view>
						
						<view class="input-item pc-input code-box-pc">
							<text class="icon">🛡️</text>
							<input class="input-el" v-model="formData.code" placeholder="请输入短信验证码" />
							<text class="get-code-btn-pc" @click="getVerifyCode">{{ countDown > 0 ? countDown + 's' : '获取验证码' }}</text>
						</view>

						<view class="input-item pc-input">
							<text class="icon">🔒</text>
							<input class="input-el" v-model="formData.newPassword"
								:type="showPassword ? 'text' : 'password'" placeholder="请输入新密码" />
							<text class="icon eye-icon"
								@click="togglePasswordVisibility">{{ showPassword ? '👁️' : '🕶️' }}</text>
						</view>
					</view>

					<button class="login-btn pc-btn" @click="handleResetPassword">确认重置</button>

					<view class="pc-agreement" style="text-align: center; margin-top: 30px;">
						<text class="link" @click="navBack">想起来了？返回登录</text>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->

	</view>
</template>

<script setup>
import { reactive, ref } from 'vue';

// 手机号正则
const phoneRegex = /^1[3-9]\d{9}$/;

// 响应式数据
const formData = reactive({
	phone: '',
	code: '',
	newPassword: ''
});

const countDown = ref(0);
const showPassword = ref(false);

// 返回上一页 (登录页)
const navBack = () => {
	uni.navigateBack();
};

// 密码显示/隐藏切换
const togglePasswordVisibility = () => {
	showPassword.value = !showPassword.value;
};

// 获取验证码
const getVerifyCode = () => {
	if (!formData.phone) return uni.showToast({ title: '请输入手机号', icon: 'none' });
	if (!phoneRegex.test(formData.phone)) return uni.showToast({ title: '手机号格式错误', icon: 'none' });
	if (countDown.value > 0) return;

	// 模拟发短信
	console.log('向后端请求发送验证码给:', formData.phone);
	uni.showToast({ title: '验证码已发送', icon: 'success' });
	
	countDown.value = 60;
	let timer = setInterval(() => {
		countDown.value--;
		if (countDown.value <= 0) clearInterval(timer);
	}, 1000);
};

// 提交重置密码
const handleResetPassword = () => {
	if (!formData.phone) return uni.showToast({ title: '请输入手机号', icon: 'none' });
	if (!phoneRegex.test(formData.phone)) return uni.showToast({ title: '手机号格式错误', icon: 'none' });
	if (!formData.code) return uni.showToast({ title: '请输入验证码', icon: 'none' });
	if (!formData.newPassword) return uni.showToast({ title: '请输入新密码', icon: 'none' });

	console.log('准备提交的重置参数：', formData);
	
	uni.showToast({
		title: '密码重置成功',
		icon: 'success',
		success: () => {
			setTimeout(() => {
				navBack(); // 成功后返回登录页
			}, 1500);
		}
	});
};
</script>

<style scoped>
/* 页面底层统一样式 */
.login-wrapper {
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
.mobile-btn { background-color: #007aff; color: #fff; border-radius: 25px; margin-top: 40px; }
.footer-action { display: flex; justify-content: space-between; margin-top: 20px; padding: 0 10px; }
.action-text { font-size: 13px; color: #888; cursor: pointer; }
.register-text { color: #007aff; }

/* 移动端获取验证码按钮特有样式 */
.code-box .get-code-btn {
	color: #007aff;
	font-size: 14px;
	padding-left: 15px;
	border-left: 1px solid #eee;
	white-space: nowrap;
}


/* ================= PC端样式 ================= */
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
	/* background-image: url('@/static/logo.png'); */
}
.pc-right-form {
	width: 500px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #fff;
	box-shadow: -5px 0 20px rgba(0, 0, 0, 0.02);
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
.pc-input .eye-icon { margin-right: 0; margin-left: 10px; }
.pc-btn { background-color: #0066ff; color: #fff; border-radius: 4px; font-size: 16px; height: 45px; line-height: 45px; margin-top: 20px;}

/* PC端获取验证码按钮特有样式 */
.code-box-pc .get-code-btn-pc {
	color: #0066ff;
	font-size: 14px;
	cursor: pointer;
	padding-left: 15px;
	border-left: 1px solid #eee;
	white-space: nowrap;
}
.pc-agreement .link { color: #0066ff; cursor: pointer; }

/* 公共 Input 样式 */
.input-el { height: 45px; font-size: 15px; color: #333; flex: 1; }
button::after { border: none; }
</style>