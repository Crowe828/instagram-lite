import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import Post from "./Components/Post";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";
import { Button, Input } from "@material-ui/core";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

// Material-UI styling
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);

  // Sign up and sign in states
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  // Current user state
  const [user, setUser] = useState(null);

  // Handling login/signup input fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // User's posts
  const [posts, setPosts] = useState([]);

  // Setting the state based on whether a user is signed in or not
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // User has logged out
        setUser(null);
      }
    });

    return () => {
      // Perform clean up actions
      unsubscribe();
    };
  }, [user, username]);

  // Runs code based on a condition
  useEffect(() => {
    // Where the code runs
    db.collection("posts").onSnapshot((snapshot) => {
      // Every time a new post is added, fire this code
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
    });
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    // Create and authenticate a new user
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          // Once authenticated, set their username as their display name
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    // Close modal after the user is done signing up
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    // Sign in using the user's email and password
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    // Close modal after the user is done signing in
    setOpenSignIn(false);
  };

  return (
    <div className="App">
      {/* BEM */}
      {/* Sign up modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram Logo"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign up
            </Button>
          </form>
        </div>
      </Modal>
      {/* Sign in modal */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram Logo"
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      {/* Header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram Logo"
        />
      </div>
      {user ? (
        // If a user is logged in, show a logout button
        <Button onClick={() => auth.signOut()}>Logout</Button>
      ) : (
        <div className="app_loginContainer">
          {/* If a user is not logged in, show sign in and a sign up buttons */}
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
      )}

      {/* Posts */}
      {posts.map(({ id, post }) => (
        <Post
          key={id}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}
    </div>
  );
}

export default App;
