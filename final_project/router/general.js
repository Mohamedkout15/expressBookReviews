const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    users.push({ username, password });
    return res.json({ message: "Registration successful" });
  } else {
    return res.status(400).json({ message: "Username already exists" });
  }
});
// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.json(books);
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const authorBooks = Object.values(books).filter(book => book.author === author);
  res.json(authorBooks);
})

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const titleBooks = Object.values(books).filter(book => book.title === title);
  res.json(titleBooks);
});
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});
const axios = require('axios');

public_users.get('/', function (req, res) {
  axios.get('http://localhost:5000/customer/')
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: "Error fetching books" });
    });
});
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/customer/isbn/${isbn}`);
    const book = response.data;
    
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details" });
  }
});
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get('http://localhost:5000/customer/');
    const books = response.data;

    const titleBooks = Object.values(books).filter(book => book.title === title);
    res.json(titleBooks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});



module.exports.general = public_users;
