import {
  GetUsers,
  CreateUser,
  EditUserById,
  RemoveUserById,
} from '../../services/user';

const state = {
  userList: null,
};

const mutations = {
  setUsers(state, newUserList) {
    state.userList = newUserList;
  },
};

const actions = {
  async GET_USERS({ state, commit }) {
    if (state.userList) return state.userList;
    const data = await GetUsers();
    commit('setUsers', data);
    return data;
  },
  async CREATE_USER({ state, commit }, payload) {
    await CreateUser(payload);
    const newUserList = state.userList;
    newUserList.push(payload);
    commit('setUsers', newUserList);
  },
  async EDIT_USER({ state, commit }, payload) {
    await EditUserById(payload);
    const index = state.userList.findIndex((user) => user.id === payload.id);
    const newUserList = [...state.userList];
    newUserList[index] = payload;
    commit('setUsers', newUserList);
  },
  async REMOVE_USER({ state, commit }, id) {
    await RemoveUserById(id);
    const newUsers = state.userList.filter((user) => user.id !== id);
    commit('setUsers', newUsers);
  },
};

export const user = {
  namespaced: true,
  state,
  mutations,
  actions,
};
