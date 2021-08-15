import { getRequest } from './base';

export const GetTurnTemplates = async () => {
  return getRequest('/turnTemplates');
};
