import React, { useEffect, useState } from 'react';
import RightButton from '../common/RightButton';
import TitleBar from '../common/TitleBar';
import { Div, Span, Button, Icon } from '../common';
import Footer from '../common/Footer';
import SideMenu from '../common/SideMenu';
import SiteList from './SiteList';
import Controls from './Controls';
import { Formik, Form, Field } from 'formik';
import { get, set } from '../../utils/Accounts';
import { toast } from 'react-toastify';

const initialAccounts: any[] = [
  {
    id: '1',
    name: 'Gamenerdz',
    baseUrl: 'https://www.gamenerdz.com/',
    email: '',
    password: ''
  },
  {
    id: '2',
    name: 'Amazon',
    baseUrl: 'https://www.amazon.com/',
    email: '',
    password: ''
  }
];

const initialAccount = initialAccounts[0];

const Account = () => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [activeAccount, setActiveAccount] = useState(initialAccount);
  const [editable, setEditable] = useState(false);

  const handleClickItem = (id: string) => {
    let item = accounts.find((e: any) => e.id === id);
    if (item) {
      setActiveAccount(item);
    }
    setEditable(false);
  };

  const loadData = async (mode: string = '') => {
    // await set({});
    const _accounts: any = await get();
    console.log(_accounts);
    let data: any[] = [];
    let added1: boolean = false, added2: boolean = false;
    Object.keys(_accounts).map((key: any) => {
      // @ts-ignore
      if (!added1 && _accounts[key].id != '2') {
        data.push({
          ..._accounts[key],
          ...{
           id: '1'
          }
        });
        added1 = true;
      }
      else if (!added2) {
        data.push({
          ..._accounts[key],
          ...{
            id: '2'
          }
        });
        added2 = true;
      }
    });

    if (!data.find(e => e.id == '1')) {
      data.push(initialAccounts[0]);
    }
    if (!data.find(e => e.id == '2')) {
      data.push(initialAccounts[1]);
    }

    setAccounts(data);
    if (mode == '') {
      setActiveAccount(data[0]);
    } else {
      const item = data.find((e: any) => e.id == activeAccount.id);
      if (item) {
        setActiveAccount(item);
      }
    }

  };

  const updateData = async (account: any) => {
    let newAccounts = [];
    for (let _account of accounts) {
      if (account.id == _account.id) {
        newAccounts.push(account);
      } else {
        newAccounts.push(_account);
      }
    }
    await set(newAccounts);
    // setAccounts(newAccounts);
    await loadData('update');
    setEditable(false);
  };

  const save = async (payload: any) => {
    const { email, password } = payload;
    await updateData({
      id: activeAccount.id,
      name: activeAccount.name,
      baseUrl: activeAccount.baseUrl,
      email,
      password
    });
    toast.dark(`Successfully saved...`, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const reset = () => {
    setEditable(false);
    // setEmail(activeSite.email);
    // setPassword(activeSite.password);
  };

  useEffect(() => {
    loadData('');
  }, []);

  const RightContent = () => {
    let dispEmail = '', dispPassword = '';
    if (editable) {
      dispEmail = activeAccount.email;
      dispPassword = activeAccount.password;
    } else {
      if (activeAccount.email) {
        const _t_emails = activeAccount.email.split('@');
        if (_t_emails[0].length > 2) {
          dispEmail = _t_emails[0].substr(0, 2) + '***@' + _t_emails[1];
        } else {
          dispEmail = _t_emails[0].substr(0, 1) + '***@' + _t_emails[1];
        }
        dispPassword = '******';
      }
    }

    return (
      <Formik
        initialValues={{
          email: dispEmail,
          password: dispPassword
        }}
        validate={values => {
          let errors: any = {};
          if (!values.email) {
            errors.email = 'Required';
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            //alert(JSON.stringify(values, null, 2));
            save({
              email: values.email,
              password: values.password
            });
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting }) => (<Form className="" style={{ padding: '0 20px' }}>
          <Div className="my-40"/>
          <Div className="form-group">
            <label htmlFor="email" className="">Email Address</label>
            <Field type={editable ? 'text' : 'email'} className="form-control d-block" name="email"
                   placeholder="Email Address"
                   disabled={!editable}/>
            {/*<ErrorMessage name="email" component="div"/>*/}
          </Div>
          <Div className="form-group">
            <label htmlFor="password" className="">Password</label>
            <Field type='text' className="form-control d-block" name="password"
                   placeholder="Password"
                   disabled={!editable}/>
          </Div>

          {editable === false ? <Div className="create-pro button" onClick={() => {
              setEditable(true);
            }}>
              <Button type="button" className="create-pro-btn"><Icon className="fas fa-edit"/></Button>
              <Span>Edit Credential</Span>
            </Div> :
            <>
              <Button type="submit" className="create-pro button">
                <Span className="create-pro-btn"><Icon className="fas fa-save" disabled={isSubmitting}/></Span>
                <Span>Save</Span>
              </Button>
              <Div className="delete-pro button" onClick={reset}>
                <Button type="button" className="delete-pro-btn"><Icon
                  className="fa fa-undo"/></Button>
                <Span>Reset</Span>
              </Div>
            </>}
          <Div className="my-40"/>
          <Div className="notification flex-align-top mobile ">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
              <defs>
                <style>{'.a{fill:none;stroke:#65ff89;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}'}</style>
              </defs>
              <g transform="translate(-1 -1)">
                <circle className="a" cx="15" cy="15" r="15" transform="translate(2 2)"/>
                <path className="a" d="M12,8v6" transform="translate(5 3)"/>
                <path className="a" d="M12,16h.015" transform="translate(5 7)"/>
              </g>
            </svg>
            <Span style={{ fontSize: 10, fontStyle: 'italic', color: 'rgba(160, 160, 251, 0.9)' }}>The Email and Password are tied to the {activeAccount.name} Account you are using.</Span>
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
          <TitleBar title={'Accounts'} counts={1} accountBox={true}/>
          <Controls/>
          {activeAccount && <Div className="space-between round-card">
            <SiteList profile={accounts} selectedId={activeAccount.id} onClickItem={handleClickItem}/>
            <Div className="col-8">
              <Div className="tab bottom-border-dotted">
                <Button className="tablinks active">
                  {activeAccount.name}
                </Button>
              </Div>
              <RightContent/>
            </Div>
          </Div>}
        </Div>
      </Div>
      <Footer/>
    </Div>
  );

};

export default Account;
