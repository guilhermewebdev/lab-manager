import apolloProvider from '@/plugins/apollo';
import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import store from './store';
import router from './router';
import vuetify from './plugins/vuetify';
import VueTheMask from 'vue-the-mask';

Vue.use(VueTheMask);
Vue.config.productionTip = false;

new Vue({
  apolloProvider,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
