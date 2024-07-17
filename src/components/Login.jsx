import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { GlobalContext } from "../store/GlobalStore";

const Login = () => {
  // Access the loginId and setLoginId functions from the GlobalContext
  const { loginId, setLoginId } = useContext(GlobalContext);

  // Create references for the email and password input fields
  const userEmailIdRef = useRef(null);
  const userPasswordRef = useRef(null);

  // Initialize useNavigate for programmatic navigation
  const navigate = useNavigate();

  // Function to handle the login request
  async function handleLoginRequest(user) {
    try {
      // Send a POST request to the backend login endpoint
      const response = await axios.post("http://127.0.0.1:5000/login", user);

      if (response.status === 200) {
        alert(response.data.message); // Display success message
        setLoginId(user.userEmailId); // Update the loginId in the global state
        navigate("/"); // Navigate to the home page
      } else {
        alert(response.data.message); // Display error message if login fails
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      alert("An error occurred while signing up."); // Display a generic error message
    }
  }

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const userEmailId = userEmailIdRef.current.value; // Get the value of the email input
    const userPassword = userPasswordRef.current.value; // Get the value of the password input

    handleLoginRequest({ userEmailId, userPassword }); // Call the login request function with the user data

    // Clear the input fields
    userEmailIdRef.current.value = '';
    userPasswordRef.current.value = '';
  };

  return (
    <div style={{ width: '80%', height: '350px', margin: '10%', border: '2px solid', borderColor: 'rgb(211, 211, 211)', borderRadius: '5px' }}>
      <div className="bd-example border-0" style={{ width: '40%', marginLeft: '30%', padding: '50px' }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="inputEmail"
              ref={userEmailIdRef}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              ref={userPasswordRef}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button><br />
          <div style={{ float: 'right' }}>
            Don't have an account?<br />
            <button type="button" className="btn btn-primary" style={{ opacity: '0.8', float: 'right' }}>Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
