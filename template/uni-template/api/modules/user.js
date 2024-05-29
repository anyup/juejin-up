import http from '../http'

const urls = {
  userLogin: { url: '/user/login', method: 'POST', loading: true }, // 登录示例
  userLogout: { url: '/user/logout', method: 'POST', loading: true }, // 注销示例
}

export default http.dispatch(urls)
