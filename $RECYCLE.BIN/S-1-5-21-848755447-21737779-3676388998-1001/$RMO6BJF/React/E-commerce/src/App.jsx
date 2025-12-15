import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './Header'; // Keep Header outside Routes
import Home from './Home';
import Electronics from './electronics';
import Mobiles from './mobiles';
import Laptop from './laptop';
import Smarttv from './smarttv';

function App() {
  return (
    <Router>
      {/* Header stays visible on all pages */}
      <Header />

      <Routes>
        {/* Home is parent route */}
        <Route path="/" element={<Home />}>
          {/* Nested electronics routes inside Home */}
          <Route path="electronics" element={<Electronics />}>
            <Route index element={<Mobiles />} />       {/* Default child */}
            <Route path="mobiles" element={<Mobiles />} />
            <Route path="laptop" element={<Laptop />} />
            <Route path="smarttv" element={<Smarttv />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
