import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const userEmailIdRef = useRef(null);
  const userPasswordRef = useRef(null);
  const userContactRef = useRef(null);
  const navigate = useNavigate(); // Hook from react-router-dom for navigation

  // Function to handle sign-up request
  async function handleSignUpRequest(user) {
    try {
      const response = await axios.post("http://127.0.0.1:5000/signUp", user);

      if (response.status === 200) {
        alert(response.data.message); // Display success message
        navigate("/login"); // Redirect to login page on successful signup
      } else {
        alert(response.data.message); // Display error message
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      alert("An error occurred while signing up."); // Alert user about the error
    }
  }

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Retrieve input field values
    const userEmailId = userEmailIdRef.current.value;
    const userPassword = userPasswordRef.current.value;
    const userContact = userContactRef.current.value;

    // Call function to handle sign-up request
    handleSignUpRequest({ userEmailId, userPassword, userContact });

    // Clear the input fields after submission
    userEmailIdRef.current.value = "";
    userPasswordRef.current.value = "";
    userContactRef.current.value = "";
  };

  return (
    <div
      style={{
        width: "80%",
        height: "450px",
        margin: "10%",
        border: "2px solid",
        borderColor: "rgb(211, 211, 211)",
        borderRadius: "5px",
      }}
    >
      <div
        className="bd-example border-0"
        style={{ width: "40%", marginLeft: "30%", padding: "50px" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="inputEmail" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="inputEmail"
              ref={userEmailIdRef}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputContact" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              className="form-control"
              pattern="[0-9]{10}"
              id="inputContact"
              ref={userContactRef}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputPassword" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              ref={userPasswordRef}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
          <br />
          <div style={{ float: "right" }}>
            Already have an account? <br />
            <button
              type="button"
              className="btn btn-secondary"
              style={{ opacity: "0.8", float: "right" }}
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
