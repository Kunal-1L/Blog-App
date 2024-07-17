import React, { useContext } from "react";
import { GlobalContext } from "../store/GlobalStore";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  // Use GlobalContext to access loginId and setLoginId function
  const { loginId, setLoginId } = useContext(GlobalContext);
  const navigate = useNavigate();

  // Handle logout click
  const handleLogOutClick = () => {
    setLoginId(''); // Clear loginId in global state
    sessionStorage.clear(); // Clear session storage
    alert('Log Out Successfully'); // Show logout alert
    navigate('/'); // Navigate to home page
  };

  // Handle "My Posts" click
  const handleClick1 = (e) => {
    if (loginId === '') { // If user is not logged in
      e.preventDefault(); // Prevent default action
      alert("Please Login First..."); // Show login alert
      navigate('/login'); // Navigate to login page
    }
  };

  // Handle "Create Post" click
  const handleClick2 = (e) => {
    if (loginId === '') { // If user is not logged in
      e.preventDefault(); // Prevent default action
      alert("Please Login First..."); // Show login alert
      navigate('/login'); // Navigate to login page
    }
  };

  return (
    <header className="p-3 text-bg-dark" style={{ position: "fixed", top: "0", left: "0", width: "100%", zIndex: "1000" }}>
      <div className="container" style={{ position: 'static', width: '100%', zIndex: 100 }}>
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link px-2 ${isActive ? "text-secondary" : "text-white"}`}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/my-posts"
                className={({ isActive }) => `nav-link px-2 ${isActive ? "text-secondary" : "text-white"}`}
                onClick={handleClick1} // Add click handler to check login status
              >
                My Posts
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/create-post"
                className={({ isActive }) => `nav-link px-2 ${isActive ? "text-secondary" : "text-white"}`}
                onClick={handleClick2} // Add click handler to check login status
              >
                Create Post
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => `nav-link px-2 ${isActive ? "text-secondary" : "text-white"}`}
              >
                About
              </NavLink>
            </li>
          </ul>

          <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
            <input
              type="search"
              className="form-control form-control-dark text-bg-dark"
              placeholder="Search..."
              style={{ width: "300px" }}
              aria-label="Search"
            />
          </form>
          {loginId === '' ? (
            <div className="text-end">
              <button
                type="button"
                className="btn btn-outline-light me-2"
                onClick={() => navigate("/login")} // Navigate to login page
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => navigate("/signup")} // Navigate to signup page
              >
                Sign-up
              </button>
            </div>
          ) : (
            <div className="text-end">
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleLogOutClick} // Handle logout click
              >
                LogOut
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
