import {
  FaGem,
  FaHeart,
  FaHandsHelping,
  FaVoteYea,
  FaPaperPlane,
  FaRegComments,
} from 'react-icons/fa';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { WebsiteRights } from '../Footer/FooterElements';
import { Img } from '../InfoSection/InfoElements';
import { NavLogo } from '../Navbar/NavbarElements';

import './index.scss';

const VerticalNavbar = () => {
  return (
    <ProSidebar>
      <SidebarHeader>
        <NavLogo to='/'>
          <Img src={require('../../images/logo-text-white.png')} alt='Logo' />
        </NavLogo>
      </SidebarHeader>
      <SidebarContent>
        <Menu>
          <MenuItem icon={<FaGem />}>Dashboard</MenuItem>
          <MenuItem icon={<FaHeart />}>Help Others</MenuItem>
          <MenuItem icon={<FaPaperPlane />}>messages</MenuItem>
          <MenuItem icon={<FaRegComments />}>Chat Room</MenuItem>
          <MenuItem icon={<FaVoteYea />}>Voting Hub</MenuItem>
          <MenuItem icon={<FaHandsHelping />}>Support Us</MenuItem>
        </Menu>
      </SidebarContent>
      <SidebarFooter>
        <div style={{ margin: '20px' }}>
          <WebsiteRights>
            Wolon<sup> 3.0</sup> © 2022 All rights reserved.
          </WebsiteRights>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default VerticalNavbar;
