const Const = require('./const.json');
const Url = require('url-parse');
const queryString = require('query-string');
const Captcha = require('2captcha');
const chromePaths = require('chrome-paths');
// // const puppeteer = require('puppeteer-extra');
// // const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// // puppeteer.use(StealthPlugin());
const puppeteer = require('puppeteer');
const { shuffle } = require('../util');

console.log('CHROME_PATHS', chromePaths);


let getBrowserAndPage = async (productUrl, proxyUrls, taskId) => {
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
        // '--start-minimized'
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

        if (chromePaths.chrome) {
          launchOptions.executablePath = chromePaths.chrome;
        } else {
          return resolve({
            success: false,
            message: 'Chrome browser not installed!',
            browser: null,
            page: null,
            msg: 'Browser Error'
          });
        }

        browser = await puppeteer.launch(launchOptions);

        let page = await browser.newPage();

        const session = await page.target().createCDPSession();
        // minimize
        // const { windowId } = await session.send('Browser.getWindowForTarget');
        // await session.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'minimized' } });
        // unfreeze javascript execution in the background page
        await session.send('Page.enable');
        await session.send('Page.setWebLifecycleState', { state: 'active' });


        let userAgents = shuffle(Const.Browser.UserAgents);
        await page._client.send('Emulation.clearDeviceMetricsOverride');
        await page.setUserAgent(userAgents[0]);
        if (Const.ProxySetting.enabled && proxy.username && proxy.password) {
          await page.authenticate({ username: proxy.username, password: proxy.password });
        }
        await page.goto(productUrl, { timeout: 0, waitUntil: 'domcontentloaded' });

        let isOutOfStock = await page.evaluate(() => {
          var el = document.querySelector('div.alertBox--error p.alertBox-message');
          return (el && el.innerText === 'Out of stock');
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
          await page.waitForSelector('div.form-increment>input.form-input--incrementTotal', { timeout: 5000 });
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
      await page.waitForSelector('div.form-increment>input.form-input--incrementTotal');
      await page.evaluate((quantity) => {
        let qty = document.querySelector('div.form-increment>input.form-input--incrementTotal');
        if (qty) {
          qty.value = quantity;
        }
      }, quantity);
      await page.waitForSelector('#form-action-addToCart');
      await page.click('#form-action-addToCart');

      await page.waitForSelector('section.previewCartCheckout a[href="/checkout"]');
      await page.click('section.previewCartCheckout a[href="/checkout"]');
      await page.waitForTimeout(1000);
      // await page.goto(Const.Target.CheckOut, {waitUntil: "load"});

      resolve({
        success: true
      });
    } catch (e) {
      resolve({
        success: false,
        message: e.message
      });
    }
  });
};

let signIn = async (page, email, password) => {
  return new Promise(async resolve => {
    try {
      await page.waitForSelector('#email');
      await page.type('#email', email, { delay: 60 });
      await page.type('#password', password, { delay: 90 });
      await page.click('#checkout-customer-continue');

      await page.waitForSelector('li.checkout-step--customer div.stepHeader-counter--complete');

      resolve({
        success: true
      });
    } catch (e) {
      resolve({
        success: false,
        message: e.message
      });
    }
  });
};

let shipping = async (page, data) => {
  return new Promise(async resolve => {
    try {
      let {
        country, firstName, lastName, address, city, state, postalCode, phone
      } = data;

      await page.waitForTimeout(5000);
      await __autoScroll(page);
      let isShippingCompleted = await page.evaluate(() => {
        const e = document.querySelector('li.checkout-step--shipping div.stepHeader-counter--complete');
        if (e) {
          return true;
        }
        return false;
      });
      if (!isShippingCompleted) {
        console.log('shipping is not completed');
      }
      while (true) {
        await page.waitForTimeout(3000);
        await __autoScroll(page);

        let shipping = await page.evaluate(() => {
          let continueButton = document.querySelector('#checkout-shipping-continue');
          if (continueButton)
            return true;
          return false;
        });
        if (shipping) {
          try {
            await page.click('#checkout-shipping-continue');
          } catch (e) {
            console.log('shipping ...');
          }
        } else {
          break;
        }
      }

      resolve({
        success: true
      });
    } catch (e) {
      resolve({
        success: false,
        message: e.message
      });
    }
  });
};

