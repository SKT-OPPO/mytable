import Vue from 'vue';
import App from './App.vue';
import myTable from './mytable';

Vue.use(myTable);

new Vue({
  el: '#app',
  render: h => h(App)
});
