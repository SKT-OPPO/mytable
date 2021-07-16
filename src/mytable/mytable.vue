<template>
	<div class="mytable-outer" ref="outer" @scroll="scrollFn">
		<div :class="wrapperClasses" :style="tableWidthStyles">
			<div class="mytable-wrapper" ref="outWrapper">
				<div :class="['mytable-header-wrapper','header-wrapper-fixed']" :style="headerStyle">
					<table ref="headerTable" style="position: absolute;left: 0;top: 0;" cellspacing="0" cellpadding="0" border="0" width="100%">
						<colgroup>
							<col :width="width" v-for="(width, i) in widthArr" :key="'header-key-' + i" />
						</colgroup>
						<tr>
							<th v-for="(col, i) in columnsHandled" :data-index="i" :key="`table-title-${i}`">
								<span v-if="!col.render">
									{{ col.title }}
									<sort-button v-if="showSortBtn(i)" :col-index="i" @on-sort="handleSort" @on-cancel-sort="handleCancelSort">
									</sort-button>
								</span>
								<render-dom v-else :back-value="getComputedTableDataIndex(i)"></render-dom>
							</th>
						</tr>
					</table>
				</div>
				<div class="mytable-content" @mousedown="handleMousedownOnTable">
					<div :style="{height: `${topPlaceholderHeight}px`}"></div>
					<render-dom :render="renderTable" ></render-dom>
					<div :style="{height: `${bottomPlaceholderHeight}px`}"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import throttle from 'lodash/throttle'
import renderDom from './components/renderDom';
import sortButton from './components/sort-button';
import editRender from './components/input-render';
import mixins from './mixins';
export default {
	name: 'myTable',
	components: {
		renderDom,
		sortButton
	},
	mixins: [ ...mixins ],
	//设置节流
	created(){
		this.scrollFn = throttle(this.handleScroll,50,{leading:false})
	},
	props: {
		/**
		 * @description 表头数组
		 */
		columns: {
			type: Array
		},
		/**
		 * @description 列宽
		 */
		colWidth: {
			type: Number,
			default: 120
		},
		/**
		 * @description 表头高度
		 */
		headerHeight: {
			type: Number,
			default: 50
		},
		/**
		 * @description 表头tr行的样式
		 */
		headerTrStyle: {
			type: Object,
			default: () => {
				return {};
			}
		},		
		/**
		 * @description 表格数据二维数组
		 */
		value: {
			type: Array
		},
		/**
		 * @description 表格行高
		 */
		rowHeight: {
			type: Number,
			default: 50
		},
		/**
		 * @description 设为true后表格列宽总是平分容器宽度
		 */
		fixedWrapperWidth: {
			type: Boolean,
			default: false
		},
		/**
		 * @description 额外渲染的行数
		 */
		appendNum: {
			type: Number,
			default: 10
		},
		/**
		 * @description 当前是否可编辑
		 */
		canEdit: {
			type: Boolean,
			default: false
		},
		/**
		 * @description 触发编辑单元格的方式
		 */
		startEditType: {
			type: String,
			default: 'dblclick'
		},
		/**
		 * @description 编辑单元格所渲染元素的render函数
		 */
		editCellRender: {
			type: Function,
			default: editRender
		},
		/**
		 * @description 保存修改的单元格内容之前
		 */
		beforeSave: {
			type: Function,
			default: () => {
				return true;
			}
		},
		/**
		 * @description 是否可选择单元格
		 */
		selectable: {
			type: Boolean,
			default: false
		},
		/**
		 * @description 是否可排序
		 */
		sortable: {
			type: Boolean,
			default: false
		},
		/**
		 * @description 开启排序的列序号数组或序号
		 */
		sortIndex: [Array, Number],
	},
	data () {
		return {
			prefix: 'mytable'
		};
	},
	methods: {
		// 涉及到表格容器尺寸变化或数据变化的情况调用此方法重新计算相关值
		resize () {
			this._tableResize();
		},
		// 获取表格横向滚动的距离
		getScrollLeft () {
			return this.$refs.outer.scrollLeft;
		},
		editCell (row, col) {
			this._editCell(row, col);
		},
		filter (col, queryArr) {
			this._filter(col, queryArr);
		},
		/**
		 * @description 取消筛选
		 */
		cancelFilter () {
			this._cancelFilter();
		},		
	},
	watch: {
		value (val) {
			this.$nextTick(() => {
				this.insideTableData = this.setIndex(this.value);
				this.initSort();
			});
		},
		insideTableData () {
			this.resize();
		},
	},
	mounted () {
		this.$nextTick(() => {
			this.insideTableData = this.setIndex(this.value);
			this.resize();
		});
	}
};
</script>
<style lang="less">
	@import './styles/mytable.less';
</style>
