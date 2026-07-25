import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import './AppLayout.css';

const AppLayout = ({ children }) => {
  return (
    <div className="app-layout-root">
      <Sidebar />
      <div className="app-main-viewport">
        <Header />
        <main className="app-content-body">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default AppLayout;
