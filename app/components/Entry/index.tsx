import React from 'react';
import { Div, Img, Span, Table, Tbody, Td, Th, Thead, Tr } from '../common';
import RightButton from '../common/RightButton';
import Header from '../common/Header';
import TitleBar from '../common/TitleBar';
import IconStatus from '../common/IconStatus';
import getImg from '../../utils/getImg';
import Footer from './Footer';

const Entry = () => {

  let temp = [
    {
      product: 'Air Jordan 1 High',
      account: 'JordanSnkrs@gmail.com',
      size: 9,
      enteredTime: '6:00:02',
      status: 'Didn\'t Get \'Em',
      animation: {
        number: 4,
        color: 'blu'
      }
    },
    {
      product: 'Air Jordan 1 High',
      account: 'JordanSnkrs@gmail.com',
      size: 9,
      enteredTime: '6:00:06',
      status: 'Drawing',
      animation: {
        number: 4,
        color: 'blu'
      }
    },
    {
      product: 'Air Jordan 1 High',
      account: 'JordanSnkrs@gmail.com',
      size: 9,
      enteredTime: '6:00:05',
      status: 'GOT\'EM',
      animation: {
        number: 4,
        color: 'blu'
      }
    }
  ];

  const Content = () => {

    const listItems = temp.map((item, index) => {
      return (
        <Tr key={index.toString()} className="section">
          <Td>
            <Span><Img src={getImg('nike.png')}/></Span>
          </Td>
          <Td>{item.product}</Td>
          <Td>{item.account}</Td>
          <Td>{item.size}</Td>
          <Td>{item.enteredTime}</Td>
          <Td>{item.status}</Td>
          <IconStatus animation={item.animation}/>
          <Td>
           <Span className="pink-txt"> See Settings </Span>
          </Td>
        </Tr>
      )
    });
    return (
      <Div className="j-row">
        <Div className="col-12">
          <Div className="table-responsive">
            <Table className="table table-striped">
              <Thead>
              <Tr>
                <Th></Th>
                <Th>Product</Th>
                <Th>Account</Th>
                <Th>Size</Th>
                <Th>Time Entered</Th>
                <Th>Status</Th>
                <Th></Th>
                <Th>Action</Th>
              </Tr>
              </Thead>
              <Tbody>{listItems}</Tbody>
            </Table>
          </Div>
        </Div>
      </Div>
    )
  }



  return (
    <Div className="j-container-fluid dark-bg h-100">
      <RightButton/>
      <Header/>
      <Div className="j-row">
        <Div className="j-container">
          <TitleBar title={"Entries"} counts={3} accountBox={true}/>
          <Content/>
        </Div>
      </Div>
      <Footer/>
    </Div>
  )
}

export default Entry
