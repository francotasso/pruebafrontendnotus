import { getRequest, postRequest, putRequest, deleteRequest } from './base';

export const GetUsers = () => {
  return getRequest('/users');
};

export const CreateUser = (payload) => {
  return postRequest('/users', payload);
};

export const EditUserById = (payload) => {
  return putRequest('/users', payload);
};

export const RemoveUserById = (id) => {
  return deleteRequest('/users', id);
};
