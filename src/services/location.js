import { getRequest } from './base';

export const GetLocations = async () => {
  return getRequest('/locations');
};
