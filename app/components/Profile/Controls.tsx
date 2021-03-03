import React from 'react';
import { Button, Div, Icon, Span } from '../common';

interface Props {
  create: any,
  delete: any,
  profile: any,
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
          <Button className="delete-pro-btn"><Icon className="fas fa-trash-alt"/></Button>
          <Span>Delete All</Span>
        </Div>
      </Div>
      <Div className="col-8 flex-align-right">
        {props.profile &&<Span>{props.profile}</Span>}
      </Div>
    </Div>
  )

}

export default Controls;
