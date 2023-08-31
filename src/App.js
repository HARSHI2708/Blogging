import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useParams,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Hero } from "react-landing-page";
import { FaPlusCircle ,FaEdit, FaTrashAlt} from 'react-icons/fa';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="blog-container">
  <h2 className="blog-title">Blog Posts</h2>

  <Link className="create-post-icon" to="/create">
  <FaPlusCircle className="icon" />
</Link>

      <br />
      <div className="card-group">
        {posts.map((post) => (
          <div key={post._id} className="card mt-3">
            <div className="card-body">
              <div className="d-flex">
                
                <div className="image-view">
                  <img
                    src={`http://localhost:5000/uploads/${post.image}`}
                    alt="Post"
                    className="img-fluid" height={150} width={260}
                  />
                  <br/>
                  <div>
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.content}</p>
                </div>
                
                <div className="button-group">
            <Link to={`/edit/${post._id}`} className="btn btn-primary mr-2">
              <FaEdit className="icon" />
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(post._id)}
            >
              <FaTrashAlt className="icon" />
            </button>
          </div>
                </div>
              </div>
            </div>
            <div className="wave"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="container mt-4 post-form">
    <h2 className="post-form-title">Create New Post</h2>
    <div className="form-group">
      <label className="form-label">Title</label>
      <input
        type="text"
        className="form-control"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Content</label>
      <textarea
        className="form-control"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Image</label>
      <input
        type="file"
        className="form-control-file"
        onChange={(e) => setImage(e.target.files[0])}
      />
    </div>
    <button className="btn btn-primary submit-button" onClick={handleCreate}>
      Submit
    </button>
  </div>
  );
}

function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/posts/${id}`)
      .then((response) => {
        setTitle(response.data.title);
        setContent(response.data.content);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }, [id]);

  const handleUpdate = async () => {
    const updatedPostData = { title, content };

    try {
      await axios.put(`http://localhost:5000/posts/${id}`, updatedPostData);
      navigate(`/`);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h2>Edit Post</h2>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button className="btn btn-primary mt-3" onClick={handleUpdate}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Hero backgroundImage="https://i1.wp.com/zeevector.com/wp-content/uploads/Cute-Pastel-Background.png?fit=1937%2C1341&ssl=1" >
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </div>
    </Router>
    </Hero>
  );
}

export default App;