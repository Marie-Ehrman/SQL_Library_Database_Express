const express = require('express');
const router = express.Router();
const Book = require('../models').Book; //import the book model with ".Book", we can now use all ORM methods


//Middleware handler function for route callbacks
function asyncHandler(cb){

      return async(req, res, next) => {
        try {
          await cb(req, res, next)
        } catch(error){ // handle rejected promise
          res.status(500).send(error);
        }
      }

}


//****** SELECT BOOKS LIST
router.get('/', asyncHandler(async (req, res) => {

      const books = await Book.findAll({ // get all books from the db
            order: [[ 'title', 'ASC' ]]  // order by title
      } );

      res.render("books/index", { books } ); //render the books list via the index view by passing the books local

}));


//****** NEW BOOK FORM
router.get('/new', (req, res) => {
// When the path is books/new the "new" pug template is rendered
// passing the form an empty book object

      res.render("books/new-book", { book: {} });

});


//******** CREATE BOOK
router.post('/new', asyncHandler(async (req, res) => {
      // create a new book
      let book;
      try {
        book = await Book.create(req.body);  // pass request body to the create method
        res.redirect("/books/" + book.id);   // redirect to the books/id path after created
      } catch (error) {
        if(error.name === "SequelizeValidationError") { // check for the SequelizeValidationError error
          book = await Book.build(req.body);
          res.render("books/form-error", { book, errors: error.errors})
        } else {
          throw error; // throw error to asyncHandler's catch block
        }
      }

  }));


//******** SELECT BOOK BY ITS ID
router.get('/:id', asyncHandler(async (req, res, next) => {
    // find book by its id
    const book = await Book.findByPk(req.params.id);
    if(book) { //if book exists render it's update page
        res.render("books/update-book", { book }); //pass book object local
    } else { //else send 400 error to client
        const err = new Error();
        err.status = 400;
        next(err);
    }

}));


//******** UPDATE BOOK
// explicitly add the book ID since the ID is in the URL as a parameter (:id) and not in req.body.
router.post('/:id', asyncHandler(async (req, res) => {

    let book;
    try {
      book = await Book.findByPk(req.params.id); //find book by id
      if(book) {
        await book.update(req.body); // if id exists, update the Book properties
        res.redirect("/books/" + book.id); // redirect to that book's update page
    } else { //else send 400 error to client
        const err = new Error();
        err.status = 400;
        next(err);
    }
    } catch (error) {
      if(error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id; // update correct book
        res.render("books/update-book", { book, errors: error.errors}) // render updated book info, but display errors
      } else {
        throw error;
      }
    }

}));


//******** DELETE BOOK GET
router.get('/:id/delete', asyncHandler(async (req, res) => {
    // get the book to delete
    const book = await Book.findByPk(req.params.id); // find book by id
    if(book) {
      res.render("books/delete", { book }); // if found, pass the book to the delete route
    } else {
      res.sendStatus(404); //else send 404 error to the client
    }

}));

//******** DELETE BOOK POST
router.post('/:id/delete', asyncHandler(async (req ,res) => {
    // post the delete
    const book = await Book.findByPk(req.params.id);
    if(book) {
      await book.destroy(); // delete the book
      res.redirect("/books"); // when book is deleted redirect to list
    } else {
      res.sendStatus(404); //else send 404 error to the client
    }

}));


module.exports = router;