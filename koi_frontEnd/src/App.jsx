//import React, { useState } from 'react'
import { Router } from './routes'
import React from 'react';
import {Route, Routes} from "react-router-dom";
import PondManagement from "./components/ui/manage/PondManegement.jsx";
import PondDetail from "./components/ui/manage/PondDetail.jsx";
function App() {

  return (
    <>
      <Router />
        <Routes>
        </Routes>
    </>
  )
}

export default App

