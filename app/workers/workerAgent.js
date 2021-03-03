const GameNerdzWorker = require('./gamenerdz');
const AmazonWorker = require('./amazon');

const WorkerMap = {
  Gamenerdz: GameNerdzWorker,
  Amazon: AmazonWorker
};


let getTasksStatus = () => {
  const map1 = GameNerdzWorker.getTasksStatus();
  const map2 = AmazonWorker.getTasksStatus();
  return {
    ...map1,
    ...map2
  };
};

let attachTask = (task) => {
  let {
    id,
    account,
    fnUpdateStatus
  } = task;

  const currentTaskMap = getTasksStatus();
  if (currentTaskMap[task.id] && (currentTaskMap[id].status.title !== 'Completed' && currentTaskMap[id].status.title !== 'Stopped by User' && !currentTaskMap[id].status.title.includes('Error'))) {
    return { success: false, message: 'Task is already running' };
  }

  fnUpdateStatus(id, { title: 'Starting...', color: 'blue' });

  if (WorkerMap[account.name]) {
    WorkerMap[account.name].attachTask(task);
    return { success: true, message: 'Successfully started' };
  } else {
    fnUpdateStatus(id, { title: 'Site Error', color: 'red' });
    return { success: false, message: 'Task is not available' };
  }
};

let detachTask = (task) => {
  const { id, account, fnUpdateStatus } = task;

  const currentTaskMap = getTasksStatus();
  if (!currentTaskMap[id]) {
    return { success: false, message: 'Task is not running' };
  }

  fnUpdateStatus(id, { title: 'Stopping...', color: 'yellow' });

  if (WorkerMap[account.name]) {
    WorkerMap[account.name].detachTask(task);
    return { success: true, message: 'Stopped'}
  } else {
    fnUpdateStatus(id, { title: 'Site Error', color: 'red' });
    return { success: false, message: 'Task is not available' };
  }
};


module.exports = {
  getTasksStatus,
  attachTask,
  detachTask
};
