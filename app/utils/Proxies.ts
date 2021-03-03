import storage from 'electron-json-storage';
import Proxies, { ProxyGroup } from '../models/proxy';
import { uuid } from 'uuidv4';

export async function get() {
  return new Promise((res, rej) => {
    storage.get('Proxies', (err: any, data: Proxies) => {
      if (err) rej(err);
      console.log(data);
      res(data);
    });
  });
}

export async function set(data: Proxies) {
  return new Promise((res, rej) => {
    storage.set('Proxies', data, async (err: any) => {
      if (err) rej(err);
      res(await get());
    });
  });
}

export async function add(proxyGroup: ProxyGroup) {
  let mode_Proxy: any = await get();

  proxyGroup.id = uuid();
  mode_Proxy[Object.keys(mode_Proxy).length] = proxyGroup;

  return await set(mode_Proxy);
}

export async function update(proxyGroup: ProxyGroup) {
  let mode_Proxy: any = await get();

  for (let key in mode_Proxy) {
    if (mode_Proxy[key].id == proxyGroup.id) {
      mode_Proxy[key] = proxyGroup;
    }
  }

  return await set(mode_Proxy);
}

export async function remove(proxyGroup: ProxyGroup) {
  let mode_Proxy: any = await get();

  let removedProxies: Proxies = {};
  let count = 0;
  for (let key in mode_Proxy) {
    if (mode_Proxy[key].id != proxyGroup.id) {
      removedProxies[count] = mode_Proxy[key];
      count++;
    }
  }

  return await set(removedProxies);
}

export default {
  get, set, add, update, remove
}
