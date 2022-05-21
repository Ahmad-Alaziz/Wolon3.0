import React, { useState } from 'react';
import SignIn from '../components/SignIn';
import ScrollToTop from '../components/ScrollToTop';
import { Sidebar } from 'semantic-ui-react';
import Navbar from '../components/Navbar';
import VerticalNavbar from '../components/VerticalNavBar';

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <VerticalNavbar />
    </>
  );
}

export default Dashboard;
