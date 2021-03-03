import React from 'react';
import { Div, Table, Tr, Td, Span, Img, Th, Thead, Tbody, Icon } from '../common';
import TitleBar from '../common/TitleBar';
import Controls from './Controls';
import RightButton from '../common/RightButton';
import getImg from '../../utils/getImg';
// import Header from '../common/Header';
// import IconStatus from '../common/IconStatus';

import AddTaskModal from './AddTaskModal';
import SideMenu from '../common/SideMenu';
import Footer from '../common/Footer';

import useViewModel from './ViewModel';

const Task = () => {
  const vm = useViewModel();

  const filteredTasks = vm.filterTasks(vm.keyword);

  const Content = () => {
    const listItems = filteredTasks.map((item: any, index: number) => {
      return (
        <Tr key={index.toString()} className="section">
          <Td>{item.name}</Td>
          <Td>
            {item.account && <Span><Img src={getImg(item.account.name.toLowerCase() + '.ico')} height={12}/></Span>}&nbsp;
            {item.account ? item.account.name : 'Invalid'}
          </Td>
          <Td>{item.account ? item.productUrl.split(item.account.baseUrl)[1] : item.productUrl}</Td>
          <Td>{item.quantity}</Td>
          <Td>{item.profile ? item.profile.name : 'Invalid'}</Td>
          <Td>{item.profile ? item.proxy.name : 'Invalid'}</Td>
          <Td className={item.status.color + '-txt'}>{item.status.title}</Td>
          {/*<IconStatus animation={item.animation}/>*/}
          <Td>
            {item.status.title == 'Ready' || item.status.color == 'red' ?
              <Icon className="fas fa-play green" onClick={() => vm.startTask(item)}/>
              :
              <Icon className="fas fa-stop red-txt" onClick={() => vm.stopTask(item)}/>
            }
            {item.status.title == 'Ready' || item.status.color == 'red' ?
              <Icon className="fas fa-edit pink" onClick={() => vm.handleEdit(item)}/>
              :
              <Icon className="fas fa-edit" disabled/>
            }
            {item.status.title == 'Ready' || item.status.color == 'red' ?
              <Icon className="fas fa-trash-alt red-txt" onClick={() => vm.deleteTask(item)}/>
              :
              <Icon className="fas fa-trash-alt" disabled/>
            }
          </Td>
        </Tr>
      );
    });
    return (
      <Div className="page-container">
        <Div className="col-12">
          <TitleBar title={'Tasks'} counts={filteredTasks.length} accountBox={true}/>

          <Controls _keyword={vm.keyword} _applyKeyword={vm.setKeyword} _addModal={vm.handleCreate}
                    _delete_all_tasks={vm.deleteAllTasks} _start_all_tasks={vm.startAllTasks}
                    _stop_all_tasks={vm.stopAllTasks}/>
          <Div className="round-card page-content table-responsive padding-20">
            <Table className="table table-striped">
              <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Site</Th>
                <Th>Product URL</Th>
                <Th>Qty</Th>
                <Th>Profile</Th>
                <Th>Proxy</Th>
                <Th>Status</Th>
                {/*<Th></Th>*/}
                <Th>Action</Th>
              </Tr>
              </Thead>
              <Tbody>{listItems}</Tbody>
            </Table>
          </Div>
        </Div>
      </Div>
    );
  };


  return (
    <Div className="j-container-fluid h-100 d-flex">
      {
        vm.visibleAddModal &&
        <AddTaskModal initial={vm.activeTask} modalOpen={vm.visibleAddModal} setIsOpen={vm.setVisibleAddModal}
                      onOK={ vm.activeTask.id ? vm.updateTask : vm.createTask}
                      accounts={vm.accounts} profiles={vm.profiles} proxies={vm.proxies}/>
      }
      <RightButton/>
      <SideMenu/>
      {/*<Header/>*/}
      <Content/>
      <Footer/>
    </Div>
  );
};

export default Task;
