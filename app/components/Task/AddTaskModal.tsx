import React from 'react';
//@ts-ignore
import Modal from 'react-modal';
import { Button, Div, Icon, Label, ModalTitle, Span } from '../common';
import { ErrorMessage, Field, Form, Formik } from 'formik';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    width: '60%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#181B27',
    border: 'none'
  }
};

interface Props {
  initial: any;
  modalOpen: boolean;
  setIsOpen: any;
  onOK: any;
  accounts: any[],
  profiles: any[],
  proxies: any[],
}

Modal.defaultStyles.overlay.backgroundColor = 'rgba(0 ,0 ,0 ,.8 )';
Modal.setAppElement('body');
const AddTaskModal = ({ initial, modalOpen, setIsOpen, onOK, accounts, profiles, proxies }: Props) => {

  const afterOpenModal = () => {

  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Div className="create-task-wrapper" id="createProxy-modal">
      <Div className="create-task">
        <Modal
          isOpen={modalOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <ModalTitle style={{ paddingTop: 20 }}>{
            initial.id ? 'Edit Task' : 'New Task'
          }</ModalTitle>
          <Div className="j-row">
            <Formik
              initialValues={{
                ...initial,
                ...{
                  count: initial.count || 1,
                  profileId: initial.profile ? initial.profile.id : initial.profileId,
                  proxyId: initial.proxy ? initial.proxy.id : initial.proxyId,
                  accountId: initial.account ? initial.account.id : initial.accountId
                }

              }}
              validate={values => {
                let errors: any = {};
                if (!values.name) {
                  errors.name = 'Name is Required';
                }
                if (!values.productUrl) {
                  errors.productUrl = 'Product URL is Required';
                }
                if (!values.productUrl.toString().startsWith('http')) {
                  errors.productUrl = 'Invalid URL type';
                }
                if (values.quantity < 1) {
                  errors.quantity = 'Quantity must be greater than 0';
                }
                if (values.count < 1) {
                  errors.count = 'Count must be greater than 0';
                }
                if (values.accountId == '-1') {
                  errors.accountId = 'Select a Site';
                }
                if (values.profileId == '-1') {
                  errors.profileId = 'Profile is Required';
                }
                if (values.proxyId == '-1') {
                  errors.proxyId = 'Proxy is Required';
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  // alert(JSON.stringify(values, null, 2));
                  if (onOK) {
                    onOK({
                      name: values.name,
                      accountId: values.accountId,
                      productUrl: values.productUrl,
                      quantity: values.quantity,
                      count: values.count,
                      profileId: values.profileId,
                      proxyId: values.proxyId
                    });
                  }
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({ isSubmitting }) => (<Form style={{ padding: '0 20px' }}>
                <Div className="col-12">
                  <Div className="j-row d-flex my-4">
                    <Div className="form-group col-6">
                      <Label htmlFor="name">Name</Label>
                      <Field type="text" className="form-control d-block" name="name" placeholder="Task Name"
                             style={{ marginTop: 10 }}/>
                      <ErrorMessage name="name" component="span"/>
                    </Div>
                    <Div className="form-group col-6">
                      <Label htmlFor="accountId">Site</Label>
                      <Field as="select" className="form-control d-block" name="accountId" style={{ marginTop: 10 }}>
                        <option value="-1" key="acc-1">Select a Site</option>
                        {accounts.map((item: any, index: number) => (
                          <option value={item.id} key={index}>
                            {/*<Span><Img src={getImg(item.name.toLowerCase() + '.ico')}/></Span>&nbsp;*/}
                            {item.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="accountId" component="span"/>
                    </Div>
                  </Div>
                  <Div className="form-group" style={{ marginBottom: 40 }}>
                    <Label htmlFor="productUrl">Product URL</Label>
                    <Field type="text" className="form-control d-block" name="productUrl" placeholder="Product URL"
                           style={{ marginTop: 10 }}/>
                    <ErrorMessage name="productUrl" component="span"/>
                  </Div>
                  <Div className="j-row d-flex my-4">
                    <Div className="form-group col-6">
                      <Label htmlFor="profileId">Profile</Label>
                      <Field as="select" className="form-control d-block" name="profileId" style={{ marginTop: 10 }}>
                        <option value="-1" key="acc-1">Select a Profile</option>
                        {profiles.map((item: any, index: number) => (
                          <option value={item.id} key={index}>{item.name}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="profileId" component="span"/>
                    </Div>
                    <Div className="form-group col-6">
                      <Label htmlFor="proxyId">Proxy</Label>
                      <Field as="select" className="form-control d-block" name="proxyId" placeholder="Select a Proxy"
                             style={{ marginTop: 10 }}>
                        <option value="-1" key="acc-1">Select a Proxy</option>
                        {proxies.filter(item => item.data.length > 0 ).map((item: any, index: number) => (
                          <option value={item.id}
                                  key={index}>{item.name + ' (count: ' + item.data.length + ')'}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="proxyId" component="span"/>
                    </Div>
                  </Div>
                  <Div className="j-row d-flex my-4">
                    <Div className="form-group col-6">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Field type="number" className="form-control d-block" name="quantity" placeholder="Product QTY"
                             style={{ marginTop: 10 }}/>
                      <ErrorMessage name="quantity" component="span"/>
                    </Div>
                    {initial.id == null && <Div className="form-group col-6">
                      <Label htmlFor="count">Duplicate Count</Label>
                      <Field type="number" className="form-control d-block" name="count"
                             placeholder="Count of duplicates" style={{ marginTop: 10 }}/>
                      <ErrorMessage name="count" component="span"/>
                    </Div>}
                  </Div>

                  <Div className="flex-center">
                    {initial.id ?
                      <Button type="submit" className="create-pro" disabled={isSubmitting}>
                      <Span className="create-pro-btn button">
                        <Icon className="fas fa-save"/>
                      </Span>
                        <Span>Save</Span>
                      </Button>
                      :
                      <Button type="submit" className="create-pro" disabled={isSubmitting}>
                      <Span className="create-pro-btn button">
                        <Icon className="fas fa-plus"/>
                      </Span>
                        <Span>Create</Span>
                      </Button>
                    }
                    <Div className="delete-pro button" onClick={closeModal}>
                      <Button type="button" className="delete-pro-btn"><Icon
                        className="fa fa-window-close"/></Button>
                      <Span>Cancel</Span>
                    </Div>
                  </Div>
                </Div>
              </Form>)}
            </Formik>
          </Div>
        </Modal>
      </Div>

    </Div>

  );

};

export default AddTaskModal;
