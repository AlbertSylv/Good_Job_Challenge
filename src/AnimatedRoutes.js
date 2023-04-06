import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/homePage';
import JobPage from './pages/JobPage';
import LoginPage from './pages/logIn';
import SignupPage from './pages/signUp';
import Leaderboard from './pages/leaderBoard';
import { AnimatePresence } from 'framer-motion';
import baseURL from './baseURL';
import {setCookie} from './setCookie';
import {getCookie} from './getCookie';

function AnimatedRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const checkToken = async (token) => {
    try {
      const response = await fetch(baseURL + '/items/jobs', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        await refreshToken();
      }

    } catch (error) {

      setIsLoggedIn(false);
      

    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    const dataSent = {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "refresh_token": getCookie("refresh_token"),
        "mode": "json"
      })
    };

    try {
      const response = await fetch(baseURL + '/auth/refresh', dataSent);

      if (response.ok) {

        const data = await response.json();

       
        setCookie('refresh_token', data.data.refresh_token, 30);

        setCookie('token', data.data.access_token, 30);
        setIsLoggedIn(true);
      } else {
        //setIsLoggedIn(false);
        throw new Error('Failed to refresh');
      }
    } catch (error) {
      console.error(error);
      //setIsLoggedIn(false);
      navigate("/signup-page", {replace:false})
    }
  }


  useEffect(() => {
    if(window.location.pathname.includes("login-page")||window.location.pathname.includes("signup-page")){

    }else{

      setCookie('lastUrl', window.location.pathname, 30);
    }
    

    const token = getCookie('token');


    async function fetchData() {
      await checkToken(token);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>

            <Route exact path="/" element={<HomePage />} />
            <Route path="/jobPage/:jobs" element={<JobPage />} />

            <Route path="/login-page" element={<LoginPage />} />
            <Route path="/signup-page" element={<SignupPage />} />

            <Route path="/leaderboard" element={<Leaderboard />} />

      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;