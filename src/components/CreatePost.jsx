import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import styles from "./CreatePost.module.css";
import { GlobalContext } from "../store/GlobalStore";

const CreatePost = () => {
  // Use GlobalContext to access loginId and setNewPost function
  const { loginId, setNewPost } = useContext(GlobalContext);
  
  // Refs for form fields
  const blogTitleRef = useRef(null);
  const blogAuthorNameRef = useRef(null);
  const blogThemeRef = useRef(null);
  const blogImageURLRef = useRef(null);
  
  const navigate = useNavigate();
  
  // State to manage blog description
  const [blogDescription, setBlogDescription] = useState("");

  // Function to store the post in the backend
  async function storePost(blog) {
    try {
      const response = await axios.post("http://127.0.0.1:5000/addPost", blog);
      if (response.status === 200) {
        // Alert success message and navigate to 'my-posts' page
        alert(response.data.message + response.data.postId);
        setNewPost(response.data.postId);
        navigate("/my-posts");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  // Handle form submission
  const handleBlogPost = (event) => {
    event.preventDefault();

    const blogTheme = blogThemeRef.current.value;
    const blogTitle = blogTitleRef.current.value;
    const blogAuthorName = blogAuthorNameRef.current.value;
    const blogAuthorId = loginId;
    const blogImageURL = blogImageURLRef.current.value;

    // Call function to store post
    storePost({
      blogTheme,
      blogTitle,
      blogDescription,
      blogImageURL,
      blogAuthorName,
      blogAuthorId,
    });

    // Reset form fields
    blogThemeRef.current.value = "";
    blogAuthorNameRef.current.value = "";
    setBlogDescription("");
    blogImageURLRef.current.value = "";
    blogTitleRef.current.value = "";
  };

  // Customize CKEditor toolbar configuration
  const editorConfiguration = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "underline",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "undo",
      "redo",
    ],
  };

  return (
    <div className={styles.create_container}>
      <form onSubmit={handleBlogPost} className={styles.form_container}>
        <label htmlFor="inputTheme">Select Blog Theme:</label>
        <select id="inputTheme" ref={blogThemeRef} required>
          <option value="">--Choose a Theme--</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="technology">Technology</option>
          <option value="personal-development">Personal Development</option>
          <option value="finance">Finance</option>
          <option value="entertainment">Entertainment</option>
          <option value="education">Education</option>
          <option value="news-and-politics">News and Politics</option>
          <option value="hobbies">Hobbies</option>
          <option value="relationships">Relationships</option>
          <option value="business-and-marketing">Business and Marketing</option>
          <option value="environmental-and-social-issues">
            Environmental and Social Issues
          </option>
        </select>
        <label htmlFor="inputTitle">Blog Title</label>
        <input type="text" id="inputTitle" ref={blogTitleRef} required></input>

        <label htmlFor="inputDescription">Blog Description</label>
        <CKEditor
          editor={ClassicEditor}
          data={blogDescription}
          config={editorConfiguration} // Pass the toolbar configuration
          onChange={(event, editor) => {
            const data = editor.getData();
            setBlogDescription(data);
          }}
        />
        <label htmlFor="inputImageURL">Image URL</label>
        <input
          type="text"
          id="inputImageURL"
          ref={blogImageURLRef}
          required
          placeholder="Insert one image URL related to post"
        ></input>
        <label htmlFor="inputAuthorName">Author Name</label>
        <input type="text" id="inputAuthorName" ref={blogAuthorNameRef}></input>
        <button type="submit" className={styles.submitButton}>
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
