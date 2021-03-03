const worker = require('./worker');
const Const = require('./const');
const Captcha = require('2captcha');
const tag = 'WORKER_GAMENERDZ';

let taskMap = {};

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
    console.log('TASK_UPDATED:', id, status);
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
    browser: null,
    recaptchaToken: null
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

    // get recaptcha token while the procedures are pending...
    setTimeout(__getRecaptchaToken, 100, id, settings['2captchaToken'], selectedProxy);

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
    _res = await worker.signIn(page, account.email, account.password);
    if (taskMap[id].bContinue === false) {
      return;
    }
    if (!_res.success) {
      console.log('Failed to sign in', _res.message);
      _updateStatus(id, 'Credential Error');
      closeBrowser(browser);
      return;
    }

    _updateStatus(id, 'Shipping...');
    _res = await worker.shipping(page, profile.shipping);
    if (taskMap[id].bContinue === false) {
      return;
    }
    if (!_res.success) {
      console.log('Failed to fill shipping', _res.message);
      _updateStatus(id, 'Shipping Error');
      closeBrowser(browser);
      return;
    }

    _updateStatus(id, 'Billing...');
    _res = await worker.billing(page, profile.billing);
    if (taskMap[id].bContinue === false) {
      return;
    }
    if (!_res.success) {
      console.log('Failed to fill billing', _res.message);
      _updateStatus(id, 'Billing Error');
      closeBrowser(browser);
      return;
    }

    _updateStatus(id, 'Solving Recaptcha...');
    let delayTime = 0;
    while (taskMap[id].recaptchaToken === null) {
      await __delayInMs(1000);
      console.log('waiting 2captcha response: ', delayTime++);
      if (taskMap[id].bContinue === false) {
        return;
      }
    }

    _res = await worker.solveRecaptcha(page, { recaptchaToken: taskMap[id].recaptchaToken });
    if (taskMap[id].bContinue === false) {
      return;
    }
    if (!_res.success) {
      console.log('Failed to solve recaptcha', _res.message);
      _updateStatus(id, 'Recaptcha Error');
      closeBrowser(browser);
      return;
    }

    _updateStatus(id, 'Placing Order...');
    _res = await worker.makePayment(page, profile.ccInfo);
    if (taskMap[id].bContinue === false) {
      return;
    }
    if (!_res.success) {
      console.log('Failed to place order', _res.message);
      _updateStatus(id, '2Captcha token Error');
      closeBrowser(browser);
      return;
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

let getTasksStatus = () => {
  return taskMap;
};

let __getRecaptchaToken = async (taskId, apiKey, proxy) => {
  const solver = new Captcha.Solver(apiKey);

  let option = {
    invisible: true,
    'data-s': '',
    cookies: '',
    userAgent: Const.Browser.UserAgents[0],
    header_acao: true,
    pingback: ''
    // soft_id: 0,
  };

  if (Const.ProxySetting.enabled) {
    option = {
      ...option, ...{
        proxy: `${proxy.username}:${proxy.password}` + proxy.host ? `@${proxy.host}:${proxy.port}` : '',
        proxytype: 'http'
      }
    };
  }

  let _res = await solver.recaptcha(Const.Recaptcha.siteKey, Const.Target.CheckOut, option);
  if (taskMap[taskId].bContinue) {
    taskMap[taskId].recaptchaToken = _res.data;
  }
};

let __delayInMs = async (duration) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, duration);
  });
};

module.exports = {
  attachTask,
  detachTask,
  getTasksStatus
};
