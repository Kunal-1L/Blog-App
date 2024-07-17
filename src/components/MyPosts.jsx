import React, { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../store/GlobalStore";
import axios from "axios";
import Post from './Post'; // Assuming you have a Post component
import Loading from './Loading'; // Assuming you have a Loading component

const MyPosts = () => {
    const { loginId, currentPostList, setCurrentPostList, newPost, setNewPost, loading, setLoading } = useContext(GlobalContext);
    const initialLoad = useRef(true); // Track initial load

    // Function to fetch posts
    const fetchPosts = async (postId = '') => {
        setLoading(true); 
        try {
            let response;
            let posts;
            if (postId === '') {
                // Fetch all posts
                response = await axios.post('http://127.0.0.1:5000/getPosts', { loginId });
                posts = response.data.posts; // response.data.posts is an array
            } else {
                // Fetch a specific post
                response = await axios.post('http://127.0.0.1:5000/getNewPost', { newPost: postId });
                posts = response.data.post ? [response.data.post] : []; 
            }
        
            // Update the current post list
            const updatedPosts = postId === '' ? posts : [...posts, ...currentPostList];
            setCurrentPostList(updatedPosts);
            setNewPost('');
            sessionStorage.setItem('currentPostList', JSON.stringify(updatedPosts)); 
            sessionStorage.setItem('changeFlag', JSON.stringify(false));
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false); 
        }
    };
    
    // Effect to fetch posts on mount and when loginId or newPost changes
    useEffect(() => {
        const storedPosts = JSON.parse(sessionStorage.getItem('currentPostList'));
        if (storedPosts) {
            setCurrentPostList(storedPosts);
            initialLoad.current = false;
        }
        if (loginId !== '' && initialLoad.current) {
            initialLoad.current = false; 
            fetchPosts();
        } else if (newPost !== '' && loginId !== '') {
            fetchPosts(newPost);
        }
    }, [loginId, newPost]);
    
    // Render the posts or loading state
    return (
        loading ? <Loading></Loading> :
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop:"7%", flexDirection: 'column' }}>
            {currentPostList.length > 0 ? (
                currentPostList.map(blog => (
                    <Post key={blog._id} blog={blog} />
                ))
            ) : (
                <h1>No posts available</h1>
            )}
        </div>
    );
};

export default MyPosts;
