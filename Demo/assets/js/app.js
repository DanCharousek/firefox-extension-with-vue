import Vue from 'vue';
import App from './components/app';

const app = new Vue({
    el: '#my-app',
    components: {
        App
    },
    render(h) {
        return h('app');
    }
});