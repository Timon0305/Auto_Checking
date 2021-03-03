import React from 'react';
import getImg from '../../utils/getImg';
import {Div, Img, Li, Ul, NavItem, Span, Icon } from './index';
import routes from '../../constants/routes.json';
import { useHistory, useLocation } from 'react-router';

const Header = () => {

  const history = useHistory();
  const location = useLocation();

  const onPanelClick = (type: string) => {
    history.push(type);
  }

  return (
      <Div className="j-row light-grey-bg">
        <Div className="drag-region"/>
        <Div className="j-container">
          <Div className="j-row">
            <Div className="col-12 flex-align-center header">
              <Img src={getImg('logo.png')} alt="" className="img-fluid logo-img" onClick={() => onPanelClick(routes.TASK)}/>
              <Ul className="nav">
                <Li onClick={() => onPanelClick(routes.TASK)}><NavItem className={location.pathname == routes.TASK ? 'active' : ''}>Tasks</NavItem></Li>
                <Li onClick={() => onPanelClick(routes.PROFILE)}><NavItem className={location.pathname == routes.PROFILE ? 'active' : ''}>Profiles</NavItem></Li>
                <Li onClick={() => onPanelClick(routes.ACCOUNT)}><NavItem className={location.pathname == routes.ACCOUNT ? 'active' : ''}>Accounts</NavItem></Li>
                <Li onClick={() => onPanelClick(routes.PROXY)}><NavItem className={location.pathname == routes.PROXY ? 'active' : ''}>Proxies</NavItem></Li>
                <Li onClick={() => onPanelClick(routes.SETTING)}><NavItem className={location.pathname == routes.SETTING ? 'active' : ''}>Setting</NavItem></Li>
                <Li onClick={() => onPanelClick(routes.ENTRY)}><NavItem className={location.pathname == routes.ENTRY ? 'active' : ''}>Entries</NavItem>
                  <Span className="pink-dot"><Icon className="fas fa-circle"/></Span>
                </Li>
              </Ul>
            </Div>
          </Div>
        </Div>
      </Div>
  )
}

export default Header;

