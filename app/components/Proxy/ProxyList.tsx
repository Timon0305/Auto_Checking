import React from 'react';
import { Tr, Td, Icon, Div, Span, Table, Tbody } from '../common';

interface Props {
  profile: any,
  selectedId: string,
  onClickItem: any,
  onClickItemEdit: any,
  onClickItemDelete: any
}

const ProxyList = (props: Props) => {
  const handleClick = (id: string) => {
    if (props.onClickItem) {
      props.onClickItem(id)
    }
  };

  const handleClickDelete = (id: string) => {
    // handleClick(id);
    if (props.onClickItemDelete) {
      props.onClickItemDelete(id)
    }
  };

  const handleClickEdit = (id: string) => {
    // handleClick(id);
    if (props.onClickItemEdit) {
      props.onClickItemEdit(id)
    }
  };

  const TableContent = props.profile.map((item: any, index: number) => {
    return (
      <Tr key={index.toString()} className="section" onClick={() => handleClick(item.id)}>
      {/*<Tr key={index.toString()} className={index == 0 ? 'section active' : 'section disable'}>*/}
        <Td className={item.id === props.selectedId ? ' pink-txt' : ''}>
          <Icon className="fa fa-network-wired"/>
          {item.name}
        </Td>
        <Td>
          <Span>{item.data ? item.data.length : 0}</Span>
        </Td>
        <Td>
          <Icon className="fas fa-pen blu" onClick={() => handleClickEdit(item.id)}/>
          <Icon className="fas fa-trash-alt red-txt" onClick={() => handleClickDelete(item.id)}/>
        </Td>
      </Tr>
    );
  });
  return (
    <Div className="col-4 mt-4 right-border page-content-table">
      <Div className="right-table">
        <Table className="table table-striped">
          <Tbody>
          {TableContent.length ? TableContent :
            <Tr><Td colspan="4" style={{ textAlign: 'center !important' }}>No Proxy</Td></Tr>}
          </Tbody>
        </Table>
      </Div>
    </Div>
  );
};

export default ProxyList;
