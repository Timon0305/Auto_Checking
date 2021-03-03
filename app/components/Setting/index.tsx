import React, { useEffect, useState } from 'react';
import { Button, Div, Icon, Img, Label, Span } from '../common';
import RightButton from '../common/RightButton';
import TitleBar from '../common/TitleBar';
import Footer from '../common/Footer';
import SideMenu from '../common/SideMenu';
import getImg from '../../utils/getImg';
import { get, set } from '../../utils/Settings';
import { Formik, Form, Field } from 'formik';
import { toast } from 'react-toastify';

const defaultSettings = {
  '2captchaToken': '',
  'discordWebHookUrl': '',
  'delayTimeInMs': 3000,
  'retryTimeInMs': 3000
};
const Setting = () => {
  const [settings, setSettings] = useState(defaultSettings);

  const loadSettings = async () => {
    let data: any = await get();
    if (data && Object.keys(data).length > 0) {
      setSettings(data);
    }
  };

  const saveSettings = async (data: any) => {
    console.log(data);
    await set(data);
    await loadSettings();
    toast.dark('Successfully saved settings...', {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const LeftContent = () => {
    // @ts-ignore
    return (
      <Formik
        initialValues={settings}
        validate={values => {
          let errors: any = {};
          if (!values.discordWebHookUrl.startsWith('https://discord.com/api/webhooks/')) {
            //errors.discordWebHookUrl = 'invalid value';
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            saveSettings(values);
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting }) => (<Form style={{ width: '85%' }}>
          <Div className="form-group">
            <Label htmlFor="email">2Captcha Token</Label>
            <Field type="text" name="2captchaToken" className="form-control" placeholder="2captcha.com api token"/>
          </Div>
          <Div className="form-group">
            <Label>Discord WebHook URL</Label>
            <Field type="text" className="form-control" name="discordWebHookUrl"
                   placeholder="Discord Web Hook URL"/>
          </Div>
          <Div className="form-group">
            <Label>Delay Time (ms)</Label>
            <Field type="number" name="delayTimeInMs" className="form-control" placeholder="3000"/>
          </Div>
          <Div className="form-group">
            <Label>Retry Time (ms)</Label>
            <Field type="number" name="retryTimeInMs" className="form-control" placeholder="3000"/>
          </Div>
          <Div className="flex-align-center">
            <Div className="col-6 flex-align-right">
              <Button type="submit" className="create-pro button" disabled={isSubmitting}>
                <Span className="create-pro-btn"><Icon
                  className="far fa-save"/></Span>
                <Span>Save Settings</Span>
              </Button>
            </Div>
            <Div className="col-6 flex-align-left">
              <Div className="pause-task button" onClick={() => {
                loadSettings();
              }}>
                <Button type="button" className="pause-btn"><Icon className="fas fa fa-undo"/></Button>
                <Span>Reset Settings</Span>
              </Div>
            </Div>
          </Div>

        </Form>)}
      </Formik>
    );
  };

  return (

    <Div className="j-container-fluid d-flex h-100">
      <RightButton/>
      <SideMenu/>
      <Div className="page-container">
        <Div className="col-12">
          <TitleBar title={'Settings'} counts={4} accountBox={true}/>
          <Div className="flex-align-center controls">
            <Div className="col-4 flex-align-left j-row ">
              <Div className="notification flex-align-top mobile">
                <Img src={getImg('logo.png')} alt="" className="img-fluid logo-img" style={{ height: 20 }}/>
                <Span>Auto Processing <Span style={{ fontSize: 10 }}>v1.0.0</Span></Span>
              </Div>
            </Div>
            <Div className="col-8 flex-align-right">
              Application Settings
            </Div>
          </Div>

          <Div className="round-card" style={{ padding: '40px 0', margin: '20px 0' }}>
            <Div className="flex-center flex-align-center">
              <LeftContent/>
            </Div>
          </Div>
          {/*<Controls/>*/}
        </Div>
      </Div>
      <Footer/>
    </Div>

  );

};

export default Setting;
