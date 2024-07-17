import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../store/GlobalStore";
import axios from "axios";
import styles from "./PostDetail.module.css";
import { AiFillLike } from "react-icons/ai"; // Removed unused import AiFillDislike as it's not used

const PostDetails = () => {
  // Destructure context values and functions needed from GlobalContext
  const {
    postToShow,
    setPostToShow,
    currentPostList,
    setCurrentPostList,
    loginId,
    updateLikes,
    flag,
    setFlag,
  } = useContext(GlobalContext);

  // State for storing description and author info
  const [description, setDescription] = useState({
    author: { name: "" },
    description: "",
  });

  // Loading state to manage loading indicator
  const [loading, setLoading] = useState(false);

  // Fetching post ID from URL params
  const { id } = useParams();

  // Effect to fetch and set post details when ID changes
  useEffect(() => {
    // Retrieve stored posts from session storage
    const storedPosts = JSON.parse(sessionStorage.getItem("currentPostList"));

    // Update currentPostList from stored data if empty
    if (currentPostList.length === 0 && storedPosts) {
      setCurrentPostList(storedPosts);
    }

    // Use stored posts or currentPostList for finding the post by ID
    const posts = currentPostList.length > 0 ? currentPostList : storedPosts;
    if (posts) {
      const post = posts.find((post) => post._id === id);
      if (post) {
        setPostToShow(post); // Set the post to show based on ID
      }
    }
  }, [id]); // Depend on ID change

  // Effect to fetch description and check liked status when loginId or ID changes
  useEffect(() => {
    if (postToShow) {
      // Function to asynchronously fetch description and liked status
      const getDescription = async () => {
        setLoading(true); // Set loading state to true while fetching

        try {
          // Fetch description for the post
          const response = await axios.post(
            "http://127.0.0.1:5000/getDescription",
            { loginId, postId: id }
          );
          setDescription(response.data.description); // Set fetched description

          // Check liked status if logged in
          if (loginId) {
            const flagStatus = await axios.post(
              "http://127.0.0.1:5000/checkLikedStatus",
              { loginId, postId: id }
            );
            setFlag(flagStatus.data.message); // Set liked flag based on response
          }
        } catch (error) {
          alert(error.message); // Display error message if fetch fails
        } finally {
          setLoading(false); // Set loading state to false after fetch completes
        }
      };

      getDescription(); // Call function to fetch description and liked status
    }
  }, [loginId, id]); // Depend on loginId or ID change

  // Render loading indicator if postToShow is not available yet
  if (!postToShow) {
    return <div>No Posts available</div>;
  }

  // Handle click on like/dislike button
  const handleClick = async (likeFlag) => {
    updateLikes(postToShow._id, likeFlag); // Update likes based on likeFlag parameter
  };

  // Render post details once loaded
  return (
    <div className={styles.blog_post}>
      <h1 className={styles.post_title}>{postToShow.title}</h1>
      <img
        src={postToShow.image}
        alt="Not Available"
        className={styles.post_image}
      ></img>
      {loading ? (
        <p>Loading description...</p>
      ) : (
        <>
          <div>
            <strong>Author</strong>: {description.author.name}
            <br></br>
            <strong>Liked</strong>{" "}
            {/* Render like button with conditional styling based on flag */}
            {loginId && loginId !== description.author.id ? (
              <AiFillLike
                style={{
                  color: "blue",
                  fontSize: "24px",
                  border: flag ? "2px solid green" : "2px solid red",
                  padding: "4px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() => handleClick(flag)}
              />
            ) : (
              <AiFillLike
                style={{
                  color: "blue",
                  fontSize: "24px",
                  cursor: "pointer",
                  marginRight: "5px",
                }}
                onClick={() => loginId === "" && alert("Please Login First...")}
              />
            )}{" "}
            <strong>by</strong> {postToShow.likes} <strong>people</strong>
          </div>
          <div
            className={styles.post_description}
            dangerouslySetInnerHTML={{ __html: description.description }}
          />
        </>
      )}
    </div>
  );
};

export default PostDetails;
