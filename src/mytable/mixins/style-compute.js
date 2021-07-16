import { getScrollbarWidth } from '../util';
export default {
	data () {
		return {
			wrapperHeight: 0,
			scrollTop: 0,
			moduleHeight: 0, 
			topPlaceholderHeight: 0, 
			tableWidth: 0,
			widthArr: [], // 用于给数据表格传递列宽
			totalRowHeight: 0, 
			canSelectText: true, 
			indexWidthInside: 0,
			outerWidth: 0, // 外面容器宽度
		};
	},
	computed: {
		wrapperClasses () {
			return [
				this.prefix,
				`${this.prefix}-fixed`
			];
		},
		headerStyle () {
			return {
				height: this.headerHeight + 'px',
			};
		},
		tableWidthStyles () {
			return {width: this.tableWidth + 'px'};
		},
		rowStyles () {
			return this.rowHeight !== undefined ? {height: `${this.rowHeight}px`} : {};
		},
		placeholderHeight () {
			return this.totalRowHeight - this.moduleHeight * 3; // 占位容器的总高度(上 + 下)
		},
		bottomPlaceholderHeight () {
			return (this.placeholderHeight - this.topPlaceholderHeight) < 0 ? 0 : this.placeholderHeight - this.topPlaceholderHeight;
		},
		itemRowHeight () {
			return this.rowHeight === undefined ? 50 : this.rowHeight;
		},
		colWidthArr () {
			let len = this.cellNum;
			let colWidthArr = [];
			if (this.fixedWrapperWidth) {
				let width = this.outerWidth;
				let num = this.cellNum;
				let i = -1;
				let itemColWidth = width / num;
				while (++i < num) {
					colWidthArr.push(itemColWidth);
				}
			}
			return colWidthArr;
		},
	},
	methods: {
		_tableResize () {
			this.$nextTick(() => {
				this.updateHeight();
				this.setComputedProps();
				let scrollBarWidth = this.totalRowHeight > this.wrapperHeight ? getScrollbarWidth() : 0;
				this.outerWidth = this.$refs.outer.offsetWidth - 2 - scrollBarWidth;
				let width = this.colWidth * this.columns.length + (this.showIndex ? this.indexWidthInside : 0);
				this.tableWidth = this.fixedWrapperWidth ? this.outerWidth : (width > this.outerWidth ? width : this.outerWidth);
				if (width < this.outerWidth) this._setColWidthArr();
				this.widthArr = this.colWidthArr;
			});
		},
		updateHeight () {
			this.$nextTick(() => {
				let wrapperHeight = this.$refs.outer.offsetHeight;
				this.itemNum = Math.ceil((wrapperHeight - this.headerHeight) / this.itemRowHeight) + this.appendNum;
				this.moduleHeight = this.itemNum * this.itemRowHeight;
				this.wrapperHeight = wrapperHeight;
				this.setTopPlace();
			});
		},
		setComputedProps () {
			const len = this.insideTableData.length;
			this.totalRowHeight = len * this.itemRowHeight;
		},
		setTopPlace () {
			let scrollTop = this.scrollTop;
			let t0 = 0;
			let t1 = 0;
			let t2 = 0;
			if (scrollTop > this.moduleHeight) {
				switch (this.currentIndex) {
					case 0: t0 = parseInt(scrollTop / (this.moduleHeight * 3)); t1 = t2 = t0; break;
					case 1: t1 = parseInt((scrollTop - this.moduleHeight) / (this.moduleHeight * 3)); t0 = t1 + 1; t2 = t1; break;
					case 2: t2 = parseInt((scrollTop - this.moduleHeight * 2) / (this.moduleHeight * 3)); t0 = t1 = t2 + 1;
				}
			}
			this.times0 = t0;
			this.times1 = t1;
			this.times2 = t2;
			this.topPlaceholderHeight = parseInt(scrollTop / this.moduleHeight) * this.moduleHeight;
			this.setTableData();
		}
	}
};
