import React from 'react';
import SignIn from '../components/SignIn';
import { Container } from '../components/SignIn/SigninElements';

function Dashboard() {
  return (
    <div style={{ height: '100vh' }}>
      <SignIn />
    </div>
  );
}

export default Dashboard;
