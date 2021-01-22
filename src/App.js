import { useState } from "react";
import Post from "./Components/Post";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([
    {
      username: "potato_legss",
      caption: "Big stonky",
      imageUrl:
        "https://thumbs-prod.si-cdn.com/pCDKPyJI6L9ZueCJJzdcsZ9D-t0=/fit-in/1600x0/https://public-media.si-cdn.com/filer/a3/3f/a33f8ee0-bfee-4cce-9a13-f9388c5323c0/42-55375529.jpg",
    },
    {
      username: "thatpapi",
      caption: "Well, it works.",
      imageUrl:
        "https://www.freecodecamp.org/news/content/images/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png",
    },
  ]);

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
