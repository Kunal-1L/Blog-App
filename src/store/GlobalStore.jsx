import axios from "axios";
import React, { useState, useEffect } from "react";

// Create a new context instance
export const GlobalContext = React.createContext(null);

const GlobalState = ({ children }) => {
  // State variables using useState hooks
  const [currentTab, setCurrentTab] = useState("Home"); // Current active tab
  const [loginId, setLoginId] = useState(
    () => sessionStorage.getItem("loginId") || ""
  ); // User's login ID stored in session storage
  const [currentPostList, setCurrentPostList] = useState([]); // List of current posts
  const [newPost, setNewPost] = useState(""); // State to manage new post content
  const [postToShow, setPostToShow] = useState(null); // Current post to display details
  const [flag, setFlag] = useState(1); // Flag for managing likes/dislikes
  const [loading, setLoading] = useState(false); // Loading state indicator

  // Effect to update sessionStorage whenever loginId changes
  useEffect(() => {
    sessionStorage.setItem("loginId", loginId);
  }, [loginId]);

  // Function to update likes for a specific post
  const updateLikes = async (id, likedFlag) => {
    try {
      // Send a POST request to update likes on the server
      const response = await axios.post("http://127.0.0.1:5000/updateLikes", {
        postId: id,
        newLikes: likedFlag ? postToShow.likes + 1 : postToShow.likes - 1,
        flag,
        loginId,
      });

      // Create a new post object with updated likes
      const updatedPost = {
        ...postToShow,
        likes: flag ? postToShow.likes + 1 : postToShow.likes - 1,
      };

      // Update the `postToShow` state with the new object
      setPostToShow(updatedPost);

      // Toggle the flag state to update like status
      setFlag(!likedFlag);
    } catch (error) {
      console.log(error); // Log any errors that occur during the update
    }
  };

  // Provide the state and functions to the entire application through context
  return (
    <GlobalContext.Provider
      value={{
        newPost,
        setNewPost,
        updateLikes,
        currentTab,
        postToShow,
        setPostToShow,
        setCurrentTab,
        loginId,
        setLoginId,
        currentPostList,
        setCurrentPostList,
        flag,
        setFlag,
        loading,
        setLoading,
      }}
    >
      {children} {/* Render the child components wrapped in the provider */}
    </GlobalContext.Provider>
  );
};

export default GlobalState; // Export the GlobalState component as default
