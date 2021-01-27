import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Post from "./Components/Post";
import ImageUpload from "./Components/ImageUpload";
import "./App.css";

// Modal styling from Material-UIs modal documentation
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
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // Every time a new post is added, fire this code
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
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
            {/* Create a username */}
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {/* Enter an email */}
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Create a password */}
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
            {/* Enter an email of an existing account */}
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Enter the corresponding password */}
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
        {user ? (
          // If a user is logged in, show a logout button and their avatar
          <div className="app__loggedIn">
            <Avatar
              className="app__avatar"
              alt={user?.displayName}
              src="/static/images/avatar/1.jpg"
            />
            <Button onClick={() => auth.signOut()}>Logout</Button>
          </div>
        ) : (
          <div className="app_loginContainer">
            {/* If a user is not logged in, show sign in and a sign up buttons */}
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      {/* Displaying the user's username at the top of the page */}
      {user?.displayName ? (
        <h1 className="app__welcome">Welcome, @{user?.displayName}!</h1>
      ) : (
        <></>
      )}

      <div className="app__posts">
        <div>
          {/* Posts */}
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      </div>

      {/* Upload new pictures */}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        // If you're not logged in...
        <h3 className="app__notLoggedIn">
          Create an account or login to start posting!
        </h3>
      )}
    </div>
  );
}

export default App;
