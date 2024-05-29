import { Http } from '@anyup/uni-http'
import { FlyHttp } from '@anyup/flyit'

// 统一接口前缀 baseURL
const baseURL = 'https://api.example.com'
// 统一header
const header = { 'Content-Type': 'application/json' }
// http 实例，设置统一
const http = new Http().setBaseURL(baseURL).setHeader(header)

// 请求拦截器
http.interceptors.request.use(
	request => {
		// 如果配置了loading，需要显示
		if (request.loading) {
			uni.showLoading({
				title: '加载中',
				mask: true
			})
		}
		// 设置请求 header token
		const token = uni.getStorageSync('token')
		if (token) {
			request.header['Authorization'] = `Bearer ${token}`
		}
		return request
	},
	error => {
		return Promise.reject(error)
	}
)
// 响应拦截器
http.interceptors.response.use(
	// 请求成功
	response => {
		if (!response.data) {
			// 接口请求未知错误
			return Promise.reject(new Error('接口请求未知错误'))
		}
		// 其他业务处理，根据code判断，比如token过期，重定向到登录页面
		const { code, msg } = response.data
		if (code === 30203) {
		}
		return response
	},
	// 请求失败
	error => {
		return Promise.reject(error);
	},
	// 请求完成：成功失败都会走此回调
	complete => {
		// 请求完成
		if (complete.request.loading) {
			// 如果配置了loading，需要关闭
			setTimeout(function () {
				uni.hideLoading();
			}, 1000);
		}
	}
)

export default new FlyHttp.Builder(http)
