import Api from './Api';

Api.defaults.headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
};

export const updateCredentials = (id, credentials) =>
  Api.patch(`/Users/${id}`, credentials);

export const getUserVideosSize = () => Api.get('/Users/size');
