const puppeteer = require('puppeteer');
const ChromePaths = require('chrome-paths');
const Const = require('./const');
const { shuffle } = require('../util');
const tag = 'WORKER_AMAZON_WORKER';

let getBrowserAndPage = async (productUrl, proxyUrls) => {
  return new Promise(async resolve => {
    proxyUrls = shuffle(proxyUrls);
    for (let proxyUrl of proxyUrls) {
      let _ = proxyUrl.split(':');
      if (_.length < 2) {
        continue;
      }

      const proxy = {
        host: _[0],
        port: _[1],
        username: _[2],
        password: _[3]
      };

      let browser;
      let args = [
        '--window-size=1024,768'
      ];
      if (Const.ProxySetting.enabled) {
        args.push(`--proxy-server=http://${proxy.host}:${proxy.port}`);
      }
      try {
        let launchOptions = {
          ignoreHTTPSErrors: true,
          args,
          headless: Const.Browser.headless === true
        };

        if (ChromePaths.chrome) {
          launchOptions.executablePath = ChromePaths.chrome;
        }

        browser = await puppeteer.launch(launchOptions);

        let page = await browser.newPage();

        const session = await page.target().createCDPSession();
        await session.send('Page.enable');
        await session.send('Page.setWebLifecycleState', { state: 'active' });


        let userAgents = shuffle(Const.Browser.UserAgents);
        await page._client.send('Emulation.clearDeviceMetricsOverride');
        await page.setUserAgent(userAgents[0]);
        if (Const.ProxySetting.enabled && proxy.username && proxy.password) {
          await page.authenticate({ username: proxy.username, password: proxy.password });
        }
        await page.goto(productUrl, { timeout: 0, waitUntil: 'domcontentloaded' });
        await page.cookies();
        //Solve image captcha

        let isOutOfStock = await page.evaluate(() => {
          // If there is not the Buy Now button, it's out of stock
          var el = document.querySelector('#buyNow_feature_div');
          return !el;
        });
        if (isOutOfStock) {
          return resolve({
            success: false,
            browser: browser,
            page: page,
            selectedProxy: proxy,
            message: 'Product is out of stock',
            msg: 'Out of stock'
          });
        } else {

          // check quantity
          await page.waitForSelector('select#quantity', { timeout: 5000 });

          return resolve({
            success: true,
            browser: browser,
            page: page,
            selectedProxy: proxy,
            message: 'product page launched'
          });
        }
      } catch (e) {
        console.log('failed to launch browser', e.message);
        if (browser) {
          browser.close();
        }
      }
    }

    resolve({
      success: false,
      message: 'Couldn\'t find valid proxy from the proxy list',
      browser: null,
      page: null,
      msg: 'Proxy Error'
    });
  });
};

let addToCart = async (page, quantity) => {
  return new Promise(async resolve => {
    try {
      // Set quantity
      await page.waitForSelector('select#quantity');
      await page.$eval('select#quantity', (el, value) => el.value = value, quantity);


      // Check buy now button exist
      await page.waitForSelector('#buyNow_feature_div');

      // Buy
      await page.click('#buyNow_feature_div');
      await page.waitForTimeout(1000);

      resolve({
        success: true
      });
    } catch (e) {
      resolve({
        success: false,
        message: e.message,
        msg: 'Couldn\'t buy'
      });
    }
  });
};


let signIn = async (page, email, password, fnUpdateStatus, taskId) => {
  return new Promise(async resolve => {
    try {
      let dynamic_status = false;

      await page.waitForSelector('#ap_email');
      // await page.$eval('#ap_email', (el, value) => el.value = value, email);
      await page.type('#ap_email', email, { delay: 60 });
      await page.click('#continue');

      //credentials check
      try {
        await page.waitForSelector('#auth-error-message-box', { timeout: 5000 });
        //default timeout is 30s..
        dynamic_status = false;
      } catch (e) {
        dynamic_status = true;
      }
      if (dynamic_status) {
        console.log(tag, 'password checking..');
        await page.waitForSelector('#ap_password');
        // await page.$eval('#ap_password', (el, value) => el.value = value, password);
        await page.type('#ap_password', password, { delay: 100 });
        await page.click('#signInSubmit');
        try {
          await page.waitForSelector('#auth-warning-message-box', { timeout: 5000 });
          //default timeout is 30s..
          dynamic_status = false;
        } catch (e) {
          dynamic_status = true;
        }
      } else {
        return resolve({
          success: false,
          message: 'Email does not exist',
          msg: 'Email error'
        });
      }
      if (dynamic_status) {
        try {
          console.log(tag, 'Waiting for email confirm');
          if (fnUpdateStatus) {
            fnUpdateStatus(taskId, 'Waiting for email confirm...');
          }
          await page.waitForSelector('span.a-button-inner:nth-child(1)', { timeout: 100000 });
          dynamic_status = true;
        } catch (e) {
          dynamic_status = false;
        }
      } else {
        console.log(tag, 'PASSWORD_ERROR');
        return resolve({
          success: false,
          message: 'Password is wrong',
          msg: 'Password Error'
        });
      }

      if (dynamic_status) {
        console.log(tag, 'APPROVED');
        dynamic_status = await page.evaluate(() => {
          let deliver_to_this_address = document.querySelectorAll('span.a-button-inner a')[3];
          if (deliver_to_this_address) {
            return true;
          } else {
            return false;
          }
        });
      } else {
        return resolve({
          success: false,
          message: 'This request did not approve within 1 min!',
          msg: 'Approve Check Error'
        });
      }

      resolve({
        success: true,
        dynamicStatus: dynamic_status
      });
    } catch (e) {
      resolve({
        success: false,
        message: e.message,
        msg: 'Signing Error'
      });
    }
  });
};

