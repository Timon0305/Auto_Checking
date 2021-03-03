import React, { useState, useEffect } from 'react';
import { Div, Table, Tr, Th, Thead, Tbody, Td, Icon } from '../common';
import RightButton from '../common/RightButton';
import TitleBar from '../common/TitleBar';
import Footer from '../common/Footer';
import SideMenu from '../common/SideMenu';
import ProxyList from './ProxyList';
import Controls from './Controls';
import AddModal from './AddModal';
import ImportModal from './ImportModal';
import { get, set, add, update, remove } from '../../utils/Proxies';
import { toast } from 'react-toastify';

const initialProxies: any[] = [];
const initialProxy = {
  id: '',
  name: '',
  data: []
};
const Proxy = () => {

  const [proxyList, setProxyList] = useState(initialProxies);
  const [activeProxyList, setActiveProxyList] = useState(initialProxy);
  const [visibleModal, setVisibleModal] = useState(false);
  const [isEditListMode, setEditListMode] = useState(false);
  const [visibleImportModal, setVisibleImportModal] = useState(false);

  const loadData = async (mode: string = '') => {
    let proxies: any = await get();
    let data: any[] = [];
    Object.keys(proxies).map((key: any) => {
      // @ts-ignore
      data.push(proxies[key]);
    });
    setProxyList(data);
    if (data.length) {
      if (mode == '') {
        setActiveProxyList(data[0]);
      } else if (mode == 'create') {
        setActiveProxyList(data[data.length - 1]);
      } else if (mode == 'delete') {
        setActiveProxyList(data[0]);
      } else {
        const item = data.find((e: any) => e.id == activeProxyList.id);
        if (item) {
          setActiveProxyList(item);
        }
      }
      if (mode && mode != '') {
        toast.dark(`Successfully ${mode}d...`, {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      setActiveProxyList(initialProxy);
    }
  };

  const createOrUpdateList = async (payload: any) => {
    const { id, name, data } = payload;

    if (id) {
      let item = proxyList.find((e: any) => e.id == id);
      if (item) {
        item.name = name;
        item.data = data;
        await update(item);
        await loadData('update');
      }
    } else {
      await add({ id: '', name, data: [] });
      await loadData('create');
    }
    setVisibleModal(false);
  };

  const deleteList = async (id: string) => {
    console.log('deleteList', id);
    const item = proxyList.find((e: any) => e.id == id);
    if (item) {
      await remove(item);
      await loadData('delete');
    }
  };

  const deleteAll = async () => {
    await set({});
    await loadData('');
  };

  const importData = async (payload: any) => {
    const { id } = payload;
    console.log('import', payload);
    if (id) {
      await update(payload);
      await loadData('update');
    }
    setVisibleImportModal(false);
  };

  const clearData = async () => {
    console.log('clear');
    if (activeProxyList) {
      activeProxyList.data = [];
      await update(activeProxyList);
      await loadData('update');
    }
  };

  const removeOneData = async (index: number) => {
    console.log('remove a proxy', index);
    if (activeProxyList) {
      activeProxyList.data.splice(index, 1);
      await update(activeProxyList);
      await loadData('update');
    }
  };

  const handleClickListItem = (id: string) => {
    let item = proxyList.find((e: any) => e.id === id);
    if (item) {
      setActiveProxyList(item);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const TableContent = () => {
    const Content = activeProxyList.data ? activeProxyList.data.map((item: string, index: number) => {
      const temp = item.split(':');
      return (
        <Tr key={index.toString()}>
          <Td>{temp[0]}</Td>
          <Td>{temp[1]}</Td>
          <Td>{temp[2] || ''}</Td>
          <Td>{temp[3] || ''}</Td>
          <Td><Icon className="fas fa-trash-alt red-txt" onClick={() => removeOneData(index)}/> </Td>
        </Tr>
      );
    }) : <Tr>
    </Tr>;

    return (
      <Tbody>
      {Content}
      </Tbody>
    );
  };


  return (
    <Div className="j-container-fluid d-flex h-100">
      <RightButton/>
      <SideMenu/>
      {visibleModal &&
      <AddModal modalOpen={visibleModal} setIsOpen={setVisibleModal} onOK={createOrUpdateList}
                initialValue={isEditListMode ? activeProxyList : { name: '', data: [] }}/>
      }
      {visibleImportModal &&
      <ImportModal modalOpen={visibleImportModal} setIsOpen={setVisibleImportModal} onOK={importData}
                   initialValue={activeProxyList}/>
      }
      <Div className="page-container">
        {activeProxyList && <Div className="col-12">
          <TitleBar title={'Proxies'} counts={proxyList.length} accountBox={true}/>
          <Controls create={() => {
            setVisibleModal(true);
            setEditListMode(false);
          }} delete={deleteAll} import={() => {
            setVisibleImportModal(true);
          }} clear={clearData}
                    profile={activeProxyList.name}/>
          <Div className="space-between round-card">
            <ProxyList profile={proxyList} selectedId={activeProxyList.id} onClickItem={handleClickListItem}
                       onClickItemEdit={() => {
                         setVisibleModal(true);
                         setEditListMode(true);
                       }}
                       onClickItemDelete={deleteList}/>
            <Div className="col-8 page-content-table">
              <Div className="table-responsive">
                <Table className="table table-striped">
                  <Thead>
                  <Tr>
                    <Th style={{ paddingTop: 20 }}>Host</Th>
                    <Th>Port</Th>
                    <Th>Username</Th>
                    <Th>Password</Th>
                    <Th>Action</Th>
                  </Tr>
                  </Thead>
                  <TableContent/>
                </Table>
              </Div>
            </Div>
          </Div>
        </Div>}
      </Div>
      <Footer/>
    </Div>
  );
};

export default Proxy;
