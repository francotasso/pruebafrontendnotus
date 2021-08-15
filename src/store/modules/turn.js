import { GetTurns } from '../../services/turn';

const state = {
  turnList: null,
};

const mutations = {
  setTurns(state, newTurns) {
    state.turnList = newTurns;
  },
};

const actions = {
  async GET_TURNS({ state, commit }) {
    if (state.turnList) return state.turnList;
    const data = await GetTurns();
    commit('setTurns', data);
    return data;
  },
};

export const turn = {
  namespaced: true,
  state,
  mutations,
  actions,
};