let placeOrder = async (page, dynamic_status, profile) => {
  return new Promise(async resolve => {
    const {
      ccInfo,
      shipping,
      billing
    } = profile;
    console.log(tag, ccInfo, shipping, billing);

    try {

      const placeOrderIfAvailable = async () => {
        let canPlace = await page.evaluate(() => {
          var e = document.querySelector('#bottomSubmitOrderButtonId');
          if (e) {
            return true;
          }
          return false;
        });

        if (canPlace) {
          console.log(tag, 'completed');
          await page.$eval('#bottomSubmitOrderButtonId', (el, value) => el.innerText = value, 'Done');
          return true;
        }
        // await page.click('#bottomSubmitOrderButtonId');
        return false;
      };

      let check_status = 'default';
      if (dynamic_status) {
        check_status = 'default';
      } else {
        check_status = await page.evaluate(() => {
          let checkout_step = document.querySelectorAll('h3.a-color-state')[1].innerText;
          if (checkout_step === 'Choose a payment method') {
            return 'payment';
          } else {
            return 'shipping';
          }
        });
      }

      if (check_status === 'payment') {
        console.log(tag, 'choose billing address');
        await page.waitForTimeout(20000);
        await page.evaluate(() => {
          let payment_button = document.querySelectorAll('span.a-button-inner input')[3];
          payment_button.click();
        });
        try {
          // try place order
          let placedOrder = await placeOrderIfAvailable();
          if (placedOrder)
            return resolve({
              success: true,
              message: 'Completed'
            });
        } catch {
          console.log(tag, 'Please verify your credit card!');
          console.log(tag, ccInfo);
          return resolve({
            success: false,
            message: 'Verify Credit Card',
            msg: 'Card Error'
          });
        }

      } else if (check_status === 'shipping') {
        console.log('shipping');
      } else {
        console.log('default');

        // check if able to place order
        let placedOrder = await placeOrderIfAvailable();
        if (placedOrder)
          return resolve({
            success: true,
            message: 'Completed'
          });

        await page.waitForSelector('span.a-button-inner:nth-child(5)', { timeout: 60000 });
        let place_order = await page.evaluate(() => {
          let payment_method = document.querySelectorAll('span.a-button-inner input')[3];
          if (payment_method) {
            payment_method.click();
            return true;
          } else {
            return false;
          }
        });
        if (place_order) {
          await page.waitForSelector('span.a-button-inner:nth-child(10) input', { timeout: 60000 });
          let completed = await page.evaluate(() => {
            let payment_method = document.querySelectorAll('span.a-button-inner input')[3];
            if (payment_method) {
              payment_method.click();
              return true;
            } else {
              return false;
            }
          });
          if (completed) {
            await page.waitForSelector('span.a-button-inner:nth-child(1) input', { timeout: 60000 });
            await page.evaluate(() => {
              let continue_button = document.querySelectorAll('span.a-button-inner input')[1];
              if (continue_button) {
                continue_button.click();
                dynamic_status = true;
              } else {
                console.log(tag, 'Failed another request');
                dynamic_status = false;
              }
            });
          } else {
            console.log(tag, 'error');
          }
        } else {
          console.log(tag, 'error');
        }
      }
      resolve({
        success: false,
        message: 'Incompleted',
        msg: 'Order Error'
      });
    } catch (e) {
      resolve({
        success: false,
        message: e.message,
        msg: 'Order Error'
      });
    }
  });
};

let tryCheckout = async (productUrl, data) => {
  return new Promise(async (resolve, reject) => {
    let res = {
      success: false,
      state: 'initialized',
      msg: ''
    };
    const { quantity, proxy, credential, shipping, billing, payment } = data;
    let dynamic_status = false;
    let check_status = 'default';
    try {


      return resolve('ok');
    } catch (e) {
      return reject(e);
    }
  });
};

module.exports = {
  getBrowserAndPage,
  addToCart,
  signIn,
  placeOrder,
  tryCheckout
};
