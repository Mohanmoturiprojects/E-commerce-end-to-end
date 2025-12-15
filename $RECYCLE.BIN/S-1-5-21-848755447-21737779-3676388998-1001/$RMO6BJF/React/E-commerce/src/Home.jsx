import React from 'react';
import GalleryCarousel from './Image';
import { Outlet } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <main className="home-main">
        <section className="home-hero">
        </section>

        {/* Nested routes render below carousel */}
        <div className="outlet-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Home;
