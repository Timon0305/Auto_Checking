import React from 'react';
import { Button, Div, Icon, Span } from '../common';


const Footer = () => {

  return (
    <Div className="light-grey-bg footer-row flex-align-center">
      <Div className="col-6 flex-align-right">
        <Div className="filter-success">
          <Button className="fil-success-btn"><Icon className="fas fa-check"/></Button>
          <Span>Filter Success</Span>
        </Div>
      </Div>
      <Div className="col-6 flex-align-left">
        <Div className="delete-l">
          <Button className="delete-l-btn"><Icon className="fas fa-trash-alt"/></Button>
          <Span>Delete L's</Span>
        </Div>
      </Div>
    </Div>
  )

};

export default Footer;
