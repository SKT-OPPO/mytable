import myTable from './mytable.vue';
const install = (Vue, opts = {}) => {
  Vue.component('myTable', myTable);
};
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
export default Object.assign(myTable, {install});
