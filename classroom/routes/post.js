const express = require("express");
const router = express.Router();

// Middleware to parse JSON body
router.use(express.json());

// GET All Posts
router.get("/", (req, res) => {
    res.send("GET all posts.");
});

// GET Single Post
router.get("/:id", (req, res) => {
    res.send(`GET post with ID: ${req.params.id}`);
});

// Create a New Post
router.post("/", (req, res) => {
    const newPost = req.body;
    res.status(201).send(`POST to create a post: ${JSON.stringify(newPost)}`);
});

// Delete a Post
router.delete("/:id", (req, res) => {
    res.send(`Post with ID ${req.params.id} deleted.`);
});

module.exports = router;
