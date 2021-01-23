import { useState, useEffect } from "react";
import { db } from "./firebase";
import Post from "./Components/Post";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);

  // Runs code based on a condition
  useEffect(() => {
    // Where the code runs
    db.collection("posts").onSnapshot((snapshot) => {
      // Every time a new post is added, fire this code
      setPosts(snapshot.docs.map((doc) => doc.data()));
    });
  }, []);

  return (
    <div className="App">
      {/* BEM */}
      {/* Header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram Logo"
        />
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <Post
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}
    </div>
  );
}

export default App;
