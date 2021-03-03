import React from 'react';
import { Div, Icon, Span } from '../common';


const Controls = () => {
  return (
    <Div className="flex-align-center controls">
      <Div className="col-4 flex-align-left j-row ">
        <Div className="notification flex-align-top mobile">
          <Span style={{ fontSize: 14 }}>
          <Icon className="fas fa-user"/>
           &nbsp;Sites & Accounts
          </Span>
        </Div>
      </Div>
      <Div className="col-8 flex-align-right">
        <Span>Your Credential Information is here.</Span>
      </Div>
    </Div>
  );

};

export default Controls;
