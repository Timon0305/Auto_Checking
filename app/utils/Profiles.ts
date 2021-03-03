//@ts-ignore-next-line
import storage from 'electron-json-storage';
import Profile from '../models/profile';
import { uuid } from 'uuidv4';

export async function get() {
  return new Promise((res, rej) => {
    storage.get('Profiles', (err: any, data: Profile[]) => {
      if (err) rej(err);
      console.log(data);
      res(data);
    });
  });
}

export async function set(data: any) {
  return new Promise((res, rej) => {
    storage.set('Profiles', data, (err: any) => {
      if (err) rej(err);
      res(data);
    });
  });
}

export async function add(profile: Profile) {
  let mode_Profile: any = await get();

  profile.id = uuid();
  mode_Profile[Object.keys(mode_Profile).length] = profile;

  return await set(mode_Profile);
}

export async function update(profile: Profile) {
  let mode_Profile: any = await get();

  for (let key in mode_Profile) {
    if (mode_Profile[key].id == profile.id) {
      mode_Profile[key] = profile;
    }
  }

  return await set(mode_Profile);
}

export async function remove(profile: Profile) {
  let mode_Profile: any = await get();

  let removedProfiles: Profile[] = [];
  let count = 0;
  for (let key in mode_Profile) {
    if (mode_Profile[key].id != profile.id) {
      removedProfiles[count] = mode_Profile[key];
      count++;
    }
  }

  return await set(removedProfiles);
}

export default {
  get, set, add, update, remove
};
