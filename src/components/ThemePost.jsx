import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../store/GlobalStore";
import Loading from "./Loading";
import styles from './Home.module.css';
import { useNavigate } from "react-router-dom";

const ThemePost = () => {
  const navigate = useNavigate();
  const { theme } = useParams(); // Retrieve the theme parameter from URL
  const { loading, setLoading, setPostToShow } = useContext(GlobalContext);
  const [themePosts, setThemePosts] = useState([]);

  // Function to fetch posts based on the theme
  async function fetchThemePost(theme) {
    setLoading(true); // Set loading to true before making API call
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/getThemePosts",
        { theme } // Send theme as part of the request payload
      );
      setThemePosts(response.data.Theme_posts); // Set fetched posts to state
    } catch (error) {
      console.error("Error fetching theme posts:", error); // Log error if API call fails
    } finally {
      setLoading(false); // Set loading to false after API call completes
    }
  }

  // Fetch posts whenever the theme changes
  useEffect(() => {
    fetchThemePost(theme);
  }, [theme]);

  // Handle post item click to navigate to the detailed view
  const handleItemClick = (item) => {
    setPostToShow(item); // Set the selected post to show in the global state
    navigate(`/post/${item._id}`); // Navigate to the detailed post view
  };

  return loading ? (
    <Loading /> // Display loading component while data is being fetched
  ) : (
    <div className="theme_container" style={{ marginTop: '7%' }}>
      <h1>{theme}</h1>
      <div className={styles.posts_container}>
        {themePosts.map((post, index) => (
          <div className={styles.items} key={index}>
            <img src={post.image} alt={post.title} />
            <h3 onClick={() => handleItemClick(post)}>{post.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemePost;
