import React, { useState } from "react";
import '../App.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion ,useIsPresent} from 'framer-motion';
import baseURL from "../baseURL";
import { setCookie } from "../setCookie";
import { getCookie } from "../getCookie";

const LoginPage = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const isPresent = useIsPresent();
  const [home,setHome] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setHome(true);
  
      try {
        const response = await fetch(baseURL + '/auth/login', {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
  
        if (response.ok) {
          const data = await response.json();
          const user = await getCurrentUser(data.data.access_token);
          const userId = user.data.id;
          setCookie("userId", userId, 30);

          setCookie('refresh_token',data.data.refresh_token, 30);
          setCookie('token',data.data.access_token, 30);
          if(getCookie("lastURL")){
            navigate(getCookie("lastURL"), {replace: false});
          }else{
            navigate('/', { replace: false });
          }
          
        } else {
          throw new Error('Failed to log in');
        }
      } catch (error) {
        console.error(error);
        alert("Sorry, it seems an error happened during your login. Please try again or sign up with a working email.")
      }
  };

  const getCurrentUser = async (token) => {
    try {
      const response = await fetch(baseURL + '/users/me', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Failed to get current user');
      }
    } catch (error) {
      console.error(error);
    }
  
  }



  return (
    <div style={{backgroundColor:"#FFF181"}}>
    <motion.div className="login-page"  >
      <h1>Login</h1>
      <form className="login-form">

        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />

        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <div style={{justifyContent:"center"}} className="button-container">
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
        </div>
        </form>
        <div style={{justifyContent:"center", marginTop:40}} className="button-container">
          <Link to={{pathname:"/signup-page"}}>
            Sign Up
          </Link>
        </div>
        <motion.div
          initial={{ scaleX: -1}}
          animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
          exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
          style={{ originX: home? (isPresent ? 0 : 1 ) : (isPresent ? 1 : 0 )}}
          className="privacy-screen"
        />      
    </motion.div>
    </div>
  );
};

export default LoginPage;