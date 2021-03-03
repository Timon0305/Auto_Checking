import React from 'react';
import { Div, Icon, Button, Span } from './index';

interface Props {

  title: string,
  counts: number,
  accountBox: boolean
}

const TitleBar = ({ title, counts, accountBox }: Props) => {

  return (
    <Div className="j-row search-row">
      <Div className="col-12 flex-align-left my-40 space-between">
        <Div className="task-count">
          <h4>{title} : <Span>{counts}</Span></h4>
        </Div>
        {
          accountBox ?
            <Div>
              <Button className="title-account">
                <Icon className="fas fa-user"/>
              </Button>
              <Span>User#1234</Span>&nbsp;
            </Div>
            : ''
        }
      </Div>
    </Div>
  );
};

export default TitleBar;
