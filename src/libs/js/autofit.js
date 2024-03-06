/**
 * description: 大屏渲染 scale 方案
Demo: 
autofit.init({
	designHeight: 1080,
	designWidth: 1920,
	renderDom: "#main",
	resize: true,
});
 */

// 定义变量
let currRenderDom = null; // 当前渲染的 DOM 元素
let currelRectification = ""; // 当前需要修正的元素选择器
let currelRectificationLevel = ""; // 当前元素修正的级别
let currelRectificationIsKeepRatio = ""; // 当前元素修正是否保持比例
let resizeListener = null; // resize事件监听器
let timer = null; // 定时器
let currScale = 1; // 当前缩放比例
let isElRectification = false; // 是否正在对元素进行修正

// 定义自适应适配对象
const autofit = {
	isAutofitRunnig: false, // 自适应是否正在运行
	// 初始化方法
	init(options = {}, isShowInitTip = true) {
		if (isShowInitTip) {
			console.log(`autofit.js is running`); // 控制台输出提示信息
		}
		const {
			dw = 1920, // 默认宽度
			dh = 1080, // 默认高度
			el = typeof options === "string" ? options : "body", // 元素选择器，默认为body
			resize = true, // 是否监听resize事件，默认为true
			ignore = [], // 忽略样式数组，默认为空数组
			transition = "none", // 过渡效果时间，默认为"none"
			delay = 0, // 延迟时间，默认为0
			limit = 0.1, // 限制值，默认为0.1
		} = options;

		// 获取当前DOM元素
		currRenderDom = el;
		let dom = document.querySelector(el);
		if (!dom) {
			console.error(`autofit: '${el}' is not exist`); // 控制台输出错误信息
			return;
		}

		// 生成样式元素，设置样式
		const style = document.createElement("style");
		const ignoreStyle = document.createElement("style");
		style.lang = "text/css";
		ignoreStyle.lang = "text/css";
		style.id = "autofit-style";
		ignoreStyle.id = "ignoreStyle";
		style.innerHTML = `body {overflow: hidden;}`; // 设置样式内容
		const bodyEl = document.querySelector("body");
		bodyEl.appendChild(style); // 添加样式至body
		bodyEl.appendChild(ignoreStyle); // 添加忽略样式至body

		// 设置DOM元素样式
		dom.style.height = `${dh}px`; // 设置高度
		dom.style.width = `${dw}px`; // 设置宽度
		dom.style.transformOrigin = `0 0`; // 设置变换原点
		dom.style.overflow = "hidden"; // 设置溢出隐藏
		keepFit(dw, dh, dom, ignore, limit); // 保持适配

		// 设置resize事件监听器
		resizeListener = () => {
			clearTimeout(timer);
			if (delay != 0)
				timer = setTimeout(() => {
					keepFit(dw, dh, dom, ignore, limit);
					isElRectification &&
						elRectification(currelRectification, currelRectificationIsKeepRatio, currelRectificationLevel);
				}, delay);
			else {
				keepFit(dw, dh, dom, ignore, limit);
				isElRectification &&
					elRectification(currelRectification, currelRectificationIsKeepRatio, currelRectificationLevel);
			}
		};
		resize && window.addEventListener("resize", resizeListener); // 监听resize事件
		this.isAutofitRunnig = true;
		setTimeout(() => {
			dom.style.transition = `${transition}s`; // 设置过渡效果
		});
	},

	// 关闭方法
	off(el = "body") {
		try {
			isElRectification = false;
			window.removeEventListener("resize", resizeListener); // 移除resize事件监听器
			document.querySelector("#autofit-style").remove(); // 移除样式元素
			const ignoreStyleDOM = document.querySelector("#ignoreStyle");
			ignoreStyleDOM && ignoreStyleDOM.remove(); // 移除忽略样式元素
			document.querySelector(currRenderDom ? currRenderDom : el).style = ""; // 恢复元素默认样式
			isElRectification && offelRectification(); // 如果正在对元素进行修正，则取消修正
		} catch (error) {
			console.error(`autofit: Failed to remove normally`, error); // 控制台输出错误信息
			this.isAutofitRunnig = false;
		}
		this.isAutofitRunnig && console.log(`autofit.js is off`); // 控制台输出信息
	},
};

