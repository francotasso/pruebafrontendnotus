import { GetContracts } from '../../services/contract';

const state = {
  contracts: null,
};

const mutations = {
  setContracts(state, newContracts) {
    state.contracts = newContracts;
  },
};

const actions = {
  async GET_CONTRACTS({ state, commit }) {
    if (state.contracts) return state.contracts;
    const data = await GetContracts();
    commit('setContracts', data);
    return data;
  },
};

export const contract = {
  namespaced: true,
  state,
  mutations,
  actions,
};
