import { GetTurnTemplates } from '../../services/turnTemplate';

const state = {
  turnTemplateList: null,
};

const mutations = {
  setTurnTemplates(state, newTurnTemplates) {
    state.userList = newTurnTemplates;
  },
};

const actions = {
  async GET_TURN_TEMPLATES({ state, commit }) {
    if (state.turnTemplateList) return state.turnTemplateList;
    const data = await GetTurnTemplates();
    commit('setTurnTemplates', data);
    return data;
  },
};

export const turnTemplate = {
  namespaced: true,
  state,
  mutations,
  actions,
};
