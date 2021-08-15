import { GetPositions } from '../../services/position';

const state = {
  positions: null,
};

const mutations = {
  setPositions(state, newPositions) {
    state.positions = newPositions;
  },
};

const actions = {
  async GET_POSITIONS({ state, commit }) {
    if (state.positions) return state.positions;
    const data = await GetPositions();
    commit('setPositions', data);
    return data;
  },
};

export const position = {
  namespaced: true,
  state,
  mutations,
  actions,
};
