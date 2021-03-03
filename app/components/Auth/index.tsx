import React from 'react';
import getImg from '../../utils/getImg';
import { ipcRenderer } from 'electron';
import { ErrorMessage, Field, Form, Formik } from 'formik';

import {
  Div, Span, Icon, Img, Title, Button
} from '../common';

const Auth = () => {

  const handleSubmit = (key: string) => {
    console.log('LICENSE_KEY_INPUT', key);
    authHandler();
  };

  const authHandler = () => {
    console.log('auth handler!');
    ipcRenderer.send('activated');
  };

  const authQuit = () => {
    console.log('app quite');
    ipcRenderer.send('quit-app');
  };

  const authMinimize = () => {
    ipcRenderer.send('hide-app');
  };

  return (
    <Div className="j-container-fluid">
      <Div className="j-row">
        <Div className="j-container light-bg flex-center">
          <Div className="auth-box text-center">
            <Div className="right-btns">
              <Span onClick={() => authMinimize()}>
                <Icon className="fas fa-minus">
                </Icon>
              </Span>
              <Span onClick={() => authQuit()}>
                <Icon className="fas fa-times">
                </Icon>
              </Span>
            </Div>
            <Img src={getImg('logo.png')} className="img-fluid"/>
            <Title>License Key</Title>
            <Formik
              initialValues={{ key: '' }}
              validate={values => {
                let errors: any = {};
                if (!values.key) {
                  errors.name = 'License key is Required';
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  // alert(JSON.stringify(values, null, 2));
                  handleSubmit(values.key);
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({ isSubmitting }) => (<Form className="" style={{ padding: '0 20px' }}>
                <Field type="text" className="form-control my-4" name="key" placeholder="Your license key" style={{backgroundColor: '#222B45'}}/>
                <ErrorMessage name="key"/>
                <Button type="submit" className="activate-btn mt-6"
                        disabled={isSubmitting} style={{backgroundColor: '#8760fb'}}>Activate</Button>
              </Form>)}
            </Formik>
          </Div>

        </Div>
      </Div>

    </Div>
  );
};


export default Auth;
