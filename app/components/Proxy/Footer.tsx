import React from 'react';
import { Button, Div, Icon, Span } from '../common';

const Footer = () => {

  return (
    <Div className="light-grey-bg footer-row flex-align-center">
      <Div className="col-6 flex-align-right">
        <Div className="test-all">
          <Button className="test-all-btn"><Icon className="fas fa-cloud"/></Button>
          <Span>Test All</Span>
        </Div>
      </Div>
      <Div className="col-6 flex-align-left">
        <Div className="delete-all-nw">
          <Button className="delete-all-nw-btn"><Icon className="fas fa-trash-alt"/></Button>
          <Span>Delete Non-Working</Span>
        </Div>
      </Div>
    </Div>
  )

}

export default Footer;
