<template>
  <view class="container">
    <view class="header">
      <text class="title">极简送货单</text>
    </view>

    <!-- 基础信息表单 -->
    <view class="form-group">
      <view class="form-item">
        <text class="label">客户名称:</text>
        <input class="input" v-model="orderData.customerName" placeholder="请输入客户或公司名" />
      </view>
      <view class="form-item">
        <text class="label">开单日期:</text>
        <picker mode="date" :value="orderData.date" @change="bindDateChange">
          <view class="input picker-text">{{ orderData.date }}</view>
        </picker>
      </view>
    </view>

    <!-- 商品明细列表 -->
    <view class="goods-list">
      <view class="list-header">
        <text class="flex-3">品名</text>
        <text class="flex-15 text-center">数量</text>
        <text class="flex-15 text-center">单位</text>
        <text class="flex-2 text-center">单价</text>
        <text class="flex-05"></text>
      </view>
      
      <view class="goods-item" v-for="(item, index) in orderData.items" :key="index">
        <input class="input-cell flex-3" v-model="item.name" placeholder="商品名" />
        <input class="input-cell flex-15 text-center" type="number" v-model="item.qty" placeholder="0" />
        
        <picker 
          class="input-cell flex-15 text-center picker-unit" 
          :range="unitOptions" 
          :value="unitOptions.indexOf(item.unit)" 
          @change="(e) => bindUnitChange(e, index)"
        >
          <view class="picker-text">{{ item.unit || '选择' }} ▾</view>
        </picker>

        <input class="input-cell flex-2 text-center" type="digit" v-model="item.price" placeholder="0.00" />
        <text class="delete-btn flex-05 text-center" @click="removeItem(index)">✖</text>
      </view>
      
      <button class="add-btn" @click="addItem">+ 添加一行商品</button>
    </view>

    <!-- 底部结算栏 (利用 var(--window-bottom) 避开原生 TabBar) -->
    <view class="footer-bar">
      <view class="total">合计: <text class="price">￥{{ totalPrice }}</text></view>
      <button class="submit-btn" @click="goToPreview">去签名确认</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

const unitOptions = ['个', '箱', '斤', '件', '台', '包'];
const orderData = ref({
  customerName: '',
  date: new Date().toISOString().slice(0, 10),
  items: [ { name: '', qty: 1, unit: '个', price: '' } ] 
});

const bindUnitChange = (e, index) => orderData.value.items[index].unit = unitOptions[e.detail.value];
const bindDateChange = (e) => orderData.value.date = e.detail.value;
const addItem = () => orderData.value.items.push({ name: '', qty: 1, unit: '个', price: '' });
const removeItem = (index) => {
  if (orderData.value.items.length > 1) orderData.value.items.splice(index, 1);
};

// 计算总价
const totalPrice = computed(() => {
  return orderData.value.items.reduce((sum, item) => {
    return sum + ((parseFloat(item.qty)||0) * (parseFloat(item.price)||0));
  }, 0).toFixed(2);
});

// 跳转到签名与预览页
const goToPreview = () => {
  if (!orderData.value.customerName) return uni.showToast({ title: '请输入客户名称', icon: 'none' });
  const payload = { ...orderData.value, total: totalPrice.value };
  uni.setStorageSync('current_order', payload);
  uni.navigateTo({ url: '/pages/preview/preview' });
};
</script>

<style scoped>
.container { padding: 20px; padding-bottom: calc(100px + var(--window-bottom, 0px)); background-color: #f8f9fa; min-height: 100vh; }
.header { margin-bottom: 20px; text-align: center; }
.title { font-size: 20px; font-weight: bold; }
.form-group, .goods-list { background: #fff; border-radius: 8px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.form-item { display: flex; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;}
.label { width: 80px; font-size: 14px; color: #333; }
.input { flex: 1; font-size: 14px; padding: 5px; }
.list-header { display: flex; font-size: 12px; color: #888; margin-bottom: 10px; }
.goods-item { display: flex; align-items: center; margin-bottom: 10px; gap: 4px; }
.input-cell { border: 1px solid #eee; border-radius: 4px; padding: 6px 2px; font-size: 13px; }
.picker-unit { background-color: #fcfcfc; color: #007aff; cursor: pointer; }
.flex-3 { flex: 3; } .flex-2 { flex: 2; } .flex-15 { flex: 1.5; } .flex-05 { flex: 0.5; }
.text-center { text-align: center; }
.delete-btn { color: #ff4d4f; font-size: 16px; cursor: pointer; padding: 5px; }
.add-btn { background: #f0f0f0; color: #333; font-size: 14px; margin-top: 10px; border: none; }
.footer-bar { position: fixed; bottom: var(--window-bottom, 0); left: 0; right: 0; height: 60px; background: #fff; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; box-shadow: 0 -2px 10px rgba(0,0,0,0.05); z-index: 999; }
.total { font-size: 16px; font-weight: bold; }
.price { color: #ff4d4f; font-size: 20px; }
.submit-btn { background: #007aff; color: #fff; font-size: 16px; width: 120px; margin: 0; border-radius: 20px;}
</style>