const express = require("express");
const router = express.Router();

// Middleware to parse JSON body
router.use(express.json());

// Get all users
router.get("/", (req, res) => {
    res.send("GET for users.");
});

// Get a specific user
router.get("/:id", (req, res) => {
    res.send(`GET for user with ID: ${req.params.id}`);
});

// Create a New User
router.post("/", (req, res) => {
    const newUser = req.body;
    res.status(201).send(`User created: ${JSON.stringify(newUser)}`);
});

// Delete a User
router.delete("/:id", (req, res) => {
    res.send(`User with ID ${req.params.id} deleted.`);
});

module.exports = router;
