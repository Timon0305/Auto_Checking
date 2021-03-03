import React from 'react';
import { Button, Div, Icon, Span } from '../common';

interface Props {
  create: any,
  delete: any,
  profile: any,
  import: any,
  clear: any
}

const Controls = (props: Props) => {
  return (
    <Div className="flex-align-center controls">
      <Div className="col-4 flex-align-left j-row ">
        <Div className="create-pro button" onClick={() => props.create()}>
          <Button className="create-pro-btn"><Icon className="fas fa-plus"/></Button>
          <Span>Create</Span>
        </Div>
        <Div className="delete-pro button" onClick={() => props.delete()}>
          <Button className="delete-pro-btn"><Icon
            className="fas fa-trash-alt"/></Button>
          <Span>Delete All</Span>
        </Div>
      </Div>
      <Div className="col-8 flex-align-right">
        <Div className="">
          <Div className="create-pro button" onClick={() => props.import()}>
            <Button className="create-pro-btn"><Icon className="fas fa-plus"/></Button>
            <Span>Import</Span>
          </Div>
          <Div className="delete-pro button" onClick={() => props.clear()}>
            <Button className="delete-pro-btn"><Icon
              className="fas fa-trash-alt"/></Button>
            <Span>Clear All</Span>
          </Div>
        </Div>
      </Div>
    </Div>
  );

};

export default Controls;
