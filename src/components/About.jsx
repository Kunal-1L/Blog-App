import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About This Project</h1>
        <p>
          Welcome to our project! This platform allows users to create, view,
          and like blogs. It integrates various technologies to provide a
          seamless experience.
        </p>
      </div>
      <div className="about-content">
        <section className="about-section">
          <h2>Project Overview</h2>
          <p>
            Our project is designed to offer a robust blogging platform where
            users can express their thoughts, read others' posts, and interact
            through likes. The architecture of this platform leverages modern
            web development tools and practices to ensure scalability and
            performance.
          </p>
        </section>
        <section className="about-section">
          <h2>Technologies Used</h2>
          <ul>
            <li>
              <strong>Frontend:</strong> React.js is used to build an
              interactive and dynamic user interface. The component-based
              architecture ensures modularity and reusability.
            </li>
            <li>
              <strong>Backend:</strong> Python Flask is employed for the
              backend, providing a lightweight yet powerful framework for
              handling server-side logic and API endpoints.
            </li>
            <li>
              <strong>Databases:</strong>
              <ul>
                <li>
                  <strong>MySQL:</strong> Used for structured data storage and
                  relational database management, ensuring data integrity and
                  consistency.
                </li>
                <li>
                  <strong>MongoDB:</strong> Utilized for flexible, schema-less
                  data storage, perfect for handling JSON-like documents.
                </li>
              </ul>
            </li>
            <li>
              <strong>Styling:</strong> Bootstrap is integrated for responsive
              design and a modern, clean aesthetic.
            </li>
          </ul>
        </section>
        <section className="about-section">
          <h2>Key Features</h2>
          <ul>
            <li>Create and publish blogs</li>
            <li>View and explore blogs by other users</li>
            <li>Like and interact with posts</li>
            <li>Responsive design for seamless usage across devices</li>
          </ul>
        </section>
        <h2>Future Works</h2>
        <p>
          Implementing Search option to allow users to access blogs more
          efficiently
        </p>
        <h2>Team Members</h2>
        <h4>Kunal Kumar</h4>
        <h4>Chatgpt</h4>
      </div>
    </div>
  );
};

export default About;
