import { getRequest } from './base';

export const GetPositions = async () => {
  return getRequest('/positions');
};
