import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/usuarios',
    name: 'Users',
    component: () => import('../views/Users.vue'),
  },
  {
    path: '/sucursales',
    name: 'Locations',
    component: () => import('../views/Locations.vue'),
  },
  {
    path: '/plantillas-de-turnos',
    name: 'TurnTemplates',
    component: () => import('../views/TurnTemplates.vue'),
  },
  {
    path: '/calendario',
    name: 'Calendar',
    component: () => import('../views/Calendar.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
