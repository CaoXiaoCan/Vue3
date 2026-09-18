<template>
	<view class="login-wrapper">

		<!-- ================= APP 和 小程序 端布局 (图一) ================= -->
		<!-- #ifndef H5 -->
		<view class="mobile-layout">
			<view class="header">
				<text class="title">欢迎回来</text>
				<text class="subtitle">请登录您的账号体验完整功能</text>
			</view>

			<view class="form-box">
				<view class="input-item mobile-input">
					<input class="input-el" v-model="formData.username" placeholder="请输入手机号/用户名" />
				</view>
				<view class="input-item mobile-input">
					<input class="input-el" v-model="formData.password" type="password" placeholder="请输入登录密码" />
				</view>
			</view>

			<button class="login-btn mobile-btn" @click="handleLogin">登 录</button>

			<view class="footer-action">
				<text class="action-text" @click="navTo('/pages/login/forgot')">忘记密码？</text>
				<text class="action-text register-text">注册新账号</text>
			</view>
		</view>
		<!-- #endif -->


		<!-- ================= Web (H5) 端布局 (图二) ================= -->
		<!-- #ifdef H5 -->
		<view class="pc-layout">
			<!-- 左侧大图区域 (按需替换背景图) -->
			<view class="pc-left-banner"></view>

			<!-- 右侧表单区域 -->
			<view class="pc-right-form">
				<view class="pc-form-container">
					<view class="pc-header">
						<text class="pc-title">欢迎登录</text>
						<text class="pc-subtitle">曹灿</text>
					</view>

					<view class="pc-input-group">
						<view class="input-item pc-input">
							<text class="icon">👤</text>
							<input class="input-el" v-model="formData.username" placeholder="请输入账号" />
						</view>
						<view class="input-item pc-input">
							<text class="icon">🔒</text>
							<input class="input-el" v-model="formData.password"
								:type="showPassword ? 'text' : 'password'" placeholder="请输入密码" />
							<text class="icon eye-icon"
								@click="togglePasswordVisibility">{{ showPassword ? '👁️' : '🕶️' }}</text>
						</view>
					</view>

					<view class="pc-options">
						<label class="checkbox-label">
							<checkbox value="1" checked="true" style="transform:scale(0.7)" /> 记住密码
						</label>
						<text class="pc-forget" @click="navTo('/pages/login/forgot')">忘记密码</text>
					</view>

					<button class="login-btn pc-btn" @click="handleLogin">登 录</button>

					<view class="pc-agreement">
						<text>登录即表明您同意 </text>
						<text class="link" @click.stop="navTo('/pages/login/agreement')">《服务协议》</text> 和 <text
							class="link" @click.stop="navTo('/pages/login/private')">《隐私政策》</text>
						<text class="pc-register" @click.stop="navTo('/pages/login/register')">立即注册</text>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->

	</view>
</template>

