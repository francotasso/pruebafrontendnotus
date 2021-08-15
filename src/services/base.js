import { BASE_URL } from './constants';

export const getRequest = (path) => {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}${path}`)
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const postRequest = (path, payload) => {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const putRequest = (path, payload) => {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}${path}/${payload.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteRequest = (path, id) => {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}${path}/${id}`, { method: 'DELETE' })
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
