import React from 'react';
import { Div, Icon, Button, Span, Textbox } from '../common';


interface Props {
  _addModal: any,
  _delete_all_tasks : any,
  _start_all_tasks: any,
  _stop_all_tasks: any,
  _keyword: string,
  _applyKeyword: any,
}

const Controls = ({_addModal, _delete_all_tasks, _start_all_tasks, _stop_all_tasks, _keyword, _applyKeyword }: Props) => {

  const handleBlur = (e: any) => {
    if (_applyKeyword)
      _applyKeyword(e.target.value);
  };

  return (
    <Div className="flex-align-center space-between controls">
      <Div className="col-5 flex-align-left j-row">
        <Div className="search-box">
          <Button type="submit" className="corner">
            <Icon className="fa fa-search"/>
          </Button>
          <Textbox type="text" className="form-control pl" placeholder="Search" defaultValue={_keyword} onBlur={handleBlur}/>
        </Div>
      </Div>
      <Div className="col-7 flex-align-right">
        <Div className="add-task button" onClick={() => _addModal()}>
          <Button className="plus-btn"><Icon className="fas fa-plus"/></Button>
          <Span>Create</Span>
        </Div>
        <Div className="delete-task button" onClick={() => _delete_all_tasks()}>
          <Button className="delete-btn"><Icon className="fas fa-trash-alt"/></Button>
          <Span>Delete All</Span>
        </Div>
        <Div className="start-task button" onClick={() => _start_all_tasks}>
          <Button className="play-btn"><i className="fas fa-play"/></Button>
          <Span>Start All</Span>
        </Div>
        <Div className="pause-task button" onClick={() => _stop_all_tasks}>
          <Button className="pause-btn"><i className="fas fa-stop"/></Button>
          <Span>Stop All</Span>
        </Div>
      </Div>
    </Div>
  )
}

export default Controls;
