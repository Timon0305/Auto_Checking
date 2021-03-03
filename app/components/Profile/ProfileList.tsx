import React from 'react';
import { Tr, Td, Icon, Div, Table, Tbody } from '../common';

interface Props {
  profiles: any,
  selectedId: string,
  onClickItem: any,
  onClickItemEdit: any,
  onClickItemDelete: any,
}

const ProfileList = (props: Props) => {
  const { profiles, selectedId, onClickItem, onClickItemEdit, onClickItemDelete } = props;

  const handleClick = (id: string) => {
    if (onClickItem) {
      onClickItem(id);
    }
  };

  const handleClickEdit = (id: string) => {
    if (onClickItemEdit) {
      onClickItemEdit(id);
    }
  };

  const handleClickDelete = (id: string) => {
    if (onClickItemDelete) {
      onClickItemDelete(id);
    }
  };

  const TableContent = profiles.map((item: any, index: number) => {
    return (
      <Tr key={index.toString()} className="section" onClick={() => handleClick(item.id)}>
        {/*<Tr key={index.toString()} className={index == 0 ? 'section active' : 'section disable'}>*/}
        <Td className={item.id === selectedId ? ' pink-txt' : ''}>
          <Icon className="fa fa-address-card"/>
          {item.name}
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

export default ProfileList;
