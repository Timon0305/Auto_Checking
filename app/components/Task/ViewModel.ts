import { useState, useEffect } from 'react';
import Profile from '../../models/profile';
import { ProxyGroup } from '../../models/proxy';
import ProfileUtil from '../../utils/Profiles';
import ProxyUtil from '../../utils/Proxies';
import SettingUtil from '../../utils/Settings';
import AccountUtil from '../../utils/Accounts';
import { get, set, add, update, remove } from '../../utils/Tasks';
import { ipcRenderer } from 'electron';
import { toast } from 'react-toastify';

const CHANNELS = require('../../constants/channels.json');

const initialTasks: any[] = [];
const initialTask: any = {
  id: null,
  name: '',
  productUrl: '',
  quantity: 1,
  count: 1,
  profileId: '-1',
  proxyId: '-1',
  accountId: '-1'
};
const initialProfiles: Profile[] = [];
const initialProxies: ProxyGroup[] = [];
const initialAccounts: any[] = [];
const initialSettings: any = {};

const ViewModel = () => {
  // console.log('props', props);

  const [visibleAddModal, setVisibleAddModal] = useState(false);

  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState(initialTask);
  const [profiles, setProfiles] = useState(initialProfiles);
  const [proxies, setProxies] = useState(initialProxies);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [settings, setSettings] = useState(initialSettings);
  const [keyword, setKeyword] = useState('');

  const _loadProfile = async () => {
    const profiles: any = await ProfileUtil.get();
    let data: any[] = [];
    Object.keys(profiles).map((key: any) => {
      // @ts-ignore
      data.push(profiles[key]);
    });
    setProfiles(data);
  };

  const _loadProxy = async () => {
    let proxies: any = await ProxyUtil.get();
    let data: any[] = [];
    Object.keys(proxies).map((key: any) => {
      // @ts-ignore
      data.push(proxies[key]);
    });
    setProxies(data);
  };

  const _loadSettings = async () => {
    let data: any = await SettingUtil.get();
    if (data && Object.keys(data).length > 0) {
      setSettings(data);
    }
  };

  const _loadAccount = async () => {
    const _accounts: any = await AccountUtil.get();
    console.log('accounts', _accounts);
    let data: any[] = [];
    Object.keys(_accounts).map((key: any) => {
      // @ts-ignore
      data.push(_accounts[key]);
    });
    setAccounts(data);
  };

  const _loadTask = async () => {
    const _tasks: any = await get();
    console.log(_tasks);
    let data: any[] = [];
    Object.keys(_tasks).map((key: any) => {
      // @ts-ignore
      data.push(_tasks[key]);
    });

    // get pending tasks status
    const taskStatusMap = ipcRenderer.sendSync(CHANNELS.SUBSCRIBE_TASKS_STATUS, {});
    console.log('pending-tasks', taskStatusMap);

    for (let item of data) {
      if (taskStatusMap[item.id] != null) {
        item.status = taskStatusMap[item.id].status;
      } else {
        item.status = {
          title: 'Ready',
          color: 'green'
        };
      }
    }
    setTasks(data);
  };

  const initData = async () => {
    await _loadProfile();
    await _loadProxy();
    await _loadSettings();
    await _loadAccount();
    await _loadTask();
  };

  useEffect(() => {
    initData();
  }, []);

  // Search task
  const filterTasks = (_keyword: string) => {
    _keyword = _keyword.toLowerCase();
    if (_keyword && _keyword.length > 0) {
      return tasks.filter(
        (e: any) =>
          e.name.toLowerCase().includes(_keyword)
          || e.account.name.toLowerCase().includes(_keyword)
          || e.productUrl.toLowerCase().includes(_keyword)
          || e.profile.name.toLowerCase().includes(_keyword)
          || e.proxy.name.toLowerCase().includes(_keyword)
          || e.status.title.toLowerCase().includes(_keyword)
      );
    }
    return tasks;
  };

  const handleCreate = () => {
    setActiveTask(initialTask);
    setVisibleAddModal(true);
  };

  const createTask = async (payload: any) => {
    const { name, accountId, productUrl, profileId, proxyId, quantity, count } = payload;

    const account = accounts.find((e: any) => e.id == accountId);
    const profile = profiles.find((e: any) => e.id == profileId);
    const proxy = proxies.find((e: any) => e.id == proxyId);

    let newTask: any = {
      name,
      productUrl,
      quantity,
      account,
      profile,
      proxy
    };

    for (let i = 0; i < count; i++) {
      await add(newTask);
    }

    await _loadTask();
    setVisibleAddModal(false);
  };

  // Delete a task
  const deleteTask = async (task: any) => {
    await remove(task);
    await _loadTask();
  };

  // Delete all task
  const deleteAllTasks = async () => {
    console.log('deleteAll-disabled');
    return;
    await set({});
    await _loadTask();
  };

  // Start a task
  const startTask = (task: any) => {
    if (!settings || !settings['2captchaToken'] || !settings['2captchaToken'].length) {
      alert('Please set 2captcha api key in Settings page.');
      return;
    }
    if (!task.account || !task.account.email || !task.account.password) {
      alert('Please set the Site credential in Account page.');
      return;
    }

    task.settings = settings;
    console.log('start-req:', task.id);
    const resp: any = ipcRenderer.sendSync(CHANNELS.START_TASK, { task });
    console.log('start-res:', resp);
    toast.dark(resp.message, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  };

  // Start all tasks running
  const startAllTasks = () => {
    console.log('startAll');
  };

  //Stop a task
  const stopTask = (task: any) => {
    console.log('stop-req:', task);
    const resp: any = ipcRenderer.send(CHANNELS.STOP_TASK, { task });
    console.log('stop-res:', resp);
    toast.dark(resp.message, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
  };

  // Stop all tasks running
  const stopAllTasks = () => {
    console.log('stopAll');
  };

  // Receive Task status from Main
  const receiveTaskStatus = (event: any, args: any) => {
    console.log('receive-status', event, args);
    const { taskId, status } = args;
    let _tasks = tasks.slice(0);
    _tasks.map((item: any) => {
      if (item.id == taskId) {
        item.status = status;
      }
    });
    setTasks(_tasks);
  };

  ipcRenderer.removeAllListeners(CHANNELS.NOTIFY_TASK_STATUS);
  ipcRenderer.on(CHANNELS.NOTIFY_TASK_STATUS, receiveTaskStatus);

  // Edit task
  const handleEdit = (task: any) => {
    setActiveTask(task);
    setVisibleAddModal(true);
  };

  const updateTask = async (task: any) => {
    const { name, accountId, productUrl, profileId, proxyId, quantity } = task;

    const account = accounts.find((e: any) => e.id == accountId);
    const profile = profiles.find((e: any) => e.id == profileId);
    const proxy = proxies.find((e: any) => e.id == proxyId);

    let newTask: any = {
      id: activeTask.id,
      name,
      productUrl,
      quantity,
      account,
      profile,
      proxy
    };

    await update(newTask);
    await _loadTask();
    setVisibleAddModal(false);
  };

  return {
    tasks,
    activeTask,
    profiles,
    proxies,
    accounts,
    settings,
    visibleAddModal, setVisibleAddModal,
    keyword, setKeyword,
    filterTasks,
    handleCreate,
    createTask,
    deleteTask,
    deleteAllTasks,
    startTask,
    startAllTasks,
    stopTask,
    stopAllTasks,
    handleEdit,
    updateTask
  };
};
export default ViewModel;
