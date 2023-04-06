import React, { useState, useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";
import './App.css';
import AnimatedRoutes from './AnimatedRoutes';


const App = () => {

  
  return (
    <>
      <BrowserRouter>
        <AnimatedRoutes/>
      </BrowserRouter>
    </>
  );
};

export default App;

