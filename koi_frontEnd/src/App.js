import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeTemplate from './components/template/HomeTemplate';
import ManageBlogs from './components/ui/shop/ManageBlogs';
import AddBlogs from './components/ui/shop/AddBlogs';
import { PATH } from './constant/config';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeTemplate />}>
          <Route index element={<Home />} />
          <Route path={PATH.MANAGE_BLOG} element={<ManageBlogs />} />
          <Route path={PATH.ADD_BLOG} element={<AddBlogs />} />
          {/* Add other routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
