import React, { useState } from 'react';
//@ts-ignore
import Modal from 'react-modal';
import { Button, Div, Icon, Label, ModalTitle, Span } from '../common';
import { ErrorMessage, Field, Form, Formik } from 'formik';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    width: '70%',
    minHeight: '500px',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '20px',
    transform: 'translate(-50%, -50%)',
    background: '#181B27',
    border: 'none',
    zIndex: 300
  }
};

interface Props {
  modalOpen: boolean;
  setIsOpen: any;
  onOK: any;
  initialValue: any;
}

Modal.defaultStyles.overlay.backgroundColor = 'rgba(0 ,0 ,0 ,.8 )';
Modal.setAppElement('body');
const ProfileModal = ({ modalOpen, setIsOpen, onOK, initialValue }: Props) => {
  const { id, name, shipping, billing, ccInfo, isBillingSameAsShipping } = initialValue;

  const [isDifferent, setDifferent] = useState(!isBillingSameAsShipping);
  const [active, setActive] = useState('shipping');


  const toggleDifferent = () => {
    setDifferent(!isDifferent);
  };

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
          <ModalTitle style={{
            paddingTop: 10,
            paddingBottom: 10,
            marginBottom: 0
          }}>{id == '' ? 'Create Profile' : 'Edit Profile'}</ModalTitle>
          <Div className="j-row flex-align-top">
          </Div>
          <Div className="j-row">
            <Formik
              initialValues={
                {
                  name,
                  s_firstName: shipping.firstName,
                  s_lastName: shipping.lastName,
                  s_address: shipping.address,
                  s_address2: shipping.address2,
                  s_city: shipping.city,
                  s_state: shipping.state,
                  s_country: shipping.country || 'US',
                  s_postal: shipping.postal,
                  s_phone: shipping.phone,
                  isBillingSameAsShipping,
                  b_firstName: billing.firstName,
                  b_lastName: billing.lastName,
                  b_address: billing.address,
                  b_address2: billing.address2,
                  b_city: billing.city,
                  b_state: billing.state,
                  b_country: billing.country,
                  b_postal: billing.postal,
                  b_phone: billing.phone,
                  c_number: ccInfo.number,
                  c_name: ccInfo.name,
                  c_expiry_m: ccInfo.expiry.split('/')[0],
                  c_expiry_y: ccInfo.expiry.split('/')[1] || '',
                  c_cvv: ccInfo.cvv
                }
              }
              validate={values => {
                let errors: any = {};
                if (!values.name) {
                  errors.name = 'Name is Required';
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  // alert(JSON.stringify(values, null, 2));
                  const shipping = {
                    firstName: values.s_firstName,
                    lastName: values.s_lastName,
                    address: values.s_address,
                    address2: values.s_address2,
                    city: values.s_city,
                    state: values.s_state,
                    country: values.s_country,
                    postal: values.s_postal,
                    phone: values.s_phone
                  };

                  let billing;
                  if (!isDifferent) {
                    billing = shipping;
                  } else {
                    billing = {
                      firstName: values.b_firstName,
                      lastName: values.b_lastName,
                      address: values.b_address,
                      address2: values.b_address2,
                      city: values.b_city,
                      state: values.b_state,
                      country: values.b_country,
                      postal: values.b_postal,
                      phone: values.b_phone
                    };
                  }
                  const ccInfo = {
                    number: values.c_number,
                    name: values.c_name,
                    expiry: values.c_expiry_m + '/' + values.c_expiry_y,
                    cvv: values.c_cvv
                  };
                  if (onOK) {
                    onOK(
                      {
                        id,
                        name: values.name,
                        shipping,
                        isBillingSameAsShipping: !isDifferent,
                        billing,
                        ccInfo
                      }
                    );
                  }
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({ isSubmitting }) => (<Form className="create-profile" style={{ padding: '0 20px' }}>
                <Div className="divider">Profile</Div>
                <Div className="form-group">
                  {/*<Label htmlFor="name">Name</Label>*/}
                  <Field type="text" className="form-control d-block" name="name" placeholder="Name"/>
                  <ErrorMessage name="name" component="span"/>
                </Div>
                <Div className="tab bottom-border-dotted">
                  <Button type="button" className={active == 'shipping' ? 'tablinks active' : 'tablinks'}
                          onClick={() => setActive('shipping')}>
                    Shipping<Span className="pink-dot"><Icon className="fas fa-circle"/></Span>
                  </Button>
                  <Button type="button" className={active == 'billing' ? 'tablinks active' : 'tablinks'}
                          onClick={() => setActive('billing')}>
                    Billing<Span className="pink-dot"><Icon className="fas fa-circle"/></Span>
                  </Button>
                  <Button type="button" className={active == 'payment' ? 'tablinks active' : 'tablinks'}
                          onClick={() => setActive('payment')}>
                    Payment<Span className="pink-dot"><Icon className="fas fa-circle"/></Span>
                  </Button>
                </Div>

                {active == 'shipping' && <>
                  <Div className="divider">Shipping</Div>
                  <Div className="j-row d-flex">
                    <Div className="form-group col-3">
                      <Label htmlFor="s_firstName">First Name</Label>
                      <Field type="text" className="form-control d-block" name="s_firstName" placeholder="First Name"/>
                    </Div>
                    <Div className="form-group col-3">
                      <Label htmlFor="s_lastName">Last Name</Label>
                      <Field type="text" className="form-control d-block" name="s_lastName" placeholder="Last Name"/>
                    </Div>
                    <Div className="form-group col-3">
                      <Label htmlFor="s_address">Address</Label>
                      <Field type="text" className="form-control d-block" name="s_address" placeholder="Address"/>
                    </Div>
                    <Div className="form-group col-3">
                      <Label htmlFor="s_address2">Address2</Label>
                      <Field type="text" className="form-control d-block" name="s_address2" placeholder="Address2"/>
                    </Div>
                  </Div>
                  <Div className="j-row d-flex">
                    <Div className="form-group col-3">
                      <Label htmlFor="s_city">City</Label>
                      <Field type="text" className="form-control d-block" name="s_city" placeholder="City"/>
                    </Div>
                    <Div className="form-group col-3">
                      <Label htmlFor="s_state">State</Label>
                      <Field type="text" className="form-control d-block" name="s_state" placeholder="State"/>
                    </Div>
                    <Div className="form-group col-3">
                      <Label htmlFor="s_postal">Postal Code</Label>
                      <Field type="text" className="form-control d-block" name="s_postal" placeholder="Postal Code"/>
                    </Div>
                    <Div className="form-group col-3">
                      <Label htmlFor="s_phone">Phone</Label>
                      <Field type="text" className="form-control d-block" name="s_phone" placeholder="Phone"/>
                    </Div>
                  </Div>
                </>}

                {active == 'billing' && <>
                  <Div className="divider">
                    Billing (
                    <Span className="green-txt" onClick={toggleDifferent} style={{ cursor: 'pointer' }}>
                    &nbsp;Is billing different with shipping?:&nbsp;&nbsp;
                      <Icon className={isDifferent ? 'fa fa-check-circle pink-txt' : 'fa fa-window-close red-txt'}/>
                      {isDifferent ? ' Yes ' : ' No '}
                  </Span>
                    )
                  </Div>
                  {isDifferent &&
                  <>
                    <Div className="j-row d-flex">
                      <Div className="form-group col-3">
                        <Label htmlFor="b_firstName">First Name</Label>
                        <Field type="text" className="form-control d-block" name="b_firstName"
                               placeholder="First Name"/>
                      </Div>
                      <Div className="form-group col-3">
                        <Label htmlFor="b_lastName">Last Name</Label>
                        <Field type="text" className="form-control d-block" name="b_lastName" placeholder="Last Name"/>
                      </Div>
                      <Div className="form-group col-3">
                        <Label htmlFor="b_address">Address</Label>
                        <Field type="text" className="form-control d-block" name="b_address" placeholder="Address"/>
                      </Div>
                      <Div className="form-group col-3">
                        <Label htmlFor="b_address2">Address2</Label>
                        <Field type="text" className="form-control d-block" name="b_address2" placeholder="Address2"/>
                      </Div>
                    </Div>
                    <Div className="j-row d-flex">
                      <Div className="form-group col-3">
                        <Label htmlFor="b_city">City</Label>
                        <Field type="text" className="form-control d-block" name="b_city" placeholder="City"/>
                      </Div>
                      <Div className="form-group col-3">
                        <Label htmlFor="b_state">State</Label>
                        <Field type="text" className="form-control d-block" name="b_state" placeholder="State"/>
                      </Div>
                      <Div className="form-group col-3">
                        <Label htmlFor="b_postal">Postal Code</Label>
                        <Field type="text" className="form-control d-block" name="b_postal" placeholder="Postal Code"/>
                      </Div>
                      <Div className="form-group col-3">
                        <Label htmlFor="b_phone">Phone</Label>
                        <Field type="text" className="form-control d-block" name="b_phone" placeholder="Phone"/>
                      </Div>
                    </Div>
                  </>}
                </>}

                {active == 'payment' && <>
                  <Div className="divider">Card</Div>
                  <Div className="j-row d-flex">
                    <Div className="form-group col-5">
                      <Label htmlFor="c_number">Number</Label>
                      <Field type="text" className="form-control d-block" name="c_number" placeholder="Number"/>
                    </Div>
                    <Div className="form-group col-4">
                      <Label htmlFor="c_name">Holder Name</Label>
                      <Field type="text" className="form-control d-block" name="c_name" placeholder="Holder Name"/>
                    </Div>
                  </Div>
                  <Div className="j-row d-flex">
                    <Div className="form-group col-2">
                      <Label htmlFor="c_expiry_m">Expiry</Label>
                      <Field type="text" className="form-control d-block" name="c_expiry_m" placeholder="Month"/>
                    </Div>
                    <Div className="form-group col-2">
                      <Label htmlFor="c_expiry_y" style={{ color: 'transparent' }}>.</Label>
                      <Field type="text" className="form-control " name="c_expiry_y" placeholder="Year"/>
                    </Div>
                    <Div className="form-group col-1">
                    </Div>
                    <Div className="form-group col-4">
                      <Label htmlFor="c_cvv">CVV</Label>
                      <Field type="text" className="form-control d-block" name="c_cvv" placeholder="CVV"/>
                    </Div>
                  </Div>
                </>}

                <Div className="my-40"/>
                <Div className="flex-center">
                  <Button type="submit" className="create-pro button">
                    <Span className="create-pro-btn"><Icon className="fas fa-save"
                                                           disabled={isSubmitting}/></Span>
                    <Span>Save</Span>
                  </Button>
                  <Div className="delete-pro button" onClick={closeModal}>
                    <Button type="button" className="delete-pro-btn"><Icon
                      className="fa fa-undo"/></Button>
                    <Span>Cancel</Span>
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

export default ProfileModal;
