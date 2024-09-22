import { createApp } from 'vue';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';

import * as echarts from 'echarts';
import Swal from 'sweetalert2';
import VueDrawingCanvas from 'vue-drawing-canvas';

import App from './App.vue';

import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'primeflex/themes/primeone-dark.css';
import './style.css';

window.Swal = Swal;
window.echarts = echarts;

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: definePreset(Aura, {
      semantic: {
        primary: {
          50: '{sky.50}',
          100: '{sky.100}',
          200: '{sky.200}',
          300: '{sky.300}',
          400: '{sky.400}',
          500: '{sky.500}',
          600: '{sky.600}',
          700: '{sky.700}',
          800: '{sky.800}',
          900: '{sky.900}',
          950: '{sky.950}',
        },
      },
    }),
  },
});

app.component('VueDrawingCanvas', VueDrawingCanvas);

app.mount('#app');
