import Vue from 'vue';
import Vuex from 'vuex';

import { contract } from './modules/contract';
import { location } from './modules/location';
import { position } from './modules/position';
import { turn } from './modules/turn';
import { turnTemplate } from './modules/turnTemplate';
import { user } from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    contract,
    location,
    position,
    turn,
    turnTemplate,
    user,
  },
});
