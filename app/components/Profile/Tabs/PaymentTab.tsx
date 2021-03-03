import React, { useState } from 'react';
import { Div, Icon, Form, Label, Textbox } from '../../common';

interface Props {
  visible: string,
  profile: {
    number: string,
    name: string,
    expiry: string,
    cvv: string
  }
}

const PaymentTab = (props: Props) => {
  const [visibleCCNumber, setVisibleCCNumber] = useState(false);

  const toggleVisibleCCNumber = () => {
    setVisibleCCNumber(!visibleCCNumber);
  };

  const getCCNumber = () => {
    const number = props.profile.number.toString();
    let res = '';
    if (!visibleCCNumber && number.length > 6) {
      for (let i = 0; i < number.length; i++) {
        if (i > 3 && i < number.length - 2) {
          res += '*';
        } else {
          res += number[i];
        }
      }
    } else {
      res = number;
    }
    return res;
  };

  return (
    <Div id="payment" className="tabcontent" style={{ 'display': props.visible == 'payment' ? 'block' : 'none' }}>
      <Div className="payment-form">
        <Form>
          <Div className="j-row d-flex">
            <Div className="form-group col-12">
              <Label htmlFor="Card Number">Card Number &nbsp;&nbsp;<Icon
                className={!visibleCCNumber ? 'fa fa-eye' : 'fa fa-eye-slash'}
                onClick={toggleVisibleCCNumber}/></Label>
              <Textbox type="text" name="cardNumber" value={getCCNumber()} className="form-control d-block" id=""
                       placeholder="Card Number" style={{ width: '80%' }} onChange={() => {
              }}/>
            </Div>
          </Div>
          <Div className="j-row d-flex">
            <Div className="form-group col-12">
              <Label htmlFor="cardName">Card Holder Name</Label>
              <Textbox type="text" name="cardName" value={props.profile.name} className="form-control d-block" id=""
                       placeholder="Card Holder Name" onChange={() => {
              }}/>
            </Div>
          </Div>
          <Div className="j-row d-flex">
            <Div className="form-group col-6">
              <Label htmlFor="expiry">Expiry</Label>
              <Textbox type="text" name="expDate" value={props.profile.expiry} className="form-control d-block" id=""
                       placeholder="Month/year" onChange={() => {
              }}/>
            </Div>
            <Div className="form-group col-6">
              <Label htmlFor="cvv">CVV</Label>
              <Textbox type="text" name="cvv" value={props.profile.cvv} className="form-control d-block" id=""
                       placeholder="CVV" onChange={() => {
              }}/>
            </Div>
          </Div>
        </Form>
      </Div>
    </Div>
  );
};

export default PaymentTab;
