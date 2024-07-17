import styles from './Post.module.css'; // Import CSS module for styling
import { AiFillLike } from "react-icons/ai"; // Import AiFillLike icon from react-icons/ai
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom

const Post = ({ blog }) => {
    const navigate = useNavigate(); // Initialize useNavigate hook for navigation

    return (
        <div className={styles.blog_container}> {/* Container for the blog post */}
            <div className={styles.blog_img}> {/* Container for the blog image */}
                <img src={blog.image} alt='Not available' /> {/* Display the blog image */}
            </div>
            <div
                className={styles.blog_title}
                onClick={() => navigate(`/post/${String(blog._id)}`)} // Navigate to the post detail page on title click
            >
                {blog.title} {/* Display the blog title */}
            </div>
            <div className={styles.blog_likes}> {/* Container for the likes section */}
                <strong>Liked </strong> {/* Text indicating 'Liked' */}
                <AiFillLike // Like icon
                     style={{ color: 'blue', fontSize: '24px', marginRight: '5px' }} // Styling for the icon
                />
                <strong>by </strong> {/* Text indicating 'by' */}
                {blog.likes} {/* Number of likes */}
                <strong> people</strong> {/* Text indicating 'people' */}
            </div>
        </div>
    );
};

export default Post; // Export the Post component
