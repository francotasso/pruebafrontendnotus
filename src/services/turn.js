import { getRequest } from './base';

export const GetTurns = async () => {
  return getRequest('/turns');
};
