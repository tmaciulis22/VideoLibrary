import Api from './Api';

Api.defaults.headers = {
  'Content-Type': 'application/json',
};

export const register = (data) => Api.post('/users/register', data);

export const verify = (id) =>
  Api.post('/users/verify', null, { params: { id } });

export const authenticate = (email, password) =>
  Api.post('/users/authentication', null, { params: { email, password } });

export const sendForgotPasswordEmail = (email) =>
  Api.post('/users/forgot-password', null, { params: { email } });

export const getCurrentUser = (token) =>
  Api.get('/users/current', { headers: { Authorization: `Bearer ${token}` } });

export const resetPassword = (token, newPassword) =>
  Api.patch('/users/reset-password', null, {
    params: { newPassword },
    headers: { Authorization: `Bearer ${token}` },
  });