<script setup>
	import { switchTab } from '@/utils/common.js';
	import {reactive,ref} from 'vue';
	// 1. 定义一个响应式变量，默认是 false (闭眼，暗文)
	const showPassword = ref(false);
	// 2. 定义点击图标时触发的方法
	const togglePasswordVisibility = () => {
		// 把变量的值反转：如果是 false 就变成 true，是 true 就变成 false
		showPassword.value = !showPassword.value;
	};
	// 定义通用的页面跳转函数
	const navTo = (url) => {
		// 增加一个安全校验，防止没传地址
		if (!url) return;

		// 使用 uni.navigateTo 进行跳转
		uni.navigateTo({
			url: url,
			fail: (err) => {
				console.error('跳转失败，请检查路径:', err);
				// 如果跳转失败（比如页面没建好），给个友好提示
				uni.showToast({
					title: '页面开发中',
					icon: 'none'
				});
			}
		});
	};

	const formData = reactive({
		username: '',
		password: ''
	});

	const handleLogin = () => {
		if (!formData.username || !formData.password) {
			uni.showToast({
				title: '请输入完整信息',
				icon: 'none'
			});
			return;
		}

		// 收集到的 formData 数据，可以直接通过 uni.request 发送给你的 ThinkPHP 后端接口进行验证
		console.log('准备提交的登录参数：', formData);
		uni.showToast({
			title: '校验通过，准备请求',
			icon: 'success',
			success: () => {
				// 延迟一点点跳转，让用户能看清 Toast 提示
				setTimeout(() => {
					// 使用你封装好的方法
					switchTab('/pages/index/index');

					// 或者直接使用原生 API：
					// uni.switchTab({ url: '/pages/index/index' });
				}, 1000);
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
	.mobile-layout {
		padding: 60px 30px;
	}

	.header {
		margin-bottom: 50px;
	}

	.title {
		font-size: 28px;
		font-weight: 600;
		display: block;
		margin-bottom: 10px;
	}

	.subtitle {
		font-size: 14px;
		color: #888;
	}

	.mobile-input {
		background-color: #fff;
		border-radius: 12px;
		margin-bottom: 20px;
		padding: 0 15px;
		border: none;
	}

	.mobile-btn {
		background-color: #007aff;
		color: #fff;
		border-radius: 25px;
		margin-top: 40px;
	}

	.footer-action {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
		padding: 0 10px;
	}

	.action-text {
		font-size: 13px;
		color: #888;
	}

	.register-text {
		color: #007aff;
	}


	/* ================= PC端样式 (Flex 左右分栏) ================= */
	.pc-layout {
		display: flex;
		height: 100vh;
		background-color: #fff;
	}

	/* 左侧占位/图片区域 */
	.pc-left-banner {
		flex: 1;
		/* 占据剩余全部空间 */
		background-color: #f0f2f5;
		/* 此处可替换为图二左侧的背景图： */
		/* background: url('@/static/logo.png') center/cover no-repeat; */
		/* 让图片等比例缩放，完全覆盖整个左侧区域，绝不拉伸变形 */
		background-size: cover;
		/* 将图片居中对齐，保证核心画面不被裁掉 */
		background-position: center;
		/* 防止图片太小时重复平铺 */
		background-repeat: no-repeat;
	}

	/* 右侧表单容器 */
	.pc-right-form {
		width: 500px;
		/* 固定右侧宽度 */
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		box-shadow: -5px 0 20px rgba(0, 0, 0, 0.02);
	}

	.pc-form-container {
		width: 320px;
	}

	.pc-header {
		margin-bottom: 40px;
	}

	.pc-title {
		font-size: 32px;
		font-weight: bold;
		color: #2c3e50;
		display: block;
		margin-bottom: 10px;
	}

	.pc-subtitle {
		font-size: 16px;
		color: #5c6b77;
	}

	/* PC端带边框的输入框 */
	.pc-input {
		display: flex;
		align-items: center;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		margin-bottom: 20px;
		padding: 0 10px;
		background-color: #fff;
	}

	.pc-input .icon {
		margin-right: 10px;
		font-size: 16px;
		color: #999;
	}

	.pc-input .eye-icon {
		margin-right: 0;
		margin-left: 10px;
	}

	.pc-options {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
		color: #606266;
		margin-bottom: 30px;
	}

	.pc-forget {
		color: #999;
		cursor: pointer;
	}

	.pc-btn {
		background-color: #0066ff;
		color: #fff;
		border-radius: 4px;
		font-size: 16px;
		height: 45px;
		line-height: 45px;
	}

	.pc-agreement {
		margin-top: 20px;
		font-size: 12px;
		color: #999;
	}

	.pc-agreement .link {
		color: #0066ff;
		cursor: pointer;
	}

	.pc-register {
		float: right;
		color: #0066ff;
		cursor: pointer;
	}

	/* 公共 Input 样式 */
	.input-el {
		height: 45px;
		font-size: 15px;
		color: #333;
		flex: 1;
	}

	button::after {
		border: none;
	}
</style>