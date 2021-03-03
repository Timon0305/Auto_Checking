// @ts-ignore
import storage from 'electron-json-storage';
import Settings from '../models/settings';

export async function get() {
  return new Promise((res, rej) => {
    storage.get('Settings', (err: any, data: Settings) => {
      if (err) rej(err);
      console.log(data);
      res(data);
    });
  });
}

export async function set(data: Settings) {
  return new Promise((res, rej) => {
    storage.set('Settings', data, (err: any) => {
      if (err) rej(err);
      res(data);
    });
  });
}

export default {
  get, set
}