// 元素修正方法
function elRectification(el, isKeepRatio = true, level = 1) {
	if (!autofit.isAutofitRunnig) {
		console.error("autofit.js: autofit has not been initialized yet"); // 控制台输出错误信息
	}
	!el && console.error(`autofit.js: bad selector: ${el}`); // 控制台输出错误信息
	currelRectification = el;
	currelRectificationLevel = level;
	currelRectificationIsKeepRatio = isKeepRatio;
	const currEl = document.querySelectorAll(el);
	if (currEl.length == 0) {
		console.error("autofit.js: elRectification found no element"); // 控制台输出错误信息
		return;
	}
	for (let item of currEl) {
		let rectification = currScale == 1 ? 1 : currScale * level;
		if (!isElRectification) {
			item.originalWidth = item.clientWidth;
			item.originalHeight = item.clientHeight;
		}
		if (isKeepRatio) {
			item.style.width = `${item.originalWidth * rectification}px`;
			item.style.height = `${item.originalHeight * rectification}px`;
		} else {
			item.style.width = `${100 * rectification}%`;
			item.style.height = `${100 * rectification}%`;
		}
		item.style.transform = `scale(${1 / currScale})`;
		item.style.transformOrigin = `0 0`;
	}
	isElRectification = true;
}

// 关闭元素修正方法
function offelRectification() {
	if (!currelRectification) return;
	for (let item of document.querySelectorAll(currelRectification)) {
		item.style.width = ``;
		item.style.height = ``;
		item.style.transform = ``;
	}
}

// 保持适配方法
function keepFit(dw, dh, dom, ignore, limit) {
	let clientHeight = document.documentElement.clientHeight;
	let clientWidth = document.documentElement.clientWidth;
	currScale = clientWidth / clientHeight < dw / dh ? clientWidth / dw : clientHeight / dh; // 计算缩放比例
	currScale = Math.abs(1 - currScale) > limit ? currScale.toFixed(2) : 1; // 判断是否超过限制值
	let height = Math.round(clientHeight / currScale);
	let width = Math.round(clientWidth / currScale);
	dom.style.height = `${height}px`;
	dom.style.width = `${width}px`;
	dom.style.transform = `scale(${currScale})`;
	const ignoreStyleDOM = document.querySelector("#ignoreStyle");
	ignoreStyleDOM.innerHTML = "";
	for (let item of ignore) {
		let itemEl = item.el || item.dom;
		typeof item == "string" && (itemEl = item);
		if (!itemEl) {
			console.error(`autofit: bad selector: ${itemEl}`); // 控制台输出错误信息
			continue;
		}
		let realScale = item.scale ? item.scale : 1 / currScale;
		let realFontSize = realScale != currScale ? item.fontSize : "autofit";
		let realWidth = realScale != currScale ? item.width : "autofit";
		let realHeight = realScale != currScale ? item.height : "autofit";
		let regex = new RegExp(`${itemEl}(\x20|{)`, "gm");
		let isIgnored = regex.test(ignoreStyleDOM.innerHTML);
		if (isIgnored) {
			continue;
		}
		ignoreStyleDOM.innerHTML += `\n${itemEl} {
      transform: scale(${realScale})!important;
      transform-origin: 0 0;
      width: ${realWidth}!important;
      height: ${realHeight}!important;
    }`;
		if (realFontSize) {
			ignoreStyleDOM.innerHTML += `\n${itemEl} div ,${itemEl} span,${itemEl} a,${itemEl} * {
        font-size: ${realFontSize}px;
      }`;
		}
	}
}
window.autofit = autofit
// 导出方法
// export { elRectification };
// export default autofit;