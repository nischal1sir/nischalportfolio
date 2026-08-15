import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/footer';

const App = () => {
  return (
    <>
      <Sidebar />
      <div className="lg:ml-[200px] min-h-screen py-6">
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default memo(App);