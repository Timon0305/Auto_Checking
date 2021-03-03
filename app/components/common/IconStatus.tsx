import React from 'react';
import { Span, Td } from './index';

const IconStatus = (props: any) => {
  let number = [0, 1, 2, 4];
  const Icon = number.map((_item , index) =>{
    if(index <= props.animation.number) {
      return (<Span key={index.toString()} className={'small-rec ' + props.animation.color}/>);
    }
    else {
      return (
        <Span key={index.toString()} className="small-rec"/>
      );
    }
  }
  );

  return (
    <Td>{Icon}</Td>
  );
};

export default IconStatus;
