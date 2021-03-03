import React from 'react';
import { Tr, Td, Div, Table, Tbody, Img } from '../common';
import getImg from '../../utils/getImg';

const SiteList = (props: any) => {

  const TableContent = props.profile.map((item: any, index: number) => {
    return (
      <Tr key={index.toString()} className="section">
        {/*<Tr key={index.toString()} className={index == 0 ? 'section active' : 'section disable'}>*/}
        <Td className={item.id === props.selectedId ? ' pink-txt' : ''} onClick={() => props.onClickItem(item.id)}>
          <Img src={getImg(item.name.toLowerCase() + '.ico')} alt="" className="img-fluid" style={{ height: '12px' }}/>
          &nbsp;&nbsp;&nbsp;
          {item.name}
        </Td>
        <Td>
          {/*<Span style={{fontSize: 9, color: '#fff'}}>{item.baseUrl}</Span>*/}
        </Td>
      </Tr>
    );
  });
  return (
    <Div className="col-4 mt-4 right-border page-content-table">
      <Div className="right-table table-responsive">
        <Table className="table table-striped">
          <Tbody>
          {TableContent.length ? TableContent :
            <Tr><Td colspan="4" style={{ textAlign: 'center !important' }}>No Profile</Td></Tr>}
          </Tbody>
        </Table>
      </Div>
    </Div>
  );
};

export default SiteList;
