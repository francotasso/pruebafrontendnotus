import { GetLocations } from '../../services/location';

const state = {
  locations: null,
};

const mutations = {
  setLocations(state, newLocations) {
    state.locations = newLocations;
  },
};

const actions = {
  async GET_LOCATIONS({ state, commit }) {
    if (state.locations) return state.locations;
    const data = await GetLocations();
    commit('setLocations', data);
    return data;
  },
};

export const location = {
  namespaced: true,
  state,
  mutations,
  actions,
};