let billing = async (page, data) => {
  return new Promise(async resolve => {
    try {
      // == Billing == //

      await page.waitForTimeout(3000);
      await __autoScroll(page);
      await page.waitForSelector('li.checkout-step--billing div.stepHeader-counter--complete');

      resolve({
        success: true
      });
    } catch (e) {
      resolve({
        success: false,
        message: e.message
      });
    }
  });
};

let solveRecaptcha = async (page, data) => {

  return new Promise(async resolve => {
    try {
      let { recaptchaToken } = data;
      await page.waitForSelector('iframe[title="recaptcha challenge"]');
      await __autoScroll(page);

      let recaptchaSrc = await page.evaluate(() => {
        let iframe = document.querySelector('iframe[title="recaptcha challenge"]');
        if (iframe) {
          return iframe.getAttribute('src');
        }
        return null;
      });

      console.log('recaptcha-src:', recaptchaSrc);
      console.log('recaptcha-tkn:', recaptchaToken);
      // const session = await page.target().createCDPSession();
      // const {windowId} = await session.send('Browser.getWindowForTarget');
      // await session.send('Browser.setWindowBounds', {windowId, bounds: {windowState: 'normal'}});
      // await session.send('Browser.setWindowBounds', {windowId, bounds: {width: 1024, height: 768, left: 100, top: 100}});

      if (recaptchaSrc) {
        // const solver = new Captcha.Solver(apiKey);
        // let url = new Url(recaptchaSrc);
        // console.log('url parsed', url);
        // const queryParams = queryString.parse(url.query);
        // console.log('params parsed', queryParams);
        //
        // // TODO: check shuffle userAgents (it might be different with the original one when open the browser)
        // let _res = await solver.recaptcha(queryParams['k'].toString(), Const.Target.CheckOut, {
        //   invisible: true,
        //   // proxy: `${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`,
        //   proxytype: 'http',
        //   'data-s': '',
        //   cookies: '',
        //   userAgent: Const.Browser.UserAgents[0],
        //   header_acao: true,
        //   pingback: ''
        //   // soft_id: 0,
        // });
        //
        // console.log('ReCaptcha solved', _res);
        // recaptchaToken = _res.data;

        async function delay(ms) {
          return new Promise(resolve => {
            setTimeout(function() {
              resolve();
            }, ms);
          });
        }

        function findAndExecuteCallback(parent) {
          if (typeof parent === 'object') {
            for (let key in parent) {
              if (parent.hasOwnProperty(key)) {
                if (key === 'callback' && typeof parent[key] === 'function') {
                  parent[key]();
                  return;
                } else if (typeof parent[key] === 'object') {
                  findAndExecuteCallback(parent[key]);
                }
              }
            }
          }
        }

        // await page.exposeFunction('delay', delay);
        // await page.exposeFunction('findAndExecuteCallback', findAndExecuteCallback);

        /**/
        let count = 0;
        while (true) {
          await page.waitForTimeout(2000);
          count++;
          const _t_recaptcha = await page.evaluate((token) => {
            try {
              var t = document.getElementById('g-recaptcha-response');
              var array = ['V', 'P', '$'];
              if (t) {
                t.innerHTML = token;
                if (___grecaptcha_cfg !== undefined && ___grecaptcha_cfg.clients[0] !== undefined) {
                  var client = ___grecaptcha_cfg.clients[0];
                  for (var i = 0; i < array.length; i++) {
                    var key = array[i];
                    if (client[key] && client[key][key] && client[key][key].callback) {
                      client[key][key].callback();
                      return true;
                    }
                  }
                }
              }
              return false;
            } catch (e) {
              return null;
            }
          }, recaptchaToken);

          console.log('Solving Recaptcha tried(', count, '): res =', _t_recaptcha);
          if (_t_recaptcha === true) {
            break;
          } else if (_t_recaptcha === null) {
            resolve({
              success: false,
              message: 'Invalid Recaptcha Token '
            });
            break;
          }

          if (count > 40) {
            resolve({
              success: false,
              message: 'Couldn\'t find Callback'
            });
            break;
          }
        }
        /***/
      }

      resolve({
        success: true
      });
    } catch (e) {
      resolve({
        success: false,
        message: e.message
      });
    }
  });
};

