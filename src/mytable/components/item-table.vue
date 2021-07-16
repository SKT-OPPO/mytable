<template>
	<div class="mytable-item-table">
		<table v-show="showTable" ref="itemTable" class="mytable-data-table mytable-content-table" cellspacing="0" cellpadding="0" border="0" width="100%">
			<colgroup>
				<col
					:width="width" v-for="(width, i) in widthArr"
					:key="'colgroup-' + i">
			</colgroup>
			<tbody>
				<tr v-for="(tr, index) in itemData"
					:key="index">
					<td v-for="(td, i) in tr"
						:data-row="indexBase + index"
						:data-col="i"
						@click="handleClickTd(indexBase + index, i)"
						@dblclick="handleDblclickTd(indexBase + index, i, typeof td === 'object' ? td.value : td)"
						:class="['mytable-cell', setAlign(i), typeof td === 'object' ? td.className : '', getSelectCellClasses(indexBase + index, i)]"
						:style="rowStyles"
						:key="i">
						<template v-if="!canEdit || (canEdit && `${indexBase + index}-${i}` !== edittingTd)">
							<div v-if="(!showCellRender[i])" class="mytable-cell">{{ typeof td === 'object' ? td.value : td }}</div>
							<template v-else>
								<render-dom :render="showCellRender[i]" :back-value="{row: indexBase + index, col: i}"></render-dom>
							</template>
						</template>
						<render-dom v-else :render="editCellRender" :back-value="{row: indexBase + index, col: i, value: typeof td === 'object' ? td.value : td, beforeSave, initRowIndex: tr.initRowIndex}"></render-dom>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script>
import renderDom from './renderDom';
export default {
	name: 'ItemTable',
	components: {
		renderDom
	},
	data () {
		return {
			prefix: 'mytable-data-table',
			tableWidth: 0,
			currentMouseEnterIndex: -1,
			editInputValue: ''
		};
	},
	props: {
		times: Number,
		tableIndex: Number,
		itemData: Array,
		rowStyles: Object,
		widthArr: Array,
		columns: Array,
		itemNum: Number,
		canEdit: Boolean,
		edittingTd: String,
		startEditType: String,
		editCellRender: Function,
		beforeSave: Function,
		canSelectText: Boolean,
		startSelect: Object,
		endSelect: Object,
	},
	computed: {
		showTable () {
			return this.itemData.length > 0;
		},
		indexBase () {
			return this.times * this.itemNum * 3 + this.itemNum * (this.tableIndex - 1);
		},
		showCellRender () {
			return this.columns.map(item => {
				return item.cellRender ? item.cellRender : undefined;
			});
		}
	},
	methods: {
		setAlign (i) {
			let columns = this.columns[i];
			if (!columns) return;
			let col = columns;
			return this.prefix + '-' + col.align;
		},
		backValue (row, col) {
			return {
				row: row,
				col: col
			};
		},
		handleClickTd (row, col) {
			this.$emit('on-click-td', { row, col });
		},
		editCell (row, col) {
			this.$emit('on-edit-cell', row, col);
		},
		handleDblclickTd (row, col, value) {
			this.editInputValue = value;
			if (this.canEdit && this.startEditType === 'dblclick') this.editCell(row, col);
		},
		getSelectCellClasses (row, col) {
			let startSelect = this.startSelect;
			let endSelect = this.endSelect;
			let startRow = parseInt(startSelect['row']);
			let endRow = parseInt(endSelect['row']);
			let startCol = parseInt(startSelect['col']);
			return [
				((startRow === row) && startCol === col) ? 'start-select-cell' : '',
				((endRow === row) && endSelect['col'] === col) ? 'end-select-cell' : '',
			];
		}
	}
};
</script>
