<template>
	<div id="app">
		<div class="filter">
			<select v-model="queryCol" queryCol="vaule">
				<option value="0">第1列</option>
				<option value="1">第2列</option>
				<option value="2">第3列</option>
				<option value="3">第4列</option>
				<option value="4">第5列</option>
				<option value="5">第6列</option>
				<option value="6">第7列</option>
				<option value="7">第8列</option>
				<option value="8">第9列</option>
				<option value="9">第10列</option>
			</select>
			<input type="text" v-model="queryText">
			<button @click="filter(queryCol,[queryText])">筛选</button>
			<button @click="cancelFilter">取消</button>
		</div>
		<div class="wraper">
			<myTable
				ref="table"
				v-model="tableDataHandled"
				start-edit-type="dblclick"
				:can-edit="canEdit"
				:columns="columns"
				:sort-index="0"
				selectable
				@on-success-save="handleSuccessEdit"
				@on-fail-save="handleFailEdit"
				@on-click-td="handleClickTd"
			></myTable>
		</div>
	</div>
</template>
<script>
export default {
  name: 'app',
	data () {
		return {
			tableData: [],
			columns: [],
			tableDataHandled: [], 
			scrollIndex: 1,
			canEdit: true,
			queryText: '',
			queryCol: 0,			
			editRow: 1,
			editCol: 1,
		};
	},
	watch: {
		tableDataHandled (res) {
		}
	},
	methods: {
		handleClickTd (params) {
		},
		clickEditBtn () {
			this.canEdit = !this.canEdit;
		},
		handleSuccessEdit ({ row, col, value, initRowIndex }) {
			console.log(`第${initRowIndex + 1}行第${initRowIndex + 1}列改为${value}`);
		},
		handleFailEdit (res) {
			console.log('取消编辑');
		},
		editCell () {
			this.$refs.table.editCell(this.editRow - 1, this.editCol - 1);
		},
		filter (col, queryArr) {
			this.$refs.table.filter(col, queryArr);
		},
		cancelFilter () {
			this.$refs.table.cancelFilter();
		},		
		changeData (rowLen) {
			let dataArr = [];
			for (let i = 0; i < rowLen; i++) {
				// for(let j = 0; j < this.columns.length; j++){					
					// arr.push(`${i+1}-${j+1}`)					
				// }
				let arr = [
					i + 1 + '-1',
					i + 1 + '-2',
					i + 1 + '-3',
					i + 1 + '-4',
					i + 1 + '-5',
					i + 1 + '-6',
					i + 1 + '-7',
					i + 1 + '-8',
					i + 1 + '-9',
					i + 1 + '-10'];
				
				dataArr.push(arr);
			}
			this.tableDataHandled = dataArr;
		},
	},
	mounted () {
		let headers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
		let columns = headers.map((title, col) => {
			return {
				title: title,
				align: 'center'
			};
		});
		this.columns = columns;
		this.changeData(100000);
	}
};
</script>

<style lang="less">
.filter{
	padding-top: 30px;
	padding-left: 40%;
}
.wraper{
  margin: 0px auto;
  padding: 40px;
  width: 1000px;
  height: 550px;
  overflow: auto;
}
.header-title-wraper{
	height: 100%;
	width: 100%;
	.mark-con{
		height: ~"calc(40% - 1px)";
		width: 100%;
		border-bottom: 1px solid #e9eaec;;
		text-align: center;
		line-height: 27px;
	}
	.title-con{
		height: 60%;
		width: 100%;
		text-align: center;
		line-height: 41px;
	}
}
.unormal-value{
	background: #FFA3A1 !important;
}
.unormal-row{
	background: #FFD8D3 !important;
}
.unormal-index{
	background: #FF4C5E !important;
	color: white;
	font-size: 14px;
	font-weight: 700;
	height: 100%;
	line-height: 48px;
}
</style>
