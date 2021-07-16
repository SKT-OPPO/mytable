export const findNodeUpper = (ele, tag) => {
	if (ele.parentNode) {
		if (ele.parentNode.tagName === tag.toUpperCase()) {
			return ele.parentNode;
		} else {
			if (ele.parentNode) return findNodeUpper(ele.parentNode, tag);
			else return false;
		}
	}
};

export const getScrollbarWidth = () => {
	let oP = document.createElement('p');
	let styles = {
		width: '100px',
		height: '100px',
		overflowY: 'scroll'
	};
	for (let i in styles) {
		oP.style[i] = styles[i];
	}
	document.body.appendChild(oP);
	let scrollbarWidth = oP.offsetWidth - oP.clientWidth;
	oP.remove();
	return scrollbarWidth;
};


// 获取数组中第一个不为空的值
export const getFirstNotNullValue = (array, index) => {
	if (!(array && array.length)) return false;
	let r = -1;
	let rowLength = array.length;
	while (++r < rowLength) {
		let item = array[r][index];
		if (item || item === 0) return item;
	}
	return false;
};

const isChineseReg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
export const sortArr = (arr, index) => {
	if (arr.length <= 1) return;
	const firstNotNullValue = getFirstNotNullValue(arr, index);
	if (!firstNotNullValue && firstNotNullValue !== 0) return;
	if (!isChineseReg.test(firstNotNullValue)) {
		if (isNaN(Number(firstNotNullValue))) {
			// 非中文非数值
			arr.sort();
		} else {
			// 数值型
			arr.sort((a, b) => {
				return a[index] - b[index];
			});
		}
	} else {
		arr.sort((a, b) => {
			return a[index].localeCompare(b[index], 'zh');
		});
	}
};

// 倒序
export const sortDesArr = (arr, index) => {
	if (arr.length <= 1) return;
	const firstNotNullValue = getFirstNotNullValue(arr, index);
	if (!firstNotNullValue && firstNotNullValue !== 0) return;
	if (!isChineseReg.test(firstNotNullValue)) {
		if (isNaN(Number(firstNotNullValue))) {
			// 非中文非数值
			arr.sort().reverse();
		} else {
			// 数值型
			arr.sort((a, b) => {
				return b[index] - a[index];
			});
		}
	} else {
		arr.sort((a, b) => {
			return b[index].localeCompare(a[index], 'zh');
		});
	}
};

export const on = (ele, event, callback) => {
  ele.addEventListener(event, callback);
};

export const off = (ele, event, callback) => {
  ele.removeEventListener(event, callback);
};

export const hasOneOf = (str, targetArr) => {
	let len = targetArr.length;
	let i = -1;
	while (++i < len) {
		if (str.indexOf(targetArr[i]) >= 0) {
			return true;
		}
	}
	return false;
};


export const attr = (ele, attribution, value) => {
  if (value || value === 0) {
    ele.setAttribute(attribution, value);
  } else {
    return ele.getAttribute(attribution);
  }
}
