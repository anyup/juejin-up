<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <button class="title" type="primary" @click="userLogin">
        测试 API 请求
      </button>
    </view>
    <view v-if="request" class="response-area">
      <view v-for="item in Object.keys(request)" :key="item">
        {{ item }} ： {{ request[item] }}
      </view>
    </view>
  </view>
</template>

<script>
import api from "@/api";
export default {
  data() {
    return {
      request: null,
    };
  },
  onLoad() {},
  methods: {
    async userLogin() {
      const data = { username: "admin", password: "123456" };
      const res = await api.user.userLogin({ data: data }).catch((error) => {
        this.request = error.request;
        console.log(error);
      });
      // 请求成功
      if (res) {
        console.log(res);
      }
    },
  },
};
</script>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 50rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
}

.response-area {
  padding: 10rpx;
  view {
    margin-bottom: 10rpx;
  }
}
</style>
