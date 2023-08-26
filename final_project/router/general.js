const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
      if (!isValid(username)) {
          users.push({ "username": username, "password": password });
          return res.status(200).json({ message: "User successfully registered. Now you can login" });
      } else {
          return res.status(404).json({ message: "User already exists!" });
      }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  const bookResult = {
    books: books
  }
  res.send(JSON.stringify(bookResult, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  const filter_author = Object.entries(books).filter(([isbn, book]) => book.author === author)
    .map(([isbn, book]) => {
      return {
        isbn: isbn,
        title: book.title,
        reviews: book.reviews
      }
    })
  const bookAuthor = {
    booksbyauthor: filter_author
  }
  res.send(JSON.stringify(bookAuthor, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  let filtered_title = Object.values(books).filter((book) => book.title === title)
  res.send(filtered_title)
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const reviews = book.reviews;
  return res.status(200).json(reviews);
});

module.exports.general = public_users;
