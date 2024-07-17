import axios from "axios"; // Import axios for making HTTP requests
import { useState, useEffect, useContext } from "react"; // Import hooks from React
import styles from './Home.module.css' // Import CSS module for styling
import { useNavigate } from "react-router-dom"; // Import useNavigate hook from react-router-dom for navigation
import { GlobalContext } from "../store/GlobalStore"; // Import GlobalContext from GlobalStore
import Loading from './Loading' // Import Loading component

const Home = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [featuredPosts, setFeaturedPosts] = useState([]); // State for storing featured posts
    const { setPostToShow, loading, setLoading } = useContext(GlobalContext); // Destructure context values from GlobalContext
    const themes = []; // Initialize an array to store themes

    // Function to fetch featured posts from the backend
    async function fetchFeaturedPosts() {
        setLoading(true); // Set loading state to true
        try {
            const response = await axios.post("http://127.0.0.1:5000/getFeaturedPosts"); // Make a POST request to get featured posts
            setFeaturedPosts(response.data.featured_posts); // Set the response data to featuredPosts state
        } catch (error) {
            console.log(error); // Log any errors
        } finally {
            setLoading(false); // Set loading state to false
        }
    }

    // Function to set themes from the featured posts
    function setTheme() {
        featuredPosts.map((posts, index) => {
            themes.push(posts.latestItems[0].theme.toUpperCase()); // Push themes to the themes array
        });
    }

    // useEffect to fetch featured posts on component mount
    useEffect(() => {
        if (featuredPosts.length === 0) {
            fetchFeaturedPosts(); // Fetch featured posts if not already fetched
        }
    }, [featuredPosts]);

    // Handler function for item click
    const handleItemClick = (item) => {
        setPostToShow(item); // Set the clicked item to postToShow state
        navigate(`/post/${item._id}`); // Navigate to the post detail page
    }

    // Handler function for theme click
    const handleThemeClick = (theme) => {
        navigate(`/posts/${theme}`); // Navigate to the posts page filtered by theme
    }

    return (
        loading ? <Loading /> : // Show Loading component if loading state is true
            <div className={styles.home_container}>
                {setTheme()}
                {featuredPosts.map((posts, index) => (
                    <div className={styles.theme_container} key={index}>
                        <h1 onClick={() => handleThemeClick(themes[index])}>{themes[index]}</h1>
                        <div className={styles.posts_container}>
                            {posts.latestItems.map((item, itemIndex) => (
                                <div className={styles.items} key={itemIndex}>
                                    <img src={item.image} alt={item.title} />
                                    <h3 onClick={() => handleItemClick(item)}>{item.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
    );
}

export default Home; // Export Home component
