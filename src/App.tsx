import { useState, memo } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { InitialSplashLoader } from './components/ui/loader-4';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <InitialSplashLoader onComplete={handleSplashComplete} />}
      <ScrollToTop />
      <Navbar />
      <Sidebar />
      <div className="lg:ml-[220px] min-h-screen flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default memo(App);
