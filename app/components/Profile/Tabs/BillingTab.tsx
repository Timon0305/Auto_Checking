import React from 'react';
import { Div, Form, Label, Textbox } from '../../common';

interface Props {
  visible: string,
  profile: {
    firstName: string
    lastName: string,
    address: string,
    address2: string,
    city: string,
    state: string,
    phone: string,
    country: string,
    postal: string,
  },
}

const BillingTab = (props: Props) => {

  return (
    <Div id="Billing" className="tabcontent" style={{ 'display': props.visible == 'billing' ? 'block' : ' none' }}>
      <Div className="Billing-form">
        <Form>
          <Div className="j-row d-flex">
            <Div className="form-group col-6">
              <Label htmlFor="first-name">First Name</Label>
              <Textbox type="text" name='firstName' value={props.profile.firstName} className="form-control d-block"
                       id="" placeholder="First Name" onChange={() => {
              }}/>
            </Div>
            <Div className="form-group col-6">
              <Label htmlFor="pwd">Last Name</Label>
              <Textbox type="text" name='lastName' value={props.profile.lastName} className="form-control d-block" id=""
                       placeholder="Last Name" onChange={() => {
              }}/>
            </Div>
          </Div>
          <Div className="j-row d-flex">
            <Div className="form-group col-6">
              <Label htmlFor="address">Address</Label>
              <Textbox type="text" name="address" value={props.profile.address} className="form-control d-block" id=""
                       placeholder="Address" onChange={() => {
              }}/>
            </Div>
            <Div className="form-group col-6">
              <Label htmlFor="address2">Address 2</Label>
              <Textbox type="text" name="address2" value={props.profile.address2} className="form-control d-block" id=""
                       placeholder="Address2" onChange={() => {
              }}/>
            </Div>
          </Div>
          <Div className="j-row d-flex">
            <Div className="form-group col-6">
              <Label htmlFor="city">City</Label>
              <Textbox type="text" name="city" value={props.profile.city} className="form-control d-block" id=""
                       placeholder="City" onChange={() => {
              }}/>
            </Div>
            <Div className="form-group col-6">
              <Label htmlFor="state">State</Label>
              <Textbox type="text" name="state" value={props.profile.state} className="form-control d-block" id=""
                       placeholder="State" onChange={() => {
              }}/>
            </Div>
          </Div>
          <Div className="j-row d-flex">
            <Div className="form-group col-6">
              <Label htmlFor="zip">Postal Code</Label>
              <Textbox type="text" name="postal" value={props.profile.postal} className="form-control d-block" id=""
                       placeholder="Postal Code" onChange={() => {
              }}/>
            </Div>
            <Div className="form-group col-6">
              <Label htmlFor="phone number">Phone Number</Label>
              <Textbox type="number" name="phone" value={props.profile.phone} className="form-control d-block" id=""
                       placeholder="Phone" onChange={() => {
              }}/>
            </Div>
          </Div>
        </Form>
      </Div>
    </Div>
  );
};

export default BillingTab;
