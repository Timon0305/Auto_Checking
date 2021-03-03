import React from 'react';
import { Div, Li, Ul, NavItem, /*Span,*/ Icon, Img } from './index';
import routes from '../../constants/routes.json';
import { useHistory, useLocation } from 'react-router';
import getImg from '../../utils/getImg';

const SideMenu = () => {

  const history = useHistory();
  const location = useLocation();

  const onPanelClick = (type: string) => {
    history.push(type);
  };

  return (
    <Div className="side-menu">
      <Img src={getImg('logo.png')} alt="" className="img-fluid logo-img" onClick={() => onPanelClick(routes.TASK)}/>

      <Ul className="menu">
        <Li onClick={() => onPanelClick(routes.TASK)}><NavItem
          className={location.pathname == routes.TASK || location.pathname == routes.HOME? 'active' : ''}><Icon className="fa fa-tasks"/>Tasks</NavItem></Li>
        <Li onClick={() => onPanelClick(routes.PROFILE)}><NavItem
          className={location.pathname == routes.PROFILE ? 'active' : ''}><Icon className="fa fa-address-card"/>Profiles</NavItem></Li>
        <Li onClick={() => onPanelClick(routes.PROXY)}><NavItem
          className={location.pathname == routes.PROXY ? 'active' : ''}><Icon className="fa fa-network-wired"/>Proxies</NavItem></Li>
        <Li onClick={() => onPanelClick(routes.ACCOUNT)}><NavItem
          className={location.pathname == routes.ACCOUNT ? 'active' : ''}><Icon className="fa fa-user"/>Accounts</NavItem></Li>
        <Li onClick={() => onPanelClick(routes.SETTING)}><NavItem
          className={location.pathname == routes.SETTING ? 'active' : ''}><Icon className="fa fa-address-book"/>Setting</NavItem></Li>
        {/*<Li onClick={() => onPanelClick(routes.ENTRY)}><NavItem*/}
          {/*className={location.pathname == routes.ENTRY ? 'active' : ''}>Entries</NavItem>*/}
          {/*<Span className="pink-dot"><Icon className="fas fa-circle"/></Span>*/}
        {/*</Li>*/}
      </Ul>
    </Div>
  );
};

export default SideMenu;

