import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { motion, useIsPresent } from "framer-motion";
import baseURL from "../baseURL";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const isPresent = useIsPresent();
  const createUser = async (name, mail, pw) => {
    try {
      const userRole = "cdfae04d-de29-4c50-898b-566240493979";

      const requestOptions = {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: name,
          email: mail,
          password: pw,
          role: userRole,
        }),
      };

      fetch(baseURL + "/users", requestOptions)
        .then(async (response) => {
          const isJson = response.headers
            .get("content-type")
            ?.includes("application/json");
          const data = isJson && (await response.json());

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }

          navigate("/login-page", { replace: false });
        })
        .catch((error) => {
          this.setState({ errorMessage: error.toString() });
          console.error("There was an error!", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSignup = (event) => {
    event.preventDefault();
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (email.match(isValidEmail) && name !== "") {
      createUser(name, email, password);
    } else {
      alert("Error please fill in all input fields and use a valid email");
    }
  };

  return (
    <div style={{ backgroundColor: "#FFF181" }}>
      <motion.div className="signup-page">
        <h1>Sign Up</h1>
        <form className="signup-form">
          <input
            type="name"
            id="name"
            placeholder="Username"
            value={name}
            onChange={handleNameChange}
          />

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
          <div className="signup-button-container">
            <button className="signup-button" onClick={handleSignup}>
              Sign Up
            </button>
          </div>
        </form>
        <div style={{ marginTop: 50 }}>Already have a login?</div>
        <div style={{ justifyContent: "center", marginTop: 20 }}>
          <Link to={{ pathname: "/login-page" }} style={{ marginTop: 20 }}>
            Login
          </Link>
        </div>
        <motion.div
          initial={{ scaleX: -1 }}
          animate={{
            scaleX: 0,
            transition: { duration: 0.5, ease: "circOut" },
          }}
          exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
          style={{ originX: isPresent ? 0 : 1 }}
          className="privacy-screen"
        />
      </motion.div>
    </div>
  );
};

export default SignupPage;
