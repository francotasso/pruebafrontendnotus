import { getRequest } from './base';

export const GetContracts = async () => {
  return getRequest('/contracts');
};
