import React from 'react';
import { Span, Icon, Div } from './index';
import { ipcRenderer } from 'electron';

const RightButton = () => {

  const appQuit = () => {
    console.log('app quite');
    ipcRenderer.send('quit-app')
  }

  const appMinimize = () => {
    console.log("app minimize");
    // ipcRenderer.send('hide-app');
  }

  return (
    <Div className="right-btns" style={{display: 'none'}}>
      <Span onClick={() => appMinimize()}>
        <Icon className="fas fa-minus">
        </Icon>
      </Span>
      <Span  onClick={() => appQuit()}>
        <Icon className="fas fa-times">
        </Icon>
      </Span>
    </Div>
  )

}

export default RightButton;

