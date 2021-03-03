const worker = require('./worker');
const Const = require('./const');
const tag = 'WORKER_AMAZON';

let taskMap = {};

let getTasksStatus = () => {
  return taskMap;
};


let closeBrowser = (browser) => {
  if (browser) {
    browser.close();
  }
};

let attachTask = async (data) => {
  let {
    id,
    productUrl,
    quantity,
    profile,
    proxy,
    account,
    settings,
    fnUpdateStatus
  } = data;

  const _updateStatus = (_id, status) => {
    console.log(tag, 'TASK_UPDATED:', _id, status);
    taskMap[_id].status = {
      title: status,
      color: status === 'Completed' ? 'blue' : status.includes('Error') || status.includes('Stopped') ? 'red' : status === 'Out of stock' ? 'yellow' : 'pink' // red, green, blue, pink, yellow
    };
    if (fnUpdateStatus) {
      fnUpdateStatus(_id, taskMap[_id].status);
    }
  };

  taskMap[id] = {
    bContinue: true,
    recaptchaToken: null,
    browser: null
  };

  _updateStatus(id, 'Checking product...');

  try {
    let { success, browser, page, selectedProxy, message, msg } = await worker.getBrowserAndPage(productUrl, proxy.data, id);
    if (taskMap[id].bContinue === false) {
      return;
    }
    if (!success || !browser || !page) {
      _updateStatus(id, msg);
      closeBrowser(browser);
      if (msg === 'Out of stock') {
        console.log(message, ` app will monitor the project every ${settings.retryTimeInMs / 1000} seconds.`);
        setTimeout(attachTask, settings.retryTimeInMs, data);
      } else {
        console.log('Fail to open the page', message);
      }
      return;
    }
    taskMap[id].browser = browser;

    _updateStatus(id, 'Adding to Cart...');
    let _res = await worker.addToCart(page, quantity);
    if (taskMap[id].bContinue === false) {
      return;
    }
    if (!_res.success) {
      console.log('Failed to add to cart', _res.message);
      _updateStatus(id, 'Cart Error');
      closeBrowser(browser);
      return;
    }

    _updateStatus(id, 'Signing in...');
    _res = await worker.signIn(page, account.email, account.password, _updateStatus, id);
    if (taskMap[id].bContinue === false) {
      return;
    }
    if (!_res.success) {
      console.log('Failed to sign in', _res.message);
      _updateStatus(id, _res.msg);
      closeBrowser(browser);
      return;
    }

    let { dynamicStatus } = _res;
    _updateStatus(id, 'Placing Order...');
    _res = await worker.placeOrder(page, dynamicStatus === true, profile);
    if (taskMap[id].bContinue === false) {
      return;
    }
    if (!_res.success) {
      console.log('Failed to place order', _res.message);
      _updateStatus(id, _res.msg);
      closeBrowser(browser);
    }

    _updateStatus(id, 'Completed');
    closeBrowser(browser);
  } catch (e) {
    console.log(tag, 'Exception:', e.message);
  }

};

let detachTask = (data) => {
  let { id, fnUpdateStatus } = data;
  if (taskMap[id]) {
    closeBrowser(taskMap[id].browser);

    taskMap[id] = {
      bContinue: false,
      browser: null,
      status: {
        title: 'Stopped by User',
        color: 'red'
      }
    };
  }
  fnUpdateStatus(id, { title: 'Stopped by User', color: 'red' });
};


module.exports = {
  getTasksStatus,
  attachTask,
  detachTask
};
