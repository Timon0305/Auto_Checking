// @ts-ignore
import storage from 'electron-json-storage';
import Account from '../models/account';
import { uuid } from 'uuidv4';

export async function get() {
  return new Promise((res, rej) => {
    storage.get('Accounts', (err: any, data: Account[]) => {
      if (err) rej(err);
      res(data);
    });
  });
}

export async function set(data: Account[]) {
  return new Promise((res, rej) => {
    storage.set('Accounts', data, (err: any) => {
      if (err) rej(err);
      res(data);
    });
  });
}

export async function add(account: Account) {
  let mode_Account: any = await get();

  account.id = uuid();
  mode_Account[Object.keys(mode_Account).length] = account;
  return await set(mode_Account);
}

export async function update(account: Account) {
  let mode_Account: any = await get();

  for (let key in mode_Account) {
    if (mode_Account[key].id == account.id) {
      mode_Account[key] = account;
    }
  }

  return await set(mode_Account);
}

export async function remove(account: Account) {
  let mode_Account: any = await get();

  let removedAccounts: Account[] = [];
  let count = 0;
  for (let key in mode_Account) {
    if (mode_Account[key].id != account.id) {
      removedAccounts[count] = mode_Account[key];
      count++;
    }
  }

  return await set(removedAccounts);
}

export default {
  get, set, add, update, remove
}
