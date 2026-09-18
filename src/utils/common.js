export const navTo = (url) => {
  if (!url) return;
  uni.navigateTo({
    url: url,
    fail: () => uni.showToast({ title: '页面开发中', icon: 'none' })
  });
};

// ================= 新增的返回上一页 =================
// 默认参数 delta = 1，表示默认退回 1 页
export const navBack = (delta = 1) => {
  uni.navigateBack({
    delta: delta,
    fail: (err) => {
      console.error('返回上一页失败，可能是因为已经是第一页了:', err);
      // 【企业级容错逻辑】：
      // 如果用户直接通过分享链接打开了某个内页，此时历史记录里没有上一页，
      // 原生的 navigateBack 会直接报错且没反应。
      // 我们的处理方式是：一旦返回失败，强行把他送回系统的首页（假设是下面的路径）
      uni.reLaunch({
        url: '/pages/index/index' 
      });
    }
  });
}
  
  // ================= 新增的切换底部 Tab =================
export const switchTab = (url) => {
    if (!url) return;
    uni.switchTab({
      url: url,
      fail: (err) => {
        console.error('切换 Tab 失败，请检查路径是否在 pages.json 的 tabBar 中配置:', err);
        // 如果跳转失败，给开发者一个明显的弹窗提示，方便排查错误
        uni.showToast({ 
          title: 'Tab路径错误', 
          icon: 'error' 
        });
      }
    });
  };