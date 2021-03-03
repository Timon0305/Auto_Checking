// @ts-ignore
import storage from 'electron-json-storage';

let user = {};

export function loadUserFromLocalStorage() {
  return new Promise((resolve) => {
    storage.get('userData', function(_error: any, data: { key?: any; }) {
      if (data.key) {
        console.log('userData', data);
        user = data;
      }
      resolve();
    });
  });
}

export function updateUserData(data: {}) {
  if (data) {
    user = data;
  }
}

export default function getUserData() {
  return user;
}

export function getUserFromLocalStorage() {
  return new Promise((resolve) => {
    storage.get('userData', function(err: any, data: any) {
      if (err) {
        console.log('Error', err.message);
      }
      if (data.key) {
        console.log('userData', data);
        resolve(data);
      } else {
        resolve({ 'message': 'authentication failed' });
      }

    });
  });
}
