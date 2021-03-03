// @ts-ignore
import storage from 'electron-json-storage';
import Task from '../models/task';
import { uuid } from 'uuidv4';

export async function get() {

  return new Promise((res, rej) =>{
    storage.get('Tasks', (err: any, data: Task[]) => {
      if(err) rej(err);
      res(data);
    });
  });
}

export async function set(data: any) {

  return new Promise((res, rej) =>{
    storage.set('Tasks', data, (err: any, ) => {
      if(err) rej(err);
      res(data);
    });
  });
}

export async function add(task: Task) {
  let mode_Task: any = await get();

  task.id = uuid();
  mode_Task[Object.keys(mode_Task).length] = task;

  return await set(mode_Task);
}

export async function update(task: Task) {
  let mode_Task: any = await get();

  for (let key in mode_Task) {
    if (mode_Task[key].id == task.id) {
      mode_Task[key] = task;
    }
  }

  return await set(mode_Task);
}

export async function remove(task: Task) {
  let mode_Task: any = await get();

  let removedTasks: Task[] = [];
  let count = 0;
  for (let key in mode_Task) {
    if (mode_Task[key].id != task.id) {
      removedTasks[count] = mode_Task[key];
      count++;
    }
  }

  return await set(removedTasks);
}



