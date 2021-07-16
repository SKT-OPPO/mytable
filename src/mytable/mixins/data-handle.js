import ItemTable from '../components/item-table.vue';
export default {
	data () {
		return {
			times0: 0, // 当前是第几轮
			times1: 0,
			times2: 0,
			table1Data: [],
			table2Data: [],
			table3Data: [],
			currentIndex: 0, // 当前展示的表格是第几个
			itemNum: 0, // 一块数据显示的数据条数
			timer: null,
			scrollLeft: 0,
			insideTableData: [],
			initTableData: [] // 初始表格数据，用于恢复搜索和筛选
		};
	},
	computed: {
		cellNum () { // 表格列数
			return this.columnsHandled.length;
		},
		columnsHandled () {
			let columns = [...this.columns];
			return columns;
		}
	},
  watch: {
    scrollTop (top) {
      this.currentIndex = parseInt((top % (this.moduleHeight * 3)) / this.moduleHeight);
      this.$nextTick(() => {
				this.setTopPlace();
			});
    }
  },
	methods: {
		getComputedTableDataIndex (colIndex) {
			return colIndex;
		},
		handleScroll (e) {
			const ele = e.srcElement || e.target;
			const { scrollTop, scrollLeft } = ele;
			this.scrollLeft = scrollLeft;
			this.scrollTop = scrollTop;
		},
		setTableData () {
			const count1 = this.times0 * this.itemNum * 3;
			this.table1Data = this.insideTableData.slice(count1, count1 + this.itemNum);
			const count2 = this.times1 * this.itemNum * 3;
			this.table2Data = this.insideTableData.slice(count2 + this.itemNum, count2 + this.itemNum * 2);
			const count3 = this.times2 * this.itemNum * 3;
			this.table3Data = this.insideTableData.slice(count3 + this.itemNum * 2, count3 + this.itemNum * 3);
		},
		getTables (h) {
			let table1 = this.getItemTable(h, this.table1Data, 1);
			let table2 = this.getItemTable(h, this.table2Data, 2);
			let table3 = this.getItemTable(h, this.table3Data, 3);
			if (this.currentIndex === 0) return [table1, table2, table3];
			else if (this.currentIndex === 1) return [table2, table3, table1];
      		else return [table3, table1, table2];
		},
		renderTable (h) {
			return h('div', {
				style: this.tableWidthStyles
			}, this.getTables(h));
		},
		getItemTable (h, data, index) {
			return h(ItemTable, {
				props: {
					times: this['times' + (index - 1)],
					tableIndex: index,
					itemData: data,
					itemNum: this.itemNum,
					rowStyles: this.rowStyles,
					widthArr: this.colWidthArr,
					columns: this.columnsHandled,
					canEdit: this.canEdit,
					edittingTd: this.edittingTd,
					startEditType: this.startEditType,
					editCellRender: this.editCellRender,
					beforeSave: this.beforeSave,
					canSelectText: this.canSelectText,
					startSelect: this.startSelect,
					endSelect: this.endSelect,
				},
				on: {
					'on-click-td': (params) => {
						this.$emit('on-click-td', params);
					},
					'on-edit-cell': (row, col) => {
						this.edittingTd = `${row}-${col}`;
					},
					'on-success-save': ({ row, col, value, initRowIndex }) => {
						let data = [...this.value];
						data[initRowIndex][col] = value;
						this.$emit('input', data);
						this.$emit('on-success-save', { row, col, value, initRowIndex });
						this.edittingTd = '';
					},
					'on-fail-save': ({ row, col, value, initRowIndex }) => {
						this.$emit('on-fail-save', { row, col, value, initRowIndex });
					},
					'on-cancel-edit': () => {
						this.edittingTd = '';
					}
				},
				key: 'table-item-key' + index,
				ref: 'itemTable' + index,
				attrs: {
					'data-index': index
				}
			});
		},
    // 给表格数据添加行号，用于排序后正确修改数据
    setIndex (tableData) {
      return tableData.map((item, i) => {
        let row = item;
        row.initRowIndex = i;
        return row;
      });
    }
	}
};
