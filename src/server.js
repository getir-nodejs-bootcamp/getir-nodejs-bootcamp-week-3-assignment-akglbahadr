const dotenv = require("dotenv");

dotenv.config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const logger = require("./utils/logger");
app.use(express.json());

const posts = [
  {
    username: "Kyle",
    title: "Post 1",
    content: "ASDHASDHASDHASDHSHDHSD",
  },
  {
    username: "Jim",
    title: "Post 2",
    content: " cscvbcbvbcv",
  },
];

app.get("/posts", logger.log, authenticateToken, (req, res) => {
  res.json(posts.find((post) => post.username === req.body.username));
});
app.post("/posts", logger.log, authenticateToken, (req, res) => {
  const newPost = req.body;
  posts.push(newPost);
  res.status(200).send({ message: "New post is successfully added" });
});
app.put("/posts", logger.log, authenticateToken, (req, res) => {
  const post = req.body;
  const updateIndex = posts.findIndex((ps) => {
    return ps.username === post.username && ps.title === post.title;
  });
  if (updateIndex == -1) {
    res.status(404).send({ message: "Post has not been found." });
    return;
  }
  posts[updateIndex] = post;

  res.status(200).send({ message: "Post is successfully replaced" });
});
app.patch("/posts", logger.log, authenticateToken, (req, res) => {
  const post = req.body;
  const updateIndex = posts.findIndex((ps) => {
    return ps.username === post.username && ps.title === post.title;
  });
  if (updateIndex == -1)
    res.status(404).send({ message: "Post has not been found." });
  posts[updateIndex] = { ...posts[updateIndex], ...post };
  res.status(200).send({ message: "The post is successfully updated" });
});

app.delete("/posts", logger.log, authenticateToken, (req, res) => {
  const post = req.body;
  const indexToDelete = posts.findIndex(
    (ps) => ps.username === post.username && ps.title === post.title
  );
  posts.splice(indexToDelete, 1);
  console.log(posts);
  res.status(200).send({ message: "The post is successfully deleted." });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, "process.env.ACCESS_TOKEN_SECRET", (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const users = [
  {
    name: "test",
    password: "test",
  },
];

app.post("/login", logger.log, (req, res) => {
  // Authenticate User

  const user = req.body;
  const matchingUser = users.find(
    (us) => user.name === us.name && user.password === us.password
  );
  if (matchingUser) {
    const accessToken = generateJwtToken(user);
    res.status(200).send({ accessToken: accessToken });
  }
  res.status(401).send({ message: "Username and or password is wrong." });
});

function generateJwtToken(user) {
  return jwt.sign(user, "process.env.ACCESS_TOKEN_SECRET");
}

app.listen(3000);