let makePayment = async (page, data) => {
  return new Promise(async resolve => {
    try {
      await page.waitForTimeout(2000);

      const wentWrong = await page.evaluate(() => {
        let modalButton = document.querySelector('.ReactModalPortal button');
        if (modalButton) {
          modalButton.click();
          return true;
        }
        return false;
      });

      if (wentWrong) {
        resolve({
          success: false,
          message: e.message
        });
        return;
      }

      await __autoScroll(page);

      let count = 0;
      while (true) {
        count++;
        console.log('Waiting Payment Count', count);
        await page.waitForTimeout(2000);
        let iframeAppeared = await page.evaluate(() => {
          let iframe = document.querySelector('#authorizenet-ccNumber iframe');
          if (iframe) {
            let el = document.querySelector('#authorizenet-ccNumber');
            if (el) {
              el.click();
              return true;
            }
          }
          return false;
        });
        if (iframeAppeared) {
          break;
        }
        if (count > 60) {
          resolve({
            success: false,
            message: 'Invalid Recaptcha Token '
          });
          break;
        }
      }

      const clickOnElementBySelector = async (selector, x = null, y = null) => {
        while (true) {

          const rect = await page.evaluate(sel => {
            let el = document.querySelector(sel);
            if (el) {
              const { top, left, width, height } = el.getBoundingClientRect();
              return { top, left, width, height };
            }
            return null;
          }, selector);

          if (rect) {
            // Use given position or default to center
            const _x = x !== null ? x : rect.width / 2;
            const _y = y !== null ? y : rect.height / 2;

            await page.mouse.click(rect.left + _x, rect.top + _y);
            break;
          } else {
            await page.waitForTimeout(1000);
          }
        }
      };

      // await page.waitForSelector('#authorizenet-ccNumber');
      await __autoScroll(page);
      await __autoScroll(page);
      await page.waitForTimeout(2000);
      try {
        console.log('1');
        await clickOnElementBySelector('#authorizenet-ccNumber');
        await page.keyboard.type(data.number, { delay: 200 });
      } catch (e) {
        console.log(e.message);
      }
      await __autoScroll(page);
      try {
        console.log('2');
        await clickOnElementBySelector('#authorizenet-ccExpiry');
        await page.keyboard.type(data.expiry, { delay: 200 });
      } catch (e) {
        console.log(e.message);
      }
      await __autoScroll(page);
      try {
        console.log('3');
        await clickOnElementBySelector('#authorizenet-ccName');
        await page.keyboard.type(data.name, { delay: 200 });
      } catch (e) {
        console.log(e.message);
      }
      await __autoScroll(page);
      try {
        console.log('4');
        await clickOnElementBySelector('#authorizenet-ccCvv');
        await page.keyboard.type(data.cvv, { delay: 200 });
      } catch (e) {
        console.log(e.message);
      }

      await page.evaluate(() => {
        let _term = document.querySelector('#terms');
        if (_term) {
          _term.click();
        }

        let _place = document.querySelector('#checkout-payment-continue');
        if (_place) {
          _place.innerHTML = 'Done!';
          // _place.click();
        }
      });

      let payloadElement = await page.$('body');
      if (payloadElement && false) {
        //let boundingBox = await payloadElement.boundingBox();
        await page._client.send('Emulation.clearDeviceMetricsOverride');
        await payloadElement.screenshot({
          path: './res_' + new Date().toLocaleString().replace(/[:/]/g, '-') + '.png'
          //clip: {
          //    x: boundingBox.x,
          //    y: boundingBox.y,
          //    width: Math.max(Math.ceil(boundingBox.width), initial.width),
          //    height: Math.max(Math.ceil(boundingBox.height), initial.height)
          //}
        });
      }
      // await page.waitForSelector('#checkout-payment-continue');
      // await page.waitForNavigation({waitUntil: "networkidle0"});
      await page.waitForTimeout(5000);

      resolve({
        success: true
      });
    } catch (e) {
      resolve({
        success: false,
        message: e.message
      });
    }
  });
};

let temp = async (page, data) => {
  return new Promise(async resolve => {
    try {
      resolve({
        success: true
      });
    } catch (e) {
      resolve({
        success: false,
        message: e.message
      });
    }
  });
};

let __autoScroll = async (page) => {
  await page.evaluate(() => {
    let distance = 200;

    window.scrollBy(0, distance);
  });
};

module.exports = {
  getBrowserAndPage,
  addToCart,
  signIn,
  shipping,
  billing,
  solveRecaptcha,
  makePayment
};

